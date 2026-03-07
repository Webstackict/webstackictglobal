import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSupabaseServerClient } from "@/lib/db/supabaseServer";

export async function GET(request) {
    try {
        const supabase = await createSupabaseServerClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        // Fetch User's Referral Data
        const referral = await prisma.referrals.findUnique({
            where: { user_id: user.id }
        });

        if (!referral) {
            return NextResponse.json({ success: true, referral: null, activities: [] });
        }

        // Fetch Recent Activities
        const activities = await prisma.referral_activities.findMany({
            where: { referrer_id: user.id },
            include: {
                referred_user: {
                    select: {
                        email: true,
                        user_profile: {
                            select: { full_name: true }
                        }
                    }
                },
                cohorts: {
                    include: {
                        departments: {
                            select: { name: true }
                        }
                    }
                }
            },
            orderBy: { created_at: 'desc' },
            take: 20
        });

        // Fetch Top Referrers for Leaderboard
        const topReferrers = await prisma.referrals.findMany({
            where: {
                total_referrals: { gt: 0 }
            },
            include: {
                users: {
                    select: {
                        user_profile: { select: { full_name: true } }
                    }
                }
            },
            orderBy: { total_earned: 'desc' },
            take: 10
        });

        return NextResponse.json({
            success: true,
            referral,
            activities,
            topReferrers
        });
    } catch (error) {
        console.error("Failed to fetch dashboard referrals", error);
        return NextResponse.json({ success: false, error: "Failed to fetch data" }, { status: 500 });
    }
}
