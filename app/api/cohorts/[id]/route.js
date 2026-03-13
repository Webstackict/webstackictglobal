import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request, { params }) {
    try {
        const { id } = await params;
        const cohort = await prisma.cohorts.findUnique({
            where: { id },
        });

        if (!cohort) {
            return NextResponse.json({ error: 'Cohort not found' }, { status: 404 });
        }

        return NextResponse.json(cohort, { status: 200 });
    } catch (error) {
        console.error('Error fetching cohort:', error);
        return NextResponse.json({ error: 'Failed to fetch cohort' }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    try {
        const { id } = await params;
        const data = await request.json();

        const updatedCohort = await prisma.cohorts.update({
            where: { id },
            data: {
                name: data.name,
                cohort_code: data.cohort_code,
                cohort_number: parseInt(data.cohort_number) || 0,
                start_date: new Date(data.start_date),
                graduation_date: new Date(data.graduation_date),
                enrollment_deadline: new Date(data.enrollment_deadline),
                max_size: parseInt(data.max_size) || 100,
                status: data.status,
                visibility_logic: data.visibility_logic,
                banner_url: data.banner_url || null,
                description: data.description || null,
                footer: data.footer || null,
                label: data.label || null,
                duration: parseInt(data.duration) || 3,
                online_seats: parseInt(data.online_seats) || 0,
                onsite_seats: parseInt(data.onsite_seats) || 0,
            },
        });

        return NextResponse.json(updatedCohort, { status: 200 });
    } catch (error) {
        console.error('Error updating cohort:', error);
        if (error.code === 'P2025') {
            return NextResponse.json({ error: 'Cohort not found' }, { status: 404 });
        }
        if (error.code === 'P2002') {
            return NextResponse.json({ error: 'A cohort with this code already exists' }, { status: 409 });
        }
        return NextResponse.json({ error: 'Failed to update cohort' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const { id } = await params;

        await prisma.cohorts.delete({
            where: { id },
        });

        return NextResponse.json({ message: 'Cohort deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting cohort:', error);
        if (error.code === 'P2025') {
            return NextResponse.json({ error: 'Cohort not found' }, { status: 404 });
        }
        return NextResponse.json({ error: 'Failed to delete cohort' }, { status: 500 });
    }
}
