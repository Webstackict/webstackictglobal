import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const FLW_SECRET_KEY = process.env.FLW_SECRET_KEY;

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const tx_ref = searchParams.get('tx_ref');
        const transaction_id = searchParams.get('transaction_id');

        if (!transaction_id) {
            return NextResponse.json({ error: "transaction_id is required" }, { status: 400 });
        }

        if (FLW_SECRET_KEY) {
            const verifyRes = await fetch(`https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`, {
                headers: {
                    Authorization: `Bearer ${FLW_SECRET_KEY}`
                }
            });
            const verifyData = await verifyRes.json();

            if (verifyData.status !== "success") {
                return NextResponse.json({ success: false, message: "Verification failed on Flutterwave" }, { status: 400 });
            }

            return NextResponse.json({
                success: true,
                status: verifyData.data.status,
                amount: verifyData.data.amount,
                currency: verifyData.data.currency,
                tx_ref: verifyData.data.tx_ref
            });
        }

        // Mock success if no secret key configured
        return NextResponse.json({
            success: true,
            status: "successful",
            mock: true
        });

    } catch (err) {
        console.error("Flutterwave verification error:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
