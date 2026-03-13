import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

export async function POST(request) {
    try {
        const body = await request.json();
        const { user_id, cohort_id, program_id, status = 'pending' } = body;

        // Basic validation
        if (!cohort_id || !program_id) {
            return NextResponse.json({ error: 'Cohort ID and Program ID are required' }, { status: 400 });
        }

        // Retry logic for database operations
        const executeWithRetry = async (fn, retries = 3, delay = 1000) => {
            for (let i = 0; i < retries; i++) {
                try {
                    return await fn();
                } catch (err) {
                    const isConnectionError = err.message.includes("Can't reach database server") ||
                        err.message.includes("Timed out") ||
                        err.message.includes("Connection error");

                    if (isConnectionError && i < retries - 1) {
                        console.warn(`Database connection attempt ${i + 1} failed. Retrying in ${delay}ms...`);
                        await new Promise(resolve => setTimeout(resolve, delay));
                        continue;
                    }
                    throw err;
                }
            }
        };

        // Fetch cohort and program details
        const [cohort, program] = await Promise.all([
            executeWithRetry(() => prisma.cohorts.findUnique({
                where: { id: cohort_id },
                select: { id: true, enrollment_deadline: true }
            })),
            executeWithRetry(() => prisma.programs.findUnique({
                where: { id: program_id },
                select: { id: true, price: true, discount_price: true }
            }))
        ]);

        if (!cohort) {
            return NextResponse.json({ error: 'Cohort not found' }, { status: 404 });
        }
        if (!program) {
            return NextResponse.json({ error: 'Program not found' }, { status: 404 });
        }

        // Validate enrollment deadline
        const now = new Date();
        if (now > new Date(cohort.enrollment_deadline)) {
            return NextResponse.json({ error: 'Enrollment deadline has passed for this cohort' }, { status: 400 });
        }

        // Check for duplicate enrollment
        if (user_id) {
            const existingEnrollment = await executeWithRetry(() => prisma.enrollments.findFirst({
                where: {
                    user_id: user_id,
                    cohort_id: cohort_id,
                    program_id: program_id
                }
            }));

            if (existingEnrollment) {
                return NextResponse.json({ error: 'You are already enrolled in this program for this cohort' }, { status: 409 });
            }
        }

        // Create the enrollment
        const enrollment = await executeWithRetry(() => prisma.enrollments.create({
            data: {
                user_id: user_id || null,
                cohort_id: cohort_id,
                program_id: program_id,
                payment_status: status,
                full_name: body.full_name || null,
                email: body.email || null,
                phone: body.phone || null,
            }
        }));

        // Handle referral tracking
        try {
            const cookieStore = await cookies();
            const referralCode = cookieStore.get('webstack_referral_code')?.value;

            if (referralCode && user_id) {
                // Find referrer by code
                const referral = await executeWithRetry(() => prisma.referrals.findUnique({
                    where: { referral_code: referralCode }
                }));

                // Make sure referrer is not the same as referred user
                if (referral && referral.user_id !== user_id) {
                    // Calculate 10% commission of program price
                    const basePrice = program.discount_price || program.price;
                    if (basePrice) {
                        const commissionAmount = Number(basePrice) * 0.10;

                        // Create pending referral activity
                        await executeWithRetry(() => prisma.referral_activities.create({
                            data: {
                                referrer_id: referral.user_id,
                                referred_user_id: user_id,
                                cohort_id: cohort_id,
                                enrollment_id: enrollment.id,
                                commission_amount: commissionAmount,
                                status: 'pending'
                            }
                        }));
                    }
                }
            }
        } catch (refError) {
            console.error('Referral Processing Error:', refError);
        }

        return NextResponse.json(enrollment, { status: 201 });

    } catch (error) {
        console.error('Enrollment API Error:', error);
        return NextResponse.json({
            error: 'Failed to process enrollment',
            details: error.message
        }, { status: 500 });
    }
}
