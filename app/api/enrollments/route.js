import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

export async function POST(request) {
    try {
        const body = await request.json();
        const { user_id, cohort_id, status = 'pending' } = body;

        // Basic validation
        if (!cohort_id) {
            return NextResponse.json({ error: 'Cohort ID is required' }, { status: 400 });
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

        // Fetch cohort details with retry
        const cohort = await executeWithRetry(() => prisma.cohorts.findUnique({
            where: { id: cohort_id },
            select: {
                id: true,
                department_id: true,
                enrollment_deadline: true,
            }
        }));

        if (!cohort) {
            return NextResponse.json({ error: 'Cohort not found' }, { status: 404 });
        }

        // Validate enrollment deadline
        const now = new Date();
        if (now > new Date(cohort.enrollment_deadline)) {
            return NextResponse.json({ error: 'Enrollment deadline has passed for this cohort' }, { status: 400 });
        }

        // Check for duplicate enrollment with retry
        if (user_id) {
            const existingEnrollment = await executeWithRetry(() => prisma.enrollments.findFirst({
                where: {
                    user_id: user_id,
                    cohort_id: cohort_id
                }
            }));

            if (existingEnrollment) {
                return NextResponse.json({ error: 'User is already enrolled in this cohort' }, { status: 409 });
            }
        }

        // Create the enrollment with retry
        const enrollment = await executeWithRetry(() => prisma.enrollments.create({
            data: {
                user_id: user_id || null,
                cohort_id: cohort_id,
                department_id: cohort.department_id,
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
                    // Calculate 10% commission of department fee
                    const department = await executeWithRetry(() => prisma.departments.findUnique({
                        where: { id: cohort.department_id },
                        select: { fee: true }
                    }));

                    if (department && department.fee) {
                        const commissionAmount = Number(department.fee) * 0.10;

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
            // Do not fail enrollment if referral tracking fails
        }

        return NextResponse.json(enrollment, { status: 201 });

    } catch (error) {
        console.error('Enrollment API Error:', {
            message: error.message,
            stack: error.stack,
            body: body
        });
        return NextResponse.json({
            error: 'Failed to process enrollment',
            details: error.message,
            code: error.code // Prisma error code if available
        }, { status: 500 });
    }
}
