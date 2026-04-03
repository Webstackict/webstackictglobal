import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const FLW_SECRET_HASH = process.env.FLW_SECRET_HASH || process.env.NEXT_PUBLIC_FLW_SECRET_HASH;
const FLW_SECRET_KEY = process.env.FLW_SECRET_KEY;

export const runtime = "nodejs";

export async function POST(req) {
    try {
        const signature = req.headers.get("verif-hash");

        if (!signature || (FLW_SECRET_HASH && signature !== FLW_SECRET_HASH)) {
            console.warn("Invalid Flutterwave signature");
            return NextResponse.json({ success: false, message: "Invalid signature" }, { status: 401 });
        }

        const body = await req.json();
        const eventData = body.data;

        if (body.event === "charge.completed" && eventData && eventData.status === "successful") {
            const tx_ref = eventData.tx_ref;
            const transaction_id = eventData.id;

            // Verify the transaction with Flutterwave API before processing
            let amount = eventData.amount;
            let currency = eventData.currency;

            if (FLW_SECRET_KEY && transaction_id) {
                const verifyRes = await fetch(`https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`, {
                    headers: {
                        Authorization: `Bearer ${FLW_SECRET_KEY}`
                    }
                });
                const verifyData = await verifyRes.json();

                if (verifyData.status !== "success" || verifyData.data.status !== "successful") {
                    return NextResponse.json({ success: false, message: "Transaction verification failed" }, { status: 400 });
                }
                amount = verifyData.data.amount;
                currency = verifyData.data.currency;
            } else {
                console.warn("FLW_SECRET_KEY missing. Skipping aggressive server-to-server verification.");
            }

            // 1. Handle Scholarship Application Payments
            if (tx_ref.includes("WS-SCH-") || tx_ref.includes("SCH") || body.data?.meta?.type === "SCHOLARSHIP_APPLICATION") {
                const application = await prisma.scholarship_applications.findFirst({
                    where: {
                        OR: [
                            { flutterwave_tx_ref: tx_ref },
                            { application_reference: tx_ref }
                        ]
                    }
                });

                if (application) {
                    if (application.payment_status === 'paid') {
                        return NextResponse.json({ success: true, message: "Already processed" }, { status: 200 });
                    }

                    if (Number(application.application_fee) > amount || currency !== "NGN") {
                        console.error(`Invalid amount for Scholarship ${tx_ref}. Expected ${application.application_fee}, got ${amount}`);
                        return NextResponse.json({ success: false, message: "Invalid amount" }, { status: 400 });
                    }

                    await prisma.scholarship_applications.update({
                        where: { id: application.id },
                        data: {
                            payment_status: 'paid',
                            payment_verified_at: new Date(),
                            flutterwave_transaction_id: String(transaction_id)
                        }
                    });

                    try {
                        const { processScholarshipApproval } = await import('@/lib/actions/scholarship-approval');
                        processScholarshipApproval(application.id).catch(e => console.error("Webhook automation error:", e));
                    } catch (e) {
                        console.error("Failed to run webhook automation module:", e);
                    }

                    revalidatePath("/admin/scholarship-applications");
                    return NextResponse.json({ success: true }, { status: 200 });
                }
            }

            // 2. Handle Standard Enrollment Payments
            await prisma.$transaction(async (tx) => {
                const payment = await tx.payments.findFirst({
                    where: { reference: tx_ref },
                });

                if (!payment) {
                    console.error(`Payment not found for reference: ${tx_ref}`);
                    return; // Ignore if not found
                }

                if (payment.status === 'PAID') {
                    return;
                }

                if (Number(payment.amount) > amount || currency !== "NGN") {
                    console.error(`Invalid amount for Payment ${tx_ref}`);
                    return;
                }

                await tx.payments.update({
                    where: { id: payment.id },
                    data: {
                        status: 'PAID',
                        updated_at: new Date()
                    }
                });

                const enrollment = await tx.enrollments.update({
                    where: { id: payment.enrollment_id },
                    data: {
                        payment_status: 'PAID',
                        approval_status: 'AWAITING_APPROVAL',
                        flutterwave_transaction_id: String(transaction_id),
                        updated_at: new Date()
                    },
                    include: {
                        program: true,
                        cohort: true
                    }
                });

                const referralActivity = await tx.referral_activities.findFirst({
                    where: { enrollment_id: enrollment.id }
                });

                if (referralActivity) {
                    await tx.referral_activities.update({
                        where: { id: referralActivity.id },
                        data: { status: 'approved' }
                    });
                }

                if (enrollment.user_id) {
                    await tx.notifications.create({
                        data: {
                            user_id: enrollment.user_id,
                            title: "Enrollment Confirmed!",
                            message: `Congratulations! Your payment for ${enrollment.program.name} (${enrollment.cohort.name}) was successful. You now have full access to your resources.`
                        }
                    });
                }
            });

            revalidatePath("/dashboard");
            revalidatePath("/admin/admissions");
        }

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("Flutterwave Webhook Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
