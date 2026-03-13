import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const visibility = searchParams.get('visibility');

        const where = {};
        if (status) where.status = status;
        if (visibility) where.visibility_logic = visibility;

        const cohorts = await prisma.cohorts.findMany({
            where,
            orderBy: {
                start_date: 'desc',
            },
        });

        return NextResponse.json(cohorts, { status: 200 });
    } catch (error) {
        console.error('Error fetching cohorts:', error);
        return NextResponse.json({
            error: 'Failed to fetch cohorts',
            details: error.message
        }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const data = await request.json();

        // Basic validation
        if (!data.name || !data.cohort_code || !data.start_date || !data.enrollment_deadline) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const newCohort = await prisma.cohorts.create({
            data: {
                name: data.name,
                cohort_code: data.cohort_code,
                cohort_number: parseInt(data.cohort_number) || 0,
                start_date: new Date(data.start_date),
                graduation_date: new Date(data.graduation_date),
                enrollment_deadline: new Date(data.enrollment_deadline),
                max_size: parseInt(data.max_size) || 100,
                status: data.status || 'enrolling',
                visibility_logic: data.visibility_logic || 'public',
                banner_url: data.banner_url || null,
                description: data.description || null,
                footer: data.footer || null,
                label: data.label || null,
                duration: parseInt(data.duration) || 3,
                online_seats: parseInt(data.online_seats) || 0,
                onsite_seats: parseInt(data.onsite_seats) || 0,
            },
        });

        return NextResponse.json(newCohort, { status: 201 });
    } catch (error) {
        console.error('Error creating cohort:', error);
        if (error.code === 'P2002') {
            return NextResponse.json({ error: 'A cohort with this code already exists' }, { status: 409 });
        }
        return NextResponse.json({ error: 'Failed to create cohort' }, { status: 500 });
    }
}
