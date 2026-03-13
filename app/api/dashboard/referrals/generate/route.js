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

        // Check if referral exists
        const existingReferral = await prisma.referrals.findUnique({
            where: { user_id: user.id }
        });

        if (existingReferral) {
            return NextResponse.json({ success: false, error: "You already have a referral code" }, { status: 400 });
        }

        // Get user profile for a prettier prefix
        const userProfile = await prisma.user_profile.findUnique({
            where: { user_id: user.id }
        });

        // Generate Code: WEBSTACK-{NAME}-{RANDOM}
        let prefix = "USER";
        if (userProfile?.full_name) {
            prefix = userProfile.full_name.split(" ")[0].toUpperCase().replace(/[^A-Z]/g, '');
        } else if (user.email) {
            prefix = user.email.split("@")[0].toUpperCase().replace(/[^A-Z]/g, '').substring(0, 5);
        }

        const randomNum = Math.floor(100 + Math.random() * 900); // 3 digits
        const randomChar = String.fromCharCode(65 + Math.floor(Math.random() * 26)); // 1 letter
        const referralCode = `Webstack-${randomNum}${randomChar}`;

        const newReferral = await prisma.referrals.create({
            data: {
                user_id: user.id,
                referral_code: referralCode,
                commission_rate: 10.0,
            }
        });

        return NextResponse.json({ success: true, referral: newReferral }, { status: 201 });
    } catch (error) {
        console.error("Failed to generate user referral code", error);
        return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
    }
}
