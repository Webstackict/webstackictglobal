import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
                    bank_account_number: "2044813585"
                }
            }, { status: 200 });
        }

        // Only return required public settings for checkout
        return NextResponse.json({
            settings: {
                bank_name: settings.bank_name,
                bank_account_name: settings.bank_account_name,
                bank_account_number: settings.bank_account_number
            }
        }, { status: 200 });
    } catch (error) {
        console.error("Public Settings API Error:", error);
        return NextResponse.json({ error: "Failed to fetch public settings" }, { status: 500 });
    }
}
