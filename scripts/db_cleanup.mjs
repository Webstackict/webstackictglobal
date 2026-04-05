import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
    try {
        console.log("Inspecting testing contents in the database...");

        // Find recent applications to identify test users
        const recentApps = await prisma.scholarship_applications.findMany({
            orderBy: { submitted_at: 'desc' },
            take: 10
        });

        const testIds = recentApps
            .filter(app =>
                app.email.includes("example.com") ||
                app.full_name.toLowerCase().includes("test") ||
                app.short_about_you.toLowerCase().includes("testing") ||
                app.short_about_you.toLowerCase().includes("test")
            )
            .map(app => app.id);

        if (testIds.length > 0) {
            const delRes = await prisma.scholarship_applications.deleteMany({
                where: { id: { in: testIds } }
            });
            console.log(`Deleted ${delRes.count} test scholarship application(s).`);
        } else {
            console.log("No obvious test scholarship applications found to delete.");
        }

        // Clean out mock payments
        const mockPaymentsRaw = await prisma.payments.deleteMany({
            where: {
                OR: [
                    { reference: { startsWith: 'MOCK_' } },
                    { provider: { contains: 'mock' } }
                ]
            }
        });
        console.log(`Deleted ${mockPaymentsRaw.count} mock payment(s).`);

        console.log("Database testing content cleanup complete!");
    } catch (e) {
        console.error("Cleanup error:", e);
    } finally {
        await prisma.$disconnect();
    }
}
main();
