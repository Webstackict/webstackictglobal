import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const student_id = searchParams.get('student_id');

        if (!student_id) {
            return NextResponse.json({ status: "invalid", message: "Student ID is required." }, { status: 400 });
        }

        const student = await prisma.studentLedger.findFirst({
            where: {
                student_id: { equals: student_id, mode: 'insensitive' },
                deleted_at: null
            }
        });

        if (!student) {
            return NextResponse.json({ status: "invalid", message: "No student record found with this ID." }, { status: 404 });
        }

        let computedStatus = student.status;
        if (computedStatus === 'active' && student.end_date) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const endDate = new Date(student.end_date);
            if (today > endDate) {
                computedStatus = 'completed';
            }
        }

        // Return only safe public data
        return NextResponse.json({
            status: "valid",
            data: {
                full_name: student.full_name,
                student_id: student.student_id,
                program: student.program,
                registration_date: student.registration_date,
                status: computedStatus
            }
        });
    } catch (error) {
        console.error("Public Verification API Error:", error);
        return NextResponse.json({ status: "error", message: "Internal server error." }, { status: 500 });
    }
}
