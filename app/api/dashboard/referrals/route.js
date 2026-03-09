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

        // Fetch User's Referral Data and Profile
        const [referral, profile] = await Promise.all([
            prisma.referrals.findUnique({
                where: { user_id: user.id }
            }),
            prisma.user_profile.findUnique({
                where: { user_id: user.id },
                select: { affiliate_status: true }
            })
        ]);

        if (!referral) {
            return NextResponse.json({
                success: true,
                referral: null,
                profile: profile,
                activities: [],
                earningsStats: { pending: 0, approved: 0, paid: 0 },
                topReferrers: []
            });
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

        // Calculate Status-based Earnings
        const earnings = await prisma.referral_activities.groupBy({
            by: ['status'],
            where: { referrer_id: user.id },
            _sum: { commission_amount: true }
        });

        const earningsStats = {
            pending: earnings.find(e => e.status === 'pending')?._sum.commission_amount || 0,
            approved: earnings.find(e => e.status === 'approved')?._sum.commission_amount || 0,
            paid: earnings.find(e => e.status === 'paid')?._sum.commission_amount || 0,
        };

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
            profile,
            activities,
            earningsStats,
            topReferrers
        });
    } catch (error) {
        console.error("Failed to fetch dashboard referrals:", error);
        return NextResponse.json({
            success: false,
            error: "Failed to fetch data",
            details: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
