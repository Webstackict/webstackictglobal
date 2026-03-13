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
        const pending = await prisma.enrollments.count({ where: { payment_status: 'pending' } });
        const successful = await prisma.enrollments.count({ where: { payment_status: 'successful' } });
        const failed = await prisma.enrollments.count({ where: { payment_status: 'failed' } });

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
