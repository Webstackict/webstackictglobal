import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSupabaseServerClient } from "@/lib/db/supabaseServer";

export async function POST(request) {
    try {
        const supabase = await createSupabaseServerClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        // Check if user already has a pending or approved request
        const profile = await prisma.user_profile.findUnique({
            where: { user_id: user.id },
            select: { affiliate_status: true }
        });

        if (profile?.affiliate_status === 'pending') {
            return NextResponse.json({ success: false, error: "You already have a pending request." }, { status: 400 });
        }

        if (profile?.affiliate_status === 'approved') {
            return NextResponse.json({ success: false, error: "You are already an approved affiliate." }, { status: 400 });
        }

        // Create the request and ensure profile exists
        await prisma.$transaction([
            prisma.affiliate_requests.create({
                data: {
                    user_id: user.id,
                    status: 'pending'
                }
            }),
            prisma.user_profile.upsert({
                where: { user_id: user.id },
                update: { affiliate_status: 'pending' },
                create: {
                    user_id: user.id,
                    full_name: user.user_metadata?.full_name || user.email?.split('@')[0],
                    affiliate_status: 'pending'
                }
            })
        ]);

        return NextResponse.json({
            success: true,
            message: "Your request has been submitted. Please wait for admin approval."
        });
    } catch (error) {
        console.error("Failed to submit affiliate request:", error);
        return NextResponse.json({
            success: false,
            error: "Failed to submit request",
            details: error.message
        }, { status: 500 });
    }
}
