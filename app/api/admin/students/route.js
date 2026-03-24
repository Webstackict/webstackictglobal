import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin-auth";

export async function POST(req) {
    if (!await isAdmin()) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const {
            full_name, phone, email, program, gender, date_of_birth, address, learning_mode, start_date, end_date, registration_date
        } = body;

        if (!full_name || !phone || !program) {
            return NextResponse.json({ error: "Missing required fields (full_name, phone, program)" }, { status: 400 });
        }

        // Generate student_id inside a transaction to prevent race conditions
        const newStudent = await prisma.$transaction(async (tx) => {
            // Find the latest student sequentially
            const lastStudent = await tx.studentLedger.findFirst({
                orderBy: { student_id: 'desc' }
            });

            let nextNumber = 1;
            if (lastStudent && lastStudent.student_id.startsWith("WTG-STU-")) {
                const parts = lastStudent.student_id.split("-");
                if (parts.length === 3) {
                    const lastNum = parseInt(parts[2], 10);
                    if (!isNaN(lastNum)) {
                        nextNumber = lastNum + 1;
                    }
                }
            }

            const student_id = `WTG-STU-${nextNumber.toString().padStart(6, '0')}`;

            return await tx.studentLedger.create({
                data: {
                    student_id,
                    full_name,
                    phone,
                    email: email || null,
                    program,
                    gender: gender || null,
                    date_of_birth: date_of_birth ? new Date(date_of_birth) : null,
                    address: address || null,
                    learning_mode: learning_mode || null,
                    start_date: start_date ? new Date(start_date) : null,
                    end_date: end_date ? new Date(end_date) : null,
                    registration_date: registration_date ? new Date(registration_date) : new Date(),
                    status: "active"
                }
            });
        });

        return NextResponse.json({ success: true, data: newStudent }, { status: 201 });
    } catch (error) {
        console.error("Create Student Ledger Error:", error);
        if (error.code === 'P2002') {
            return NextResponse.json({ error: "A student with this information already exists" }, { status: 409 });
        }
        return NextResponse.json({ error: "Failed to create student record" }, { status: 500 });
    }
}

export async function GET(req) {
    if (!await isAdmin()) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const search = searchParams.get('search') || "";
        const statusParam = searchParams.get('status') || "all";
        const program = searchParams.get('program') || "all";

        const page = parseInt(searchParams.get('page') || "1");
        const limit = parseInt(searchParams.get('limit') || "20");
        const skip = (page - 1) * limit;

        const where = {
            deleted_at: null,
            ...(statusParam !== 'all' && { status: statusParam }),
            ...(program !== 'all' && { program }),
            ...(search && {
                OR: [
                    { full_name: { contains: search, mode: 'insensitive' } },
                    { student_id: { contains: search, mode: 'insensitive' } },
                    { phone: { contains: search, mode: 'insensitive' } }
                ]
            })
        };

        const [students, total] = await Promise.all([
            prisma.studentLedger.findMany({
                where,
                orderBy: { registration_date: 'desc' },
                skip,
                take: limit
            }),
            prisma.studentLedger.count({ where })
        ]);

        const computedStudents = students.map(s => {
            let sStatus = s.status;
            if (sStatus === 'active' && s.end_date) {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                if (today > new Date(s.end_date)) sStatus = 'completed';
            }
            return { ...s, status: sStatus };
        });

        return NextResponse.json({
            success: true,
            data: computedStudents,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error("Fetch Students Error:", error);
        return NextResponse.json({ error: "Failed to fetch student records" }, { status: 500 });
    }
}
