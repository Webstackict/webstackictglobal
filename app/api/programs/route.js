import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const programs = await prisma.programs.findMany({
            include: {
                instructors: {
                    include: {
                        instructor: true
                    }
                }
            },
            orderBy: { created_at: 'desc' },
        });
        return NextResponse.json(programs, { status: 200 });
    } catch (error) {
        console.error('Error fetching programs:', error);
        return NextResponse.json({ error: 'Failed to fetch programs' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const data = await request.json();

        // Basic validation
        if (!data.name || !data.slug || !data.short_description || !data.duration) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const newProgram = await prisma.programs.create({
            data: {
                name: data.name,
                slug: data.slug,
                short_description: data.short_description,
                full_description: data.full_description || null,
                duration: data.duration,
                price: parseFloat(data.price) || 0,
                discount_price: data.discount_price ? parseFloat(data.discount_price) : null,
                image_url: data.image_url || null,
                is_active: data.is_active !== undefined ? data.is_active : true,
                certification: data.certification || "industry recognized",
            },
        });

        // Handle instructor assignment if provided
        if (data.instructorIds && Array.isArray(data.instructorIds)) {
            await prisma.program_instructors.createMany({
                data: data.instructorIds.map(instructorId => ({
                    program_id: newProgram.id,
                    instructor_id: instructorId
                }))
            });
        }

        return NextResponse.json(newProgram, { status: 201 });
    } catch (error) {
        console.error('Error creating program:', error);
        if (error.code === 'P2002') {
            return NextResponse.json({ error: 'A program with this slug already exists' }, { status: 409 });
        }
        return NextResponse.json({ error: 'Failed to create program' }, { status: 500 });
    }
}
