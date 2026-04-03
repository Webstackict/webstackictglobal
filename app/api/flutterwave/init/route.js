import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const FLW_SECRET_KEY = process.env.FLW_SECRET_KEY;
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

        if (!FLW_SECRET_KEY) {
            console.warn("FLW_SECRET_KEY is missing. Returning mock success for development.");
            const mockReference = `MOCK_${Date.now()}`;

            await prisma.payments.create({
                data: {
                    enrollment_id: enrollment.id,
                    amount: amount,
                    reference: mockReference,
                    status: 'PENDING',
                    provider: 'flutterwave_mock',
                    metadata: { mock: true }
                }
            });

            return NextResponse.json({
                url: `${NEXT_BASE_URL}/dashboard?mock_payment=success&tx_ref=${mockReference}`,
                tx_ref: mockReference,
                mock: true
            });
        }

        // create a unique reference using timestamp to avoid duplicate errors on retry
        const tx_ref = `ENR_${enrollment.id.slice(0, 8)}_${Date.now()}`;

        const payload = {
            tx_ref,
            amount: Number(amount),
            currency: "NGN",
            redirect_url: `${NEXT_BASE_URL}/dashboard`, // redirecting them back to dashboard
            customer: {
                email,
                name: enrollment.full_name,
                phone_number: enrollment.phone
            },
            customizations: {
                title: "Course Enrollment",
                description: enrollment.program?.name || "Tech Program",
            },
            meta: {
                enrollment_id: enrollment.id,
                user_id: enrollment.user_id,
                program_name: enrollment.program.name
            }
        };

        const response = await fetch("https://api.flutterwave.com/v3/payments", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${FLW_SECRET_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const initData = await response.json();

        if (initData.status === "success" || initData.status === "successful") {
            // Create a payment record
            await prisma.payments.create({
                data: {
                    enrollment_id: enrollment.id,
                    amount: amount,
                    reference: tx_ref,
                    status: 'PENDING',
                    provider: 'flutterwave',
                    metadata: initData.data
                }
            });

            // Update enrollment as well
            await prisma.enrollments.update({
                where: { id: enrollment.id },
                data: {
                    flutterwave_tx_ref: tx_ref
                }
            });

            return NextResponse.json({
                url: initData.data.link,
                tx_ref: tx_ref
            });
        } else {
            console.error("Flutterwave API error:", initData);
            return NextResponse.json(
                { success: false, message: initData.message || "Flutterwave initialization failed" },
                { status: 400 }
            );
        }

    } catch (err) {
        console.error("Flutterwave init error:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
