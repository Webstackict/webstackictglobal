import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { EARLY_BIRD_THRESHOLD, EARLY_BIRD_PRICE, REGULAR_PRICE } from '@/lib/util/pricing';

export async function POST(request) {
    try {
        const body = await request.json();
        const {
            user_id, cohort_id, program_id, payment_method,
            country, city, referral_code,
            full_name, email, phone
        } = body;

        // Basic validation
        if (!cohort_id || !program_id) {
            return NextResponse.json({ error: 'Cohort ID and Program ID are required' }, { status: 400 });
        }

        // ... (retry logic skipped for brevity in replacement, but I will keep it)

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

        // Fetch cohort program details (for seat limits)
        const cohortProgram = await executeWithRetry(() => prisma.cohort_programs.findUnique({
            where: {
                cohort_id_program_id: {
                    cohort_id: cohort_id,
                    program_id: program_id
                }
            },
            include: {
                cohort: true,
                program: true
            }
        }));

        if (!cohortProgram) {
            return NextResponse.json({ error: 'Program not available in this cohort' }, { status: 404 });
        }

        const { cohort, program, seat_limit, enrolled_count } = cohortProgram;

        // 1. Validate seat limits
        if (enrolled_count >= seat_limit) {
            return NextResponse.json({ error: 'This program is currently full for the selected cohort.' }, { status: 400 });
        }

        // 2. Validate enrollment deadline
        const now = new Date();
        if (now > new Date(cohort.enrollment_deadline)) {
            return NextResponse.json({ error: 'Enrollment deadline has passed for this cohort' }, { status: 400 });
        }

        // 3. Check for duplicate enrollment
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

        // 4. Calculate current price for locking
        const paidCount = await executeWithRetry(() => prisma.enrollments.count({
            where: {
                cohort_id: cohort_id,
                program_id: program_id,
                payment_status: 'PAID'
            }
        }));

        const appliedPrice = paidCount < EARLY_BIRD_THRESHOLD ? EARLY_BIRD_PRICE : REGULAR_PRICE;
        const priceType = paidCount < EARLY_BIRD_THRESHOLD ? 'EARLY_BIRD' : 'REGULAR';

        // 5. Create Enrollment & Increment Seat Count (Transactionally)
        const result = await prisma.$transaction(async (tx) => {
            const enrollment = await tx.enrollments.create({
                data: {
                    user_id: user_id || null,
                    cohort_id: cohort_id,
                    program_id: program_id,
                    payment_status: 'PENDING',
                    approval_status: 'PENDING_PAYMENT',
                    full_name: full_name || null,
                    email: email || null,
                    phone: phone || null,
                    applied_price: appliedPrice,
                    price_type: priceType,
                    profile_details: {
                        country: country || null,
                        city: city || null
                    }
                },
                include: {
                    program: true,
                    cohort: true
                }
            });

            await tx.cohort_programs.update({
                where: {
                    cohort_id_program_id: {
                        cohort_id: cohort_id,
                        program_id: program_id
                    }
                },
                data: {
                    enrolled_count: {
                        increment: 1
                    }
                }
            });

            return enrollment;
        });

        // 6. Handle referral tracking (5% or 10% logic)
        try {
            const referralCode = referral_code || (await cookies()).get('webstack_referral_code')?.value;

            if (referralCode) {
                const referral = await executeWithRetry(() => prisma.referrals.findUnique({ where: { referral_code: referralCode } }));
                if (referral) {
                    // Check if it's a scholarship-based referral (using 10%) or regular (5%)
                    // Note: We'll stick to 5% for regular enrollment as per previous logic, 
                    // but using the ACTUAL applied price now.
                    const commissionAmount = Number(appliedPrice) * 0.05;

                    await executeWithRetry(() => prisma.referral_activities.create({
                        data: {
                            referrer_id: referral.user_id,
                            referred_user_id: user_id || null,
                            cohort_id: cohort_id,
                            enrollment_id: result.id,
                            commission_amount: commissionAmount,
                            status: 'pending'
                        }
                    }));
                }
            }
        } catch (refError) {
            console.error('Referral Processing Error:', refError);
        }

        // 6. Trigger Enrollment Confirmation Email
        try {
            const { sendEnrollmentConfirmation } = await import('@/lib/enrollment-notifications');
            await sendEnrollmentConfirmation(result);
        } catch (emailErr) {
            console.error('Failed to trigger confirmation email:', emailErr);
        }

        return NextResponse.json(result, { status: 201 });
    } catch (error) {
        console.error('Enrollment API Critical Error:', {
            message: error.message,
            stack: error.stack,
            code: error.code,
            meta: error.meta
        });
        return NextResponse.json({
            error: 'Failed to process enrollment',
            details: error.message
        }, { status: 500 });
    }
}
