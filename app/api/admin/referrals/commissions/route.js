import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const commissions = await prisma.referral_activities.findMany({
            include: {
                referrer: {
                    select: {
                        email: true,
                        user_profile: { select: { full_name: true } }
                    }
                },
                referred_user: {
                    select: {
                        email: true,
                        user_profile: { select: { full_name: true } }
                    }
                }
            },
            orderBy: { created_at: 'desc' }
        });

        return NextResponse.json({ success: true, commissions });
    } catch (error) {
        console.error("Failed to fetch commissions", error);
        return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        const { activityId, status } = await request.json();

        if (!activityId || !status) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const updated = await prisma.referral_activities.update({
            where: { id: activityId },
            data: { status }
        });

        return NextResponse.json({ success: true, updated });
    } catch (error) {
        console.error("Failed to update commission status", error);
        return NextResponse.json({ error: "Failed to update" }, { status: 500 });
    }
}
