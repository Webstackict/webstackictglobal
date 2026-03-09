import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const requests = await prisma.affiliate_requests.findMany({
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
            orderBy: { created_at: 'desc' }
        });

        return NextResponse.json({ success: true, requests });
    } catch (error) {
        console.error("Failed to fetch affiliate requests", error);
        return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        const { requestId, status, userId } = await request.json();

        if (!requestId || !status || !userId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        if (status === 'approved') {
            // Check if user already has a referral code
            const existingReferral = await prisma.referrals.findUnique({
                where: { user_id: userId }
            });

            if (existingReferral) {
                return NextResponse.json({ error: "User already has a referral code" }, { status: 400 });
            }

            // Generate Referral Code
            const userProfile = await prisma.user_profile.findUnique({
                where: { user_id: userId }
            });
            const userEmail = await prisma.users.findUnique({
                where: { id: userId },
                select: { email: true }
            });

            let prefix = "USER";
            if (userProfile?.full_name) {
                prefix = userProfile.full_name.split(" ")[0].toUpperCase().replace(/[^A-Z]/g, '');
            } else if (userEmail?.email) {
                prefix = userEmail.email.split("@")[0].toUpperCase().replace(/[^A-Z]/g, '').substring(0, 5);
            }

            const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
            const year = new Date().getFullYear();
            const referralCode = `WST-${prefix}-${randomStr}-${year}`;

            // Atomic update using transaction
            await prisma.$transaction([
                prisma.affiliate_requests.update({
                    where: { id: requestId },
                    data: { status: 'approved' }
                }),
                prisma.user_profile.update({
                    where: { user_id: userId },
                    data: { affiliate_status: 'approved' }
                }),
                prisma.referrals.create({
                    data: {
                        user_id: userId,
                        referral_code: referralCode,
                        commission_rate: 10.0, // Default 10%
                    }
                })
            ]);

            return NextResponse.json({ success: true, message: "Request approved and referral code generated." });
        } else {
            // Rejected
            await prisma.$transaction([
                prisma.affiliate_requests.update({
                    where: { id: requestId },
                    data: { status: 'rejected' }
                }),
                prisma.user_profile.update({
                    where: { user_id: userId },
                    data: { affiliate_status: 'rejected' }
                })
            ]);
            return NextResponse.json({ success: true, message: "Request rejected." });
        }
    } catch (error) {
        console.error("Failed to update affiliate request", error);
        return NextResponse.json({ error: "Failed to update request" }, { status: 500 });
    }
}
