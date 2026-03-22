import { prisma } from "@/lib/prisma";

export async function getSiteSettings() {
    try {
        let settings = await prisma.site_settings.findUnique({
            where: { id: "global" }
        });

        // Initialize default settings if they don't exist
        if (!settings) {
            settings = await prisma.site_settings.create({
                data: {
                    id: "global",
                    org_name: "Webstack ICT Global",
                    support_email: "hello@webstackict.com",
                    support_phone: "+234 800 123 4567",
                    address: "123 Tech Avenue",
                    bank_name: "KUDA BANK",
                    bank_account_name: "WEBSTACK ICT GLOBAL",
                    bank_account_number: "2044813585"
                }
            });
        }

        return settings;
    } catch (error) {
        console.error("Failed to fetch site settings:", error);
        // Fallback defaults if DB fails (e.g., during build or connection issues)
        return {
            org_name: "Webstack ICT Global",
            support_email: "hello@webstackict.com",
            support_phone: "+234 800 123 4567",
            address: "",
            bank_name: "KUDA BANK",
            bank_account_name: "WEBSTACK ICT GLOBAL",
            bank_account_number: "2044813585"
        };
    }
}
