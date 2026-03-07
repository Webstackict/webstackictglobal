import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(request, { params }) {
    try {
        const { id } = await params;
        const data = await request.json();

        // Update the program
        const updatedProgram = await prisma.program.update({
            where: { id },
            data: {
                title: data.title,
                slug: data.slug,
                description: data.description,
                duration: data.duration,
                price: parseFloat(data.price) || 0,
                startDate: data.startDate ? new Date(data.startDate) : null,
                instructor: data.instructor || null,
                imageUrl: data.imageUrl || null,
                status: data.status,
            },
        });

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

        // Delete the program
        await prisma.program.delete({
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
