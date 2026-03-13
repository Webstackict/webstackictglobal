import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin-auth";

export async function GET() {
    if (!await isAdmin()) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {

        const testimonials = await prisma.testimonials.findMany({
            orderBy: {
                created_at: 'desc'
            }
        });

        return NextResponse.json({ data: testimonials });
    } catch (error) {
        console.error("Admin testimonials fetch error:", error);
        return NextResponse.json({ error: "Failed to fetch testimonials" }, { status: 500 });
    }
}
