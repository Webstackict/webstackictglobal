import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin-auth";

export async function GET() {
    if (!await isAdmin()) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const referrals = await prisma.referrals.findMany({
            include: {
                users: {
                    select: {
                        email: true,
                        user_profile: {
                            select: {
                                full_name: true,
                            }
                        }
                    }
                }
            },
            orderBy: {
                total_earned: 'desc'
            }
        });

        const stats = await prisma.referrals.aggregate({
            _sum: {
                total_earned: true,
                total_referrals: true
            }
        });

        return NextResponse.json({
            referrals,
            stats: {
                total_commissions: stats._sum.total_earned || 0,
                total_referrals: stats._sum.total_referrals || 0,
            }
        });
    } catch (error) {
        console.error("Failed to fetch referrals", error);
        return NextResponse.json({ error: "Failed to fetch referrals" }, { status: 500 });
    }
}

export async function POST(request) {
    if (!await isAdmin()) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ error: "User email is required" }, { status: 400 });
        }

        // Find user by email
        const user = await prisma.users.findFirst({
            where: { email }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Check if referral exists
        const existingReferral = await prisma.referrals.findUnique({
            where: { user_id: user.id }
        });

        if (existingReferral) {
            return NextResponse.json({ error: "User already has a referral code" }, { status: 400 });
        }

        // Get user profile for a prettier prefix
        const userProfile = await prisma.user_profile.findUnique({
            where: { user_id: user.id }
        });

        // Generate Code: WEBSTACK-{NAME}-{RANDOM}
        let prefix = "USER";
        if (userProfile?.full_name) {
            prefix = userProfile.full_name.split(" ")[0].toUpperCase().replace(/[^A-Z]/g, '');
        } else if (email) {
            prefix = email.split("@")[0].toUpperCase().replace(/[^A-Z]/g, '').substring(0, 5);
        }

        const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
        const year = new Date().getFullYear();
        const referralCode = `WEBSTACK-${prefix}-${randomStr}-${year}`;

        const newReferral = await prisma.referrals.create({
            data: {
                user_id: user.id,
                referral_code: referralCode,
                commission_rate: 10.0,
            }
        });

        return NextResponse.json({ success: true, referral: newReferral }, { status: 201 });
    } catch (error) {
        console.error("Failed to generate referral code", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
