import { prisma } from "@/lib/prisma";
import { EARLY_BIRD_THRESHOLD, EARLY_BIRD_PRICE, REGULAR_PRICE } from "@/lib/util/pricing";

export async function getActiveCohorts() {
  try {
    const cohorts = await prisma.cohorts.findMany({
      where: {
        status: 'enrolling',
        enrollment_deadline: {
          gt: new Date()
        }
      },
      include: {
        departments: {
          select: {
            name: true
          }
        },
        cohort_programs: {
          include: {
            program: {
              include: {
                instructors: {
                  include: {
                    instructor: true
                  }
                }
              }
            }
          }
        },
        _count: {
          select: {
            enrollments: true
          }
        }
      },
      orderBy: {
        start_date: 'asc'
      }
    });

    const data = await Promise.all(cohorts.map(async (cohort) => {
      const cohortPrograms = await Promise.all(cohort.cohort_programs.map(async (cp) => {
        const paidCount = await prisma.enrollments.count({
          where: {
            cohort_id: cohort.id,
            program_id: cp.program_id,
            payment_status: 'PAID'
          }
        });

        const isEarlyBirdActive = paidCount < EARLY_BIRD_THRESHOLD;
        const currentPrice = isEarlyBirdActive ? EARLY_BIRD_PRICE : REGULAR_PRICE;
        const slotsRemaining = Math.max(0, EARLY_BIRD_THRESHOLD - paidCount);

        return {
          ...cp,
          seats_remaining: Math.max(0, cp.seat_limit - cp.enrolled_count),
          pricing: {
            currentPrice,
            earlyBirdPrice: EARLY_BIRD_PRICE,
            regularPrice: REGULAR_PRICE,
            isEarlyBirdActive,
            earlyBirdSlotsRemaining: slotsRemaining,
            totalEarlyBirdSlots: EARLY_BIRD_THRESHOLD
          },
          program: {
            ...cp.program,
            price: currentPrice, // Dynamic price for the form
            discount_price: currentPrice < REGULAR_PRICE ? currentPrice : null,
          }
        };
      }));

      return {
        ...cohort,
        department_name: cohort.departments?.name || "General",
        number_enrolled: cohort._count.enrollments,
        cohort_programs: cohortPrograms
      };
    }));

    return { data: JSON.parse(JSON.stringify(data)), error: null };
  } catch (err) {
    console.error("Prisma error in getActiveCohorts:", err);
    return { data: null, error: err };
  }
}

export async function getEnrollingCohorts() {
  return getActiveCohorts();
}

export async function getActivePrograms() {
  try {
    const data = await prisma.programs.findMany({
      where: {
        is_active: true
      },
      include: {
        instructors: {
          include: {
            instructor: true
          }
        }
      }
    });

    const serializedData = data.map(program => ({
      ...program,
      price: program.price ? Number(program.price) : program.price,
      discount_price: program.discount_price ? Number(program.discount_price) : program.discount_price,
    }));

    return { data: serializedData, error: null };
  } catch (err) {
    console.error("Prisma error:", err);
    return { data: null, error: err };
  }
}
