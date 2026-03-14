import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;
const NEXT_BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export async function POST(req) {
  try {
    const body = await req.json();
    const { enrollmentId } = body;

    if (!enrollmentId) {
      return NextResponse.json({ error: "Enrollment ID is required" }, { status: 400 });
    }

    // Fetch enrollment with program details
    const enrollment = await prisma.enrollments.findUnique({
      where: { id: enrollmentId },
      include: {
        program: true
      }
    });

    if (!enrollment) {
      return NextResponse.json({ error: "Enrollment not found" }, { status: 404 });
    }

    const email = enrollment.email;
    const amount = enrollment.applied_price || enrollment.program.discount_price || enrollment.program.price;

    if (!email || !amount) {
      return NextResponse.json({ error: "Email and amount are missing from enrollment" }, { status: 400 });
    }

    // Paystack expects amount in kobo (NGN): multiply by 100
    const paystackAmount = Math.round(Number(amount) * 100);

    if (!PAYSTACK_SECRET) {
      console.warn("PAYSTACK_SECRET_KEY is missing. Returning mock success for development.");
      // Return a mock success response to unblock development/testing
      const mockReference = `MOCK_${Date.now()}`;

      await prisma.payments.create({
        data: {
          enrollment_id: enrollment.id,
          amount: amount,
          reference: mockReference,
          status: 'PENDING',
          provider: 'paystack_mock',
          metadata: { mock: true }
        }
      });

      return NextResponse.json({
        url: `${NEXT_BASE_URL}/dashboard?mock_payment=success&ref=${mockReference}`,
        reference: mockReference,
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
          callback_url: `${NEXT_BASE_URL}/api/paystack/callback`,
          metadata: {
            enrollment_id: enrollment.id,
            user_id: enrollment.user_id,
            program_name: enrollment.program.name
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

    // Create a payment record
    await prisma.payments.create({
      data: {
        enrollment_id: enrollment.id,
        amount: amount,
        reference: initData.data.reference,
        status: 'PENDING',
        provider: 'paystack',
        metadata: initData.data
      }
    });

    return NextResponse.json({
      url: initData.data.authorization_url,
      reference: initData.data.reference
    });

  } catch (err) {
    console.error("Paystack init error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
