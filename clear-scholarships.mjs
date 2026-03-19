import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    console.log("Truncating legacy scholarship_applications table to allow schema migration...");
    await prisma.$executeRaw`TRUNCATE TABLE "public"."scholarship_applications" CASCADE;`;
    console.log("Success! Legacy rows cleared.");
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
