const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        // Add columns one by one in case some already exist or to prevent complete failure
        const columns = [
            "ADD COLUMN IF NOT EXISTS primary_logo_url TEXT",
            "ADD COLUMN IF NOT EXISTS favicon_url TEXT",
            "ADD COLUMN IF NOT EXISTS primary_color_hex VARCHAR(20)",
            "ADD COLUMN IF NOT EXISTS seo_title TEXT",
            "ADD COLUMN IF NOT EXISTS seo_description TEXT",
            "ADD COLUMN IF NOT EXISTS og_image_url TEXT",
            "ADD COLUMN IF NOT EXISTS paystack_public_key TEXT",
            "ADD COLUMN IF NOT EXISTS paystack_secret_key TEXT",
            "ADD COLUMN IF NOT EXISTS stripe_public_key TEXT",
            "ADD COLUMN IF NOT EXISTS stripe_secret_key TEXT",
            "ADD COLUMN IF NOT EXISTS sendgrid_api_key TEXT",
            "ADD COLUMN IF NOT EXISTS admin_notification_emails TEXT",
            "ADD COLUMN IF NOT EXISTS enable_registration_emails BOOLEAN DEFAULT TRUE",
            "ADD COLUMN IF NOT EXISTS enable_paystack BOOLEAN DEFAULT TRUE",
            "ADD COLUMN IF NOT EXISTS enable_bank_transfer BOOLEAN DEFAULT TRUE",
            "ADD COLUMN IF NOT EXISTS maintenance_mode BOOLEAN DEFAULT FALSE"
        ];

        for (const col of columns) {
            await prisma.$executeRawUnsafe(`ALTER TABLE public.site_settings ${col};`);
            console.log(`Executed: ALTER TABLE public.site_settings ${col}`);
        }

        console.log("Settings table successfully expanded!");
    } catch (error) {
        console.error("Failed to alter table:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
