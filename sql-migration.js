const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS public.site_settings (
        id VARCHAR(50) PRIMARY KEY DEFAULT 'global',
        org_name TEXT,
        support_email TEXT,
        support_phone TEXT,
        address TEXT,
        bank_name TEXT,
        bank_account_name TEXT,
        bank_account_number TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
        console.log("Settings table successfully created!");
    } catch (error) {
        console.error("Failed to create table:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
