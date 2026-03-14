import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request) {
    try {
        const { enrollmentId, reference } = await request.json();

        if (!enrollmentId) {
            return NextResponse.json({ error: 'Enrollment ID is required' }, { status: 400 });
        }

        // Update enrollment status to AWAITING_VERIFICATION
        // Update payment status to AWAITING_VERIFICATION
        const updatedEnrollment = await prisma.enrollments.update({
            where: { id: enrollmentId },
            data: {
                payment_status: 'AWAITING_VERIFICATION',
                approval_status: 'AWAITING_VERIFICATION',
                // Create or update a payment record for bank transfer
                payments: {
                    create: {
                        amount: 0, // Will be updated by admin or fetched from enrollment
                        status: 'AWAITING_VERIFICATION',
                        provider: 'bank_transfer',
                        reference: reference || `BANK-${enrollmentId.slice(0, 8).toUpperCase()}`,
                        metadata: {
                            submitted_at: new Date().toISOString(),
                            method: 'bank_transfer'
                        }
                    }
                }
            },
            include: {
                program: true,
                cohort: true
            }
        });

        // Trigger notification to admin (optional, can be added later)
        console.log(`Bank transfer submitted for enrollment ${enrollmentId}`);

        return NextResponse.json(updatedEnrollment, { status: 200 });
    } catch (error) {
        console.error('Error verifying transfer:', error);
        return NextResponse.json({ error: 'Failed to submit verification' }, { status: 500 });
    }
}
