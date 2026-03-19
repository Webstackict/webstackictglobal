import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;
const NEXT_BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export async function POST(req) {
    try {
        const body = await req.json();
        const { applicationReference } = body;

        if (!applicationReference) {
            return NextResponse.json({ error: "Application Reference is required" }, { status: 400 });
        }

        const application = await prisma.scholarship_applications.findUnique({
            where: { application_reference: applicationReference },
            include: {
                program: true
            }
        });

        if (!application) {
            return NextResponse.json({ error: "Application not found" }, { status: 404 });
        }

        const email = application.email;
        const amount = application.application_fee;

        if (!email || !amount) {
            return NextResponse.json({ error: "Email and amount are missing from application" }, { status: 400 });
        }

        // Paystack expects amount in NGN kobo: multiply by 100
        const paystackAmount = Math.round(Number(amount) * 100);

        // We pass our existing applicationReference to Paystack instead of taking theirs
        // or we can let Paystack generate one and save it. Let's send our own reference.
        const uniqueRefForPaystack = applicationReference;

        if (!PAYSTACK_SECRET) {
            console.warn("PAYSTACK_SECRET_KEY is missing. Returning mock success for development.");
            return NextResponse.json({
                url: `${NEXT_BASE_URL}/scholarships/payment/success?ref=${uniqueRefForPaystack}&mock=true`,
                reference: uniqueRefForPaystack,
                mock: true
            });
        }

        const initResponse = await fetch(
            "https://api.api.paystack.co/transaction/initialize",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${PAYSTACK_SECRET}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    amount: paystackAmount,
                    reference: uniqueRefForPaystack,
                    callback_url: `${NEXT_BASE_URL}/scholarships/payment/success?ref=${uniqueRefForPaystack}`,
                    metadata: {
                        application_id: application.id,
                        type: "SCHOLARSHIP_APPLICATION",
                        program_name: application.program?.title
                    }
                }),
            }
        );

        const initData = await initResponse.json();
        if (!initData.status) {
            console.error("Paystack API error:", initData);
            return NextResponse.json(
                { success: false, message: initData.message || "Paystack initialization failed" },
                { status: 400 }
            );
        }

        // Mark as paystack checkout initiated
        await prisma.scholarship_applications.update({
            where: { id: application.id },
            data: {
                payment_method: 'paystack',
                paystack_reference: uniqueRefForPaystack
            }
        });

        return NextResponse.json({
            url: initData.data.authorization_url,
            reference: uniqueRefForPaystack
        });

    } catch (err) {
        console.error("Scholarship Paystack init error:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
