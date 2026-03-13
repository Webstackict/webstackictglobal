
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function testFetch() {
    console.log("Testing testimonials fetch...");
    try {
        const testimonials = await prisma.testimonials.findMany({
            where: {
                status: "approved",
            },
            take: 5,
        });
        console.log("✅ Success! Found ${testimonials.length} testimonials.");
    } catch (err) {
        console.error("❌ Prisma fetch failed:");
        console.error(err.message);
    } finally {
        await prisma.$disconnect();
    }
}

testFetch();
