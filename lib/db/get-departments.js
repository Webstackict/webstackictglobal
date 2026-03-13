import { prisma } from "@/lib/prisma";

export async function GetDepartments() {
  try {
    const departments = await prisma.departments.findMany({
      include: {
        cohorts: {
          where: {
            status: 'enrolling',
            enrollment_deadline: {
              gt: new Date()
            }
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    // Map to match the previous structure if needed, or just return enriched data
    const serializedData = departments.map(dept => ({
      ...dept,
      enrolling_count: dept.cohorts.length
    }));

    return { data: serializedData, error: null };
  } catch (err) {
    console.error("Prisma error in GetDepartments:", err);
    return { data: null, error: err };
  }
}
