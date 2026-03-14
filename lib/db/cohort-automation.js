import { prisma } from "@/lib/prisma";
import { getFirstMonday, getLastMonday } from "../util/cohort-dates";

/**
 * Automatically creates the next month's cohort and links active programs to it.
 */
export async function generateNextCohort() {
    try {
        const nextMonthDate = new Date();
        nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);

        const month = nextMonthDate.getMonth();
        const year = nextMonthDate.getFullYear();
        const monthName = nextMonthDate.toLocaleString('en-US', { month: 'long' });

        const cohortName = `${monthName} ${year} Cohort`;
        const cohortCode = `WS-${year}-${nextMonthDate.toLocaleString('en-US', { month: 'short' }).toUpperCase()}`;

        // Check if it already exists
        const existing = await prisma.cohorts.findUnique({
            where: { cohort_code: cohortCode }
        });

        if (existing) {
            console.log(`Cohort ${cohortCode} already exists.`);
            return existing;
        }

        const registrationStart = getFirstMonday(month, year);
        const registrationDeadline = getLastMonday(month, year);
        const startDate = new Date(registrationDeadline);
        startDate.setDate(startDate.getDate() + 7); // Start 1 week after deadline

        const graduationDate = new Date(startDate);
        graduationDate.setMonth(graduationDate.getMonth() + 3); // 3 months duration

        // Create Cohort
        const newCohort = await prisma.cohorts.create({
            data: {
                name: cohortName,
                cohort_code: cohortCode,
                cohort_number: 0, // Should probably be incremented or managed
                month,
                year,
                registration_start: registrationStart,
                enrollment_deadline: registrationDeadline,
                start_date: startDate,
                graduation_date: graduationDate,
                status: 'enrolling',
                max_size: 500, // Total cohort size
            }
        });

        // Link all active programs to this cohort with default seat limits
        const activePrograms = await prisma.programs.findMany({
            where: { is_active: true }
        });

        await prisma.cohort_programs.createMany({
            data: activePrograms.map(p => ({
                cohort_id: newCohort.id,
                program_id: p.id,
                seat_limit: 50,
                enrolled_count: 0
            }))
        });

        console.log(`Successfully generated ${cohortName} and linked ${activePrograms.length} programs.`);
        return newCohort;
    } catch (error) {
        console.error("Error generating next cohort:", error);
        throw error;
    }
}

/**
 * Checks all active cohorts and closes those that have passed their deadline.
 */
export async function autoCloseExpiredCohorts() {
    try {
        const now = new Date();

        const expiredCohorts = await prisma.cohorts.updateMany({
            where: {
                status: 'enrolling',
                enrollment_deadline: {
                    lt: now
                }
            },
            data: {
                status: 'closed'
            }
        });

        console.log(`Auto-closed ${expiredCohorts.count} expired cohorts.`);
        return expiredCohorts;
    } catch (error) {
        console.error("Error auto-closing cohorts:", error);
        throw error;
    }
}
