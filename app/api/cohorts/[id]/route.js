import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getFirstMonday, getLastMonday } from '@/lib/util/cohort-dates';

export async function GET(request, { params }) {
    try {
        const { id } = await params;
        const cohort = await prisma.cohorts.findUnique({
            where: { id },
            include: {
                cohort_programs: {
                    include: {
                        program: true
                    }
                }
            }
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
        let {
            name, cohort_code, cohort_number, start_date, graduation_date,
            enrollment_deadline, max_size, status, visibility_logic,
            description, label, duration, month, year, registration_start,
            program_overrides
        } = data;

        // Auto-recalculate if month/year updated
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

        const result = await prisma.$transaction(async (tx) => {
            const cohort = await tx.cohorts.update({
                where: { id },
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
                    status,
                    visibility_logic,
                    description,
                    label,
                    duration: parseInt(duration) || 3
                }
            });

            if (program_overrides && Array.isArray(program_overrides)) {
                for (const override of program_overrides) {
                    await tx.cohort_programs.update({
                        where: {
                            cohort_id_program_id: {
                                cohort_id: id,
                                program_id: override.program_id
                            }
                        },
                        data: {
                            seat_limit: parseInt(override.seat_limit) || 50
                        }
                    });
                }
            }

            return cohort;
        });

        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error('Error updating cohort:', error);
        if (error.code === 'P2025') {
            return NextResponse.json({ error: 'Cohort not found' }, { status: 404 });
        }
        if (error.code === 'P2002') {
            return NextResponse.json({ error: 'A cohort with this code already exists' }, { status: 409 });
        }
        return NextResponse.json({ error: 'Failed to update cohort', details: error.message }, { status: 500 });
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
