import { prisma } from "@/lib/prisma";

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

    const data = cohorts.map(cohort => ({
      ...cohort,
      department_name: cohort.departments?.name || "General",
      number_enrolled: cohort._count.enrollments
    }));

    return { data, error: null };
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
