import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin-auth";

export async function PATCH(req, { params }) {
    if (!await isAdmin()) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {

        const body = await req.json();
        const { status } = body;

        if (!['pending', 'approved', 'declined'].includes(status)) {
            return NextResponse.json({ error: "Invalid status" }, { status: 400 });
        }

        const testimonial = await prisma.testimonials.update({
            where: { id },
            data: {
                status,
                updated_at: new Date()
            }
        });

        return NextResponse.json({
            message: `Testimonial marked as ${status}`,
            data: testimonial
        });
    } catch (error) {
        console.error("Admin testimonial patch error:", error);
        return NextResponse.json({ error: "Failed to update testimonial" }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    if (!await isAdmin()) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const { id } = await params;

        await prisma.testimonials.delete({
            where: { id }
        });

        return NextResponse.json({ message: "Testimonial deleted successfully" });
    } catch (error) {
        console.error("Admin testimonial delete error:", error);
        return NextResponse.json({ error: "Failed to delete testimonial" }, { status: 500 });
    }
}
