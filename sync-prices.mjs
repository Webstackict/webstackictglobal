import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function syncPrices() {
    console.log('🔄 Starting price synchronization...');

    try {
        // 1. Update all programs
        const { count: programCount } = await prisma.programs.updateMany({
            data: {
                price: 250000,
                discount_price: 225000
            }
        });
        console.log(`✅ Updated ${programCount} programs: Price = 250,000, Discount = 225,000`);

        // 2. Update all departments
        const { count: deptCount } = await prisma.departments.updateMany({
            data: {
                fee: 250000,
                discount_fee: 225000
            }
        });
        console.log(`✅ Updated ${deptCount} departments: Fee = 250,000`);

        console.log('🚀 Price synchronization complete!');
    } catch (error) {
        console.error('❌ Failed to sync prices:', error);
    } finally {
        await prisma.$disconnect();
    }
}

syncPrices();
