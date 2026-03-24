import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  try {
    console.log("Adding amount_paid...");
    await prisma.$executeRawUnsafe(`ALTER TABLE "public"."StudentLedger" ADD COLUMN IF NOT EXISTS "amount_paid" DOUBLE PRECISION DEFAULT 0;`);
    
    console.log("Adding payment_status...");
    await prisma.$executeRawUnsafe(`ALTER TABLE "public"."StudentLedger" ADD COLUMN IF NOT EXISTS "payment_status" TEXT DEFAULT 'Unpaid';`);
    
    console.log("Adding balance...");
    await prisma.$executeRawUnsafe(`ALTER TABLE "public"."StudentLedger" ADD COLUMN IF NOT EXISTS "balance" DOUBLE PRECISION DEFAULT 0;`);
    
    console.log("Done adding columns.");
  } catch (e) {
    console.error("Error migrating:", e);
  } finally {
    await prisma.$disconnect();
  }
}
main();
