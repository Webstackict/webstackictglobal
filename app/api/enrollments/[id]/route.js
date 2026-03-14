import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request, { params }) {
    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        const enrollment = await prisma.enrollments.findUnique({
            where: { id },
            include: {
                program: true,
                cohort: true,
                departments: true
            }
        });

        if (!enrollment) {
            return NextResponse.json({ error: 'Enrollment record not found' }, { status: 404 });
        }

        return NextResponse.json(enrollment, { status: 200 });
    } catch (error) {
        console.error('Error fetching enrollment:', error);
        return NextResponse.json({ error: 'Failed to fetch enrollment' }, { status: 500 });
    }
}
