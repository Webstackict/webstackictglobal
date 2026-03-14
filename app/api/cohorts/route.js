import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getFirstMonday, getLastMonday } from '@/lib/util/cohort-dates';

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
            include: {
                _count: {
                    select: { enrollments: true }
                }
            },
            orderBy: {
                start_date: "desc",
            },
        });

        // Enrich with pricing stats
        const data = await Promise.all(cohorts.map(async (cohort) => {
            const enrollments = await prisma.enrollments.findMany({
                where: { cohort_id: cohort.id, payment_status: 'PAID' },
                select: { applied_price: true }
            });

            const earlyBirdCount = enrollments.filter(e => Number(e.applied_price) === 200000).length;
            const regularCount = enrollments.filter(e => Number(e.applied_price) === 250000).length;

            return {
                ...cohort,
                total_enrollments: cohort._count.enrollments,
                early_bird_count: earlyBirdCount,
                regular_count: regularCount,
            };
        }));

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error('Error fetching cohorts:', error);
        return NextResponse.json({
            error: 'Failed to fetch cohorts',
            details: error.message
        }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const body = await req.json();
        let {
            name, cohort_code, cohort_number, start_date, graduation_date,
            enrollment_deadline, max_size, status, visibility_logic,
            description, label, duration, month, year, registration_start
        } = body;

        // Auto-calculate dates if month/year provided
        if (month && year) {
            const m = parseInt(month);
            const y = parseInt(year);
            const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

            name = `${monthNames[m - 1]} ${y} Cohort`;
            cohort_code = `WS-${y}-${monthNames[m - 1].substring(0, 3).toUpperCase()}`;

            const firstMon = getFirstMonday(m - 1, y);
            const lastMon = getLastMonday(m - 1, y);

            registration_start = firstMon;
            start_date = firstMon;
            enrollment_deadline = lastMon;

            // Auto-calculate graduation
            const grad = new Date(firstMon);
            grad.setMonth(grad.getMonth() + parseInt(duration || 3));
            graduation_date = grad;
        }

        const cohort = await prisma.cohorts.create({
            data: {
                name,
                cohort_code,
                cohort_number: parseInt(cohort_number) || 0,
                start_date: new Date(start_date),
                graduation_date: new Date(graduation_date),
                enrollment_deadline: new Date(enrollment_deadline),
                registration_start: registration_start ? new Date(registration_start) : null,
                month: month ? parseInt(month) : null,
                year: year ? parseInt(year) : null,
                max_size: parseInt(max_size) || 100,
                status: status || 'enrolling',
                visibility_logic: visibility_logic || 'public',
                description: description || null,
                label: label || null,
                duration: parseInt(duration) || 3
            }
        });

        // Auto-link active programs
        const activePrograms = await prisma.programs.findMany({
            where: { is_active: true }
        });

        if (activePrograms.length > 0) {
            await prisma.cohort_programs.createMany({
                data: activePrograms.map(p => ({
                    cohort_id: cohort.id,
                    program_id: p.id,
                    seat_limit: 50,
                    enrolled_count: 0
                }))
            });
        }

        return NextResponse.json(cohort, { status: 201 });
    } catch (error) {
        console.error("Cohort creation error:", error);
        if (error.code === 'P2002') {
            return NextResponse.json({ error: 'A cohort with this code already exists' }, { status: 409 });
        }
        return NextResponse.json({ error: "Failed to create cohort", details: error.message }, { status: 500 });
    }
}
