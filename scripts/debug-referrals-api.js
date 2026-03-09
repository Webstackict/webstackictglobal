const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const userId = '3abbd199-7b80-4fee-ace5-ede92e8f305b';
    console.log(`Testing referral dashboard data for user_id: ${userId}`);

    try {
        // 1. Fetch Referral and Profile
        console.log('Fetching referral and profile...');
        const [referral, profile] = await Promise.all([
            prisma.referrals.findUnique({
                where: { user_id: userId }
            }),
            prisma.user_profile.findUnique({
                where: { user_id: userId },
                select: { affiliate_status: true }
            })
        ]);
        console.log('Referral:', referral);
        console.log('Profile:', profile);

        if (!referral) {
            console.log('No referral record. Returning early success state (mocking API behavior).');
            return;
        }

        // 2. Fetch Recent Activities
        console.log('Fetching activities...');
        const activities = await prisma.referral_activities.findMany({
            where: { referrer_id: userId },
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
        console.log(`Found ${activities.length} activities.`);

        // 3. Calculate Status-based Earnings
        console.log('Calculating earnings...');
        const earnings = await prisma.referral_activities.groupBy({
            by: ['status'],
            where: { referrer_id: userId },
            _sum: { commission_amount: true }
        });
        console.log('Earnings stats raw:', earnings);

        // 4. Fetch Top Referrers
        console.log('Fetching top referrers...');
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
        console.log(`Found ${topReferrers.length} top referrers.`);

        console.log('All queries successful.');

    } catch (error) {
        console.error('DIAGNOSTIC FAILED:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
