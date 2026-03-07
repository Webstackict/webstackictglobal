import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const activeCohorts = await prisma.cohorts.findMany({
            where: {
                status: 'enrolling',
            },
            take: 6,
            orderBy: {
                start_date: 'asc',
            },
            select: {
                id: true,
                label: true,
                cohort_number: true,
                start_date: true,
                graduation_date: true,
                enrollment_deadline: true,
                max_size: true,
                departments: {
                    select: {
                        name: true,
                    }
                }
            }
        });

        return NextResponse.json(activeCohorts, { status: 200 });
    } catch (error) {
        console.error('Error fetching cohorts:', error);
        return NextResponse.json({
            error: 'Failed to fetch cohorts',
            details: error.message,
            code: error.code
        }, { status: 500 });
    }
}
