import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdmin } from '@/lib/admin-auth';

export async function GET(request) {
    if (!await isAdmin()) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search') || '';
        const programId = searchParams.get('programId') || '';
        const status = searchParams.get('status') || '';

        const where = {
            AND: [
                {
                    OR: [
                        { full_name: { contains: search, mode: 'insensitive' } },
                        { email: { contains: search, mode: 'insensitive' } },
                        { phone: { contains: search, mode: 'insensitive' } },
                    ]
                }
            ]
        };

        if (programId) {
            where.AND.push({ program_id: programId });
        }

        if (status) {
            where.AND.push({ payment_status: status });
        }

        const enrollments = await prisma.enrollments.findMany({
            where,
            include: {
                program: true,
                cohort: true
            },
            orderBy: { created_at: 'desc' }
        });

        // Calculate stats
        const total = await prisma.enrollments.count();
        const pending = await prisma.enrollments.count({ where: { payment_status: 'PENDING' } });
        const successful = await prisma.enrollments.count({ where: { payment_status: 'PAID' } });
        const failed = await prisma.enrollments.count({ where: { payment_status: 'FAILED' } });

        return NextResponse.json({
            enrollments,
            stats: {
                total,
                pending,
                successful,
                failed
            }
        });
    } catch (error) {
        console.error('Admissions API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch admissions' }, { status: 500 });
    }
}

export async function PATCH(request) {
    if (!await isAdmin()) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    try {
        const body = await request.json();
        const { id, payment_status, approval_status } = body;

        const updated = await prisma.enrollments.update({
            where: { id },
            data: {
                payment_status,
                approval_status
            },
            include: {
                program: true,
                cohort: true
            }
        });

        // Trigger notifications based on status
        try {
            const { sendPaymentVerified, sendAdmissionRejected } = await import('@/lib/enrollment-notifications');
            if (payment_status === 'PAID') {
                await sendPaymentVerified(updated);
            } else if (approval_status === 'REJECTED') {
                await sendAdmissionRejected(updated);
            }
        } catch (notifierErr) {
            console.error('Notification Trigger Error:', notifierErr);
        }

        return NextResponse.json(updated);
    } catch (error) {
        console.error('Admissions PATCH Error:', error);
        return NextResponse.json({ error: 'Failed to update admission' }, { status: 500 });
    }
}
