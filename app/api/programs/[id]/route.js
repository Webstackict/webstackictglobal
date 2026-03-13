import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request, { params }) {
    try {
        const { id } = await params;
        const program = await prisma.programs.findUnique({
            where: { id },
            include: {
                instructors: {
                    include: {
                        instructor: true
                    }
                }
            }
        });

        if (!program) {
            return NextResponse.json({ error: 'Program not found' }, { status: 404 });
        }

        return NextResponse.json(program, { status: 200 });
    } catch (error) {
        console.error('Error fetching program:', error);
        return NextResponse.json({ error: 'Failed to fetch program' }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    try {
        const { id } = await params;
        const data = await request.json();

        // Update the program
        const updatedProgram = await prisma.programs.update({
            where: { id },
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

        // Sync instructors if provided
        if (data.instructorIds && Array.isArray(data.instructorIds)) {
            // Delete existing assignments
            await prisma.program_instructors.deleteMany({
                where: { program_id: id }
            });

            // Create new ones
            await prisma.program_instructors.createMany({
                data: data.instructorIds.map(instructorId => ({
                    program_id: id,
                    instructor_id: instructorId
                }))
            });
        }

        return NextResponse.json(updatedProgram, { status: 200 });
    } catch (error) {
        console.error('Error updating program:', error);
        if (error.code === 'P2025') {
            return NextResponse.json({ error: 'Program not found' }, { status: 404 });
        }
        if (error.code === 'P2002') {
            return NextResponse.json({ error: 'A program with this slug already exists' }, { status: 409 });
        }
        return NextResponse.json({ error: 'Failed to update program' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const { id } = await params;

        // Delete the program (junction records will be deleted via Cascade in schema)
        await prisma.programs.delete({
            where: { id },
        });

        return NextResponse.json({ message: 'Program deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting program:', error);
        if (error.code === 'P2025') {
            return NextResponse.json({ error: 'Program not found' }, { status: 404 });
        }
        return NextResponse.json({ error: 'Failed to delete program' }, { status: 500 });
    }
}
