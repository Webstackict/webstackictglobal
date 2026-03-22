import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function GET() {
    try {
        const settings = await prisma.site_settings.findUnique({
            where: { id: "global" }
        });

        if (!settings) {
            return NextResponse.json({
                settings: {
                    org_name: "Webstack ICT Global",
                    support_email: "hello@webstackict.com",
                    support_phone: "+234 800 123 4567",
                    address: "",
                    bank_name: "KUDA BANK",
                    bank_account_name: "WEBSTACK ICT GLOBAL",
                    bank_account_number: "2044813585",
                    primary_logo_url: "",
                    favicon_url: "",
                    seo_title: "Webstack ICT Global | Premier Tech Academy",
                    seo_description: "Learn web development, cloud computing, and more.",
                    og_image_url: "",
                    paystack_public_key: "",
                    paystack_secret_key: "",
                    sendgrid_api_key: "",
                    admin_notification_emails: "admin@webstackict.com",
                    enable_registration_emails: true,
                    enable_paystack: true,
                    enable_bank_transfer: true,
                    maintenance_mode: false
                }
            }, { status: 200 });
        }

        return NextResponse.json({ settings }, { status: 200 });
    } catch (error) {
        console.error("Settings GET Error:", error);
        return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const body = await req.json();
        const {
            org_name, support_email, support_phone, address,
            bank_name, bank_account_name, bank_account_number,
            primary_logo_url, favicon_url,
            seo_title, seo_description, og_image_url,
            paystack_public_key, paystack_secret_key, sendgrid_api_key,
            admin_notification_emails, enable_registration_emails,
            enable_paystack, enable_bank_transfer, maintenance_mode
        } = body;

        // Note: Using raw SQL update for extra columns to avoid Prisma Client mismatch if schema push was skipped
        const updateQuery = `
            UPDATE public.site_settings SET 
                org_name = $1, 
                support_email = $2, 
                support_phone = $3, 
                address = $4,
                bank_name = $5, 
                bank_account_name = $6, 
                bank_account_number = $7,
                primary_logo_url = $8,
                favicon_url = $9,
                seo_title = $10,
                seo_description = $11,
                og_image_url = $12,
                paystack_public_key = $13,
                paystack_secret_key = $14,
                sendgrid_api_key = $15,
                admin_notification_emails = $16,
                enable_registration_emails = $17,
                enable_paystack = $18,
                enable_bank_transfer = $19,
                maintenance_mode = $20,
                updated_at = NOW()
            WHERE id = 'global'
            RETURNING *;
        `;

        const values = [
            org_name, support_email, support_phone, address,
            bank_name, bank_account_name, bank_account_number,
            primary_logo_url, favicon_url,
            seo_title, seo_description, og_image_url,
            paystack_public_key, paystack_secret_key, sendgrid_api_key,
            admin_notification_emails, typeof enable_registration_emails === 'boolean' ? enable_registration_emails : true,
            typeof enable_paystack === 'boolean' ? enable_paystack : true,
            typeof enable_bank_transfer === 'boolean' ? enable_bank_transfer : true,
            typeof maintenance_mode === 'boolean' ? maintenance_mode : false
        ];

        // Check if exists first
        const exists = await prisma.$queryRawUnsafe(`SELECT 1 FROM public.site_settings WHERE id = 'global'`);

        let settingsRow;
        if (exists && exists.length > 0) {
            const rawResult = await prisma.$queryRawUnsafe(updateQuery, ...values);
            settingsRow = rawResult[0];
        } else {
            // Revert to basic create if it doesn't exist
            settingsRow = await prisma.site_settings.create({
                data: {
                    id: "global",
                    org_name: org_name || "Webstack ICT Global",
                    support_email: support_email || "hello@webstackict.com",
                    bank_name: bank_name || "KUDA BANK",
                    bank_account_name: bank_account_name || "WEBSTACK ICT GLOBAL",
                    bank_account_number: bank_account_number || "2044813585"
                }
            });
            // Immediately run update query
            const rawResult = await prisma.$queryRawUnsafe(updateQuery, ...values);
            settingsRow = rawResult[0];
        }

        revalidatePath("/");
        revalidatePath("/enroll/payment/[id]", "page");
        revalidatePath("/scholarships/payment", "page");

        return NextResponse.json({ success: true, settings: settingsRow || body }, { status: 200 });
    } catch (error) {
        console.error("Settings POST Error:", error);
        return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
    }
}
