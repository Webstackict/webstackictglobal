import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
    try {
        console.log("Adding flutterwave_tx_ref and flutterwave_transaction_id to enrollments and scholarship_applications...");

        await prisma.$executeRawUnsafe(`
            ALTER TABLE public.enrollments 
            ADD COLUMN IF NOT EXISTS flutterwave_tx_ref VARCHAR(100),
            ADD COLUMN IF NOT EXISTS flutterwave_transaction_id VARCHAR(100);
        `);

        await prisma.$executeRawUnsafe(`
            ALTER TABLE public.scholarship_applications 
            ADD COLUMN IF NOT EXISTS flutterwave_tx_ref VARCHAR(100),
            ADD COLUMN IF NOT EXISTS flutterwave_transaction_id VARCHAR(100);
        `);

        // Adding unique constraints explicitly just in case
        await prisma.$executeRawUnsafe(`
            ALTER TABLE public.enrollments ADD CONSTRAINT flutterwave_tx_ref_unique UNIQUE (flutterwave_tx_ref);
        `).catch(e => console.log("Constraint might already exist"));

        await prisma.$executeRawUnsafe(`
            ALTER TABLE public.scholarship_applications ADD CONSTRAINT sch_flutterwave_tx_ref_unique UNIQUE (flutterwave_tx_ref);
        `).catch(e => console.log("Constraint might already exist"));

        console.log("Migration successful!");
    } catch (e) {
        console.error("Migration error:", e);
    } finally {
        await prisma.$disconnect();
    }
}
main();
