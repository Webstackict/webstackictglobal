import { prisma } from "@/lib/prisma";

/**
 * Fetches active or enrolling enrollments for a user.
 * @param {string} userId 
 * @param {string} status - Usually 'in_progress' or 'enrolling'
 */
export async function getUserEnrolledCohorts(userId, status) {
  try {
    const enrollments = await prisma.enrollments.findMany({
      where: {
        user_id: userId,
        payment_status: {
          in: ['PAID', 'PENDING']
        },
        cohort: {
          status: {
            in: ['enrolling', 'in_progress']
          }
        }
      },
      include: {
        program: true,
        cohort: true
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    // Transform to match the UI expectations if necessary
    // The UI usually expects fields like 'name', 'status', 'start_date' etc.
    const transformed = enrollments.map(en => ({
      id: en.id,
      user_id: en.user_id,
      cohort_id: en.cohort_id,
      program_name: en.program.name,
      cohort_name: en.cohort.name,
      cohort_code: en.cohort.cohort_code,
      status: en.cohort.status,
      start_date: en.cohort.start_date,
      graduation_date: en.cohort.graduation_date,
      enrollment_date: en.created_at,
      department_name: en.program.name,
      description: en.program.short_description,
      program_image: en.program.image_url,
      icon: 'laptop-code',
      payment_status: en.payment_status
    }));

    return { data: transformed, error: null };
  } catch (err) {
    console.error("Prisma error fetching dashboard enrollments:", err);
    return { data: null, error: err };
  }
}

/**
 * Fetches completed enrollments for a user.
 */
export async function getUserCompletedCohorts(userId) {
  try {
    const enrollments = await prisma.enrollments.findMany({
      where: {
        user_id: userId,
        payment_status: 'PAID',
        cohort: {
          status: 'completed'
        }
      },
      include: {
        program: true,
        cohort: true
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    const transformed = enrollments.map(en => ({
      id: en.id,
      user_id: en.user_id,
      cohort_id: en.cohort_id,
      program_name: en.program.name,
      cohort_name: en.cohort.name,
      cohort_code: en.cohort.code,
      status: 'completed',
      start_date: en.cohort.start_date,
      graduation_date: en.cohort.end_date,
      completion_date: en.cohort.end_date,
      department_name: en.program.name,
      description: en.program.short_description,
      program_image: en.program.image_url,
      icon: 'award'
    }));

    return { data: transformed, error: null };
  } catch (err) {
    console.error("Prisma error fetching completed enrollments:", err);
    return { data: null, error: err };
  }
}
