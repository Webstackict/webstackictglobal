import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-paystack-signature");

    // Verify webhook signature
    const hash = crypto
      .createHmac("sha512", PAYSTACK_SECRET)
      .update(rawBody)
      .digest("hex");

    if (hash !== signature) {
      console.warn("Invalid Paystack signature");
      return NextResponse.json({ success: false, message: "Invalid signature" }, { status: 400 });
    }

    const body = JSON.parse(rawBody);
    const event = body.event;
    const eventData = body.data;

    if (event === "charge.success") {
      const reference = eventData.reference;

      // Use a transaction to ensure atomic updates
      await prisma.$transaction(async (tx) => {
        // 1. Find and update the payment record
        const payment = await tx.payments.findUnique({
          where: { reference },
        });

        if (!payment) {
          console.error(`Payment not found for reference: ${reference}`);
          return;
        }

        if (payment.status === 'successful') {
          console.log(`Payment ${reference} already processed`);
          return;
        }

        await tx.payments.update({
          where: { id: payment.id },
          data: {
            status: 'successful',
            updated_at: new Date()
          }
        });

        // 2. Update the enrollment status
        const enrollment = await tx.enrollments.update({
          where: { id: payment.enrollment_id },
          data: {
            payment_status: 'successful',
            updated_at: new Date()
          },
          include: {
            program: true,
            cohort: true
          }
        });

        // 3. Update referral activity if it exists
        const referralActivity = await tx.referral_activities.findFirst({
          where: { enrollment_id: enrollment.id }
        });

        if (referralActivity) {
          await tx.referral_activities.update({
            where: { id: referralActivity.id },
            data: { status: 'approved' } // Mark as approved after payment
          });
        }

        // 4. Create Notification
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
    console.error("Paystack Webhook Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
