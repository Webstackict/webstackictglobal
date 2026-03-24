import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin-auth";

// GET single student
export async function GET(req, { params }) {
    if (!await isAdmin()) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = await params;

        const student = await prisma.studentLedger.findUnique({
            where: { id }
        });

        if (!student) {
            return NextResponse.json({ error: "Student not found" }, { status: 404 });
        }

        let computedStatus = student.status;
        if (computedStatus === 'active' && student.end_date) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (today > new Date(student.end_date)) computedStatus = 'completed';
        }

        return NextResponse.json({ success: true, data: { ...student, status: computedStatus } });
    } catch (error) {
        console.error("Fetch Student Error:", error);
        return NextResponse.json({ error: "Failed to fetch student record" }, { status: 500 });
    }
}

// UPDATE single student
export async function PUT(req, { params }) {
    if (!await isAdmin()) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = await params;
        const body = await req.json();
        const { student_id, full_name, phone, email, program, gender, date_of_birth, address, learning_mode, status, start_date, end_date, registration_date, amount_paid, payment_status, balance } = body;

        const updateData = {
            full_name,
            phone,
            email,
            program,
            gender,
            date_of_birth: date_of_birth ? new Date(date_of_birth) : null,
            address,
            learning_mode,
            start_date: start_date ? new Date(start_date) : null,
            end_date: end_date ? new Date(end_date) : null,
            registration_date: registration_date ? new Date(registration_date) : undefined,
            amount_paid: amount_paid !== undefined && amount_paid !== "" ? parseFloat(amount_paid) || 0 : undefined,
            balance: balance !== undefined && balance !== "" ? parseFloat(balance) || 0 : undefined,
            payment_status,
            status
        };

        const student = await prisma.studentLedger.update({
            where: { id },
            data: updateData
        });

        let computedStatus = student.status;
        if (computedStatus === 'active' && student.end_date) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (today > new Date(student.end_date)) computedStatus = 'completed';
        }

        return NextResponse.json({ success: true, data: { ...student, status: computedStatus } });
    } catch (error) {
        console.error("Update Student Error:", error);
        return NextResponse.json({ error: "Failed to update student record" }, { status: 500 });
    }
}

// SOFT DELETE single student
export async function DELETE(req, { params }) {
    if (!await isAdmin()) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = await params;

        await prisma.studentLedger.update({
            where: { id },
            data: { deleted_at: new Date() }
        });

        return NextResponse.json({ success: true, message: "Student securely archived" });
    } catch (error) {
        console.error("Delete Student Error:", error);
        return NextResponse.json({ error: "Failed to delete student record" }, { status: 500 });
    }
}
