import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const FLW_SECRET_KEY = process.env.FLW_SECRET_KEY;
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

        const uniqueRefForFlutterwave = applicationReference;

        if (!FLW_SECRET_KEY) {
            console.warn("FLW_SECRET_KEY is missing. Returning mock success for development.");
            return NextResponse.json({
                url: `${NEXT_BASE_URL}/scholarships/payment/success?tx_ref=${uniqueRefForFlutterwave}&mock=true`,
                tx_ref: uniqueRefForFlutterwave,
                mock: true
            });
        }

        const payload = {
            tx_ref: uniqueRefForFlutterwave,
            amount: Number(amount),
            currency: "NGN",
            redirect_url: `${NEXT_BASE_URL}/scholarships/payment/success`,
            customer: {
                email,
                name: application.full_name,
                phone_number: application.phone
            },
            customizations: {
                title: "Scholarship Application",
                description: application.program?.title || "Tech Program",
            },
            meta: {
                application_id: application.id,
                type: "SCHOLARSHIP_APPLICATION"
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

        const data = await response.json();

        if (data.status === "success" || data.status === "successful") {
            // Mark as flutterwave checkout initiated
            await prisma.scholarship_applications.update({
                where: { id: application.id },
                data: {
                    payment_method: 'flutterwave',
                    flutterwave_tx_ref: uniqueRefForFlutterwave
                }
            });

            return NextResponse.json({
                url: data.data.link,
                tx_ref: uniqueRefForFlutterwave
            });
        } else {
            console.error("Flutterwave API error:", data);
            return NextResponse.json(
                { success: false, message: data.message || "Flutterwave initialization failed" },
                { status: 400 }
            );
        }

    } catch (err) {
        console.error("Scholarship Flutterwave init error:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
