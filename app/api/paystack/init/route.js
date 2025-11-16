// app/api/paystack/init/route.js
import { createSupabaseServerClient } from "@/lib/db/supabaseServer";
import { NextResponse } from "next/server";

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;
const NEXT_BASE_URL = process.env.NEXT_PUBLIC_SITE_URL;

export async function POST(req) {
  const supabase = await createSupabaseServerClient();

  try {
    const body = await req.json();
    const { userId, departmentId, nextCohortId, email, amount } = body;

    if (!email || !amount) {
      return NextResponse.json(
        { error: "email and amount required" },
        { status: 400 }
      );
    }

    // Paystack expects amount in kobo (NGN): multiply by 100
    const paystackAmount = Math.round(amount * 100);

    const initResponse = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          amount: paystackAmount,
          callback_url: `${NEXT_BASE_URL}/dashboard`, //frontend page paystack redirect to after webhiok verification(eg. dashboard or successpage)
        }),
      }
    );

    const initData = await initResponse.json();
    if (!initData.status) {
      return NextResponse.json(
        { success: false, message: initData.message },
        { status: 400 }
      );
    }

    const { data: insertData, error: insertError } = await supabase
      .from("enrollments")
      .insert({
        user_id: userId,
        department_id: departmentId,
        cohort_id: nextCohortId,
        paystack_reference: initData.data.reference,
        paystack_auth_url: initData.data.authorization_url,
      });

    if (insertError) {
      return NextResponse.json(
        { success: false, message: insertError.message },
        { status: 500 }
      );
    }

    // initData.data.authorization_url is what you redirect the user to.
    return NextResponse.json({
      url: initData.data.authorization_url,
      reference: initData.data.reference,
      paystack: initData.data,
    });
  } catch (err) {
    console.error("paystack init error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
