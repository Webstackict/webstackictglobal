// app/api/paystack/webhook/route.js
import { NextResponse } from "next/server";
import crypto from "crypto";
import { createSupabaseServerClient } from "@/lib/db/supabaseServer";
import { revalidatePath } from "next/cache";

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;

export const runtime = "nodejs";

export async function POST(req) {
  const supabase = await createSupabaseServerClient();
  try {
    const rawBody = await req.text(); // raw body as string
    const signature = req.headers.get("x-paystack-signature");

    // Verify webhook signature
    const hash = crypto
      .createHmac("sha512", PAYSTACK_SECRET)
      .update(rawBody)
      .digest("hex");
    if (hash !== signature) {
      return NextResponse.json(
        { success: false, message: "Invalid signature" },
        { status: 400 }
      );
    }

    if (hash !== signature) {
      console.warn("Invalid Paystack signature");
      return new NextResponse(null, { status: 401 });
    }

    const body = JSON.parse(rawBody);

    // Only process successful transaction events (you can filter event type)
    const event = body.event;
    const eventData = body.data;

    if (
      event === "charge.success" ||
      (eventData && eventData.status === "success")
    ) {
      const reference = eventData.reference;
      // const amount = eventData.amount;
      // const customerEmail = eventData.customer?.email;

      const verifyRes = await fetch(
        `https://api.paystack.co/transaction/verify/${reference}`,
        {
          headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` },
        }
      );
      const verifyData = await verifyRes.json();

      if (verifyData.status && verifyData.data.status === "success") {
        const { data: enrollmentData, error: enrollmentError } = await supabase
          .from("enrollments")
          .select(
            `
               *,
               departments (
                name
               ),
               cohorts (
                id,
                cohort_number,
                max_size
               )
             `
          )
          .eq("paystack_reference", reference)
          .maybeSingle();

        if (enrollmentError) {
          console.error("Supabase webhook enrollment error:", {
            message: enrollmentError.message,
            code: enrollmentError.code,
            details: enrollmentError.details,
          });
          return NextResponse.json(
            { success: false, message: enrollmentError.message },
            { status: 500 }
          );
        }

        if (!enrollmentData)
          return NextResponse.json(
            { success: false, message: "Enrollment not found" },
            { status: 404 }
          );

        const cohortId = enrollmentData.cohorts.id;

        const { data, error } = await supabase
          .from("enrollments")
          .update({ payment_status: "paid" })
          .eq("id", enrollmentData.id);

        if (error) {
          return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
          );
        }

        // --- REFERRAL COMMISSION LOGIC ---
        try {
          const { data: pendingReferral } = await supabase
            .from("referral_activities")
            .select("*")
            .eq("enrollment_id", enrollmentData.id)
            .eq("status", "pending")
            .maybeSingle();

          if (pendingReferral) {
            // Update referral activity to confirmed atomically
            const { data: updatedRefAct } = await supabase
              .from("referral_activities")
              .update({ status: "confirmed" })
              .eq("id", pendingReferral.id)
              .eq("status", "pending")
              .select();

            if (updatedRefAct && updatedRefAct.length > 0) {
              // Retrieve the referrer details
              const { data: referrer } = await supabase
                .from("referrals")
                .select("*")
                .eq("user_id", pendingReferral.referrer_id)
                .maybeSingle();

              if (referrer) {
                await supabase
                  .from("referrals")
                  .update({
                    total_earned: Number(referrer.total_earned) + Number(pendingReferral.commission_amount),
                    total_referrals: Number(referrer.total_referrals) + 1
                  })
                  .eq("id", referrer.id);
              }
            }
          }
        } catch (refError) {
          console.error("Referral webhook error:", refError);
        }
        // --- END REFERRAL COMMISSION LOGIC ---

        const departmentName = enrollmentData.departments.name;
        const cohortNumber = enrollmentData.cohorts.cohort_number;
        const cohortMaxsize = enrollmentData.cohorts.max_size;

        const { data: notificationData, error: notificationError } =
          await supabase.from("notifications").insert({
            user_id: enrollmentData.user_id,
            title: "Payment Success",
            message: `Congratulations! You have successfully enrolled in ${departmentName} C-${cohortNumber}. Goodluck from WEBSTACK. `,
          });

        if (notificationError) {
          return NextResponse.json(
            { success: false, message: notificationError.message },
            { status: 500 }
          );
        }

        const { count, error: countError } = await supabase
          .from("enrollments")
          .select("*", { count: "exact", head: true })
          .eq("cohort_id", cohortId);

        if (countError) {
          return NextResponse.json(
            { success: false, message: countError.message },
            { status: 500 }
          );
        }

        if (count == cohortMaxsize) {
          const { data: updateCohortStatus, error: updateCohortStatusError } =
            await supabase
              .from("cohorts")
              .update({ status: "in_progress" })
              .eq("id", cohortId);

          if (updateCohortStatusError) {
            return NextResponse.json(
              { success: false, message: updateCohortStatusError.message },
              { status: 500 }
            );
          }
        }
      }
    }
    revalidatePath("/");
    return NextResponse.json({ success: true, status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
