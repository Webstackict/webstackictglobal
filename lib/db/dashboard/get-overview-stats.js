import { prisma } from "@/lib/prisma";

/**
 * Fetches overview statistics for a user's dashboard.
 * @param {string} userId 
 */
export async function getOverviewStats(userId) {
  try {
    const [attendedEvents, completedEnr, ongoingEnr] = await Promise.all([
      // 1. Count attended events
      prisma.event_attendees.count({
        where: { registered_attendee_id: userId }
      }),
      // 2. Count completed enrollments (paid + cohort completed)
      prisma.enrollments.count({
        where: {
          user_id: userId,
          payment_status: 'PAID',
          cohort: {
            status: 'completed'
          }
        }
      }),
      // 3. Count ongoing enrollments (paid/pending + cohort enrolling/in_progress)
      prisma.enrollments.count({
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
        }
      })
    ]);

    return {
      data: {
        attendedEvents: attendedEvents || 0,
        completedDepts: completedEnr || 0, // Keeping key name for UI compatibility
        ongoingEnrollments: ongoingEnr || 0,
      },
      error: null
    };
  } catch (err) {
    console.error("Prisma error fetching overview stats:", err);
    return { data: null, error: err };
  }
}
