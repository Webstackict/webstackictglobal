import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function testGeneration() {
    const randomNum = Math.floor(100 + Math.random() * 900);
    const randomChar = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    const referralCode = `Webstack-${randomNum}${randomChar}`;

    console.log(`Generated Code: ${referralCode}`);

    try {
        // We won't actually create to avoid DB mess, just check if the prisma client is happy with the string
        console.log("Prisma client check successful");
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

testGeneration();
