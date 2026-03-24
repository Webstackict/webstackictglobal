const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS public."StudentLedger" (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        student_id VARCHAR(50) UNIQUE NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        email VARCHAR(255),
        program VARCHAR(255) NOT NULL,
        gender VARCHAR(50),
        date_of_birth TIMESTAMP WITH TIME ZONE,
        address TEXT,
        learning_mode VARCHAR(50),
        status VARCHAR(50) DEFAULT 'active',
        registration_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        deleted_at TIMESTAMP WITH TIME ZONE
      )
    `);

        await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS student_ledger_student_id_idx ON public."StudentLedger"(student_id)`);
        await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS student_ledger_phone_idx ON public."StudentLedger"(phone)`);

        console.log("Executed: CREATE TABLE public.StudentLedger");
    } catch (error) {
        console.error("Failed to create table:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
