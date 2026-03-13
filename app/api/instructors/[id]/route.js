import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request, { params }) {
    try {
        const { id } = await params;
        const instructor = await prisma.instructors.findUnique({
            where: { id },
            include: {
                programs: {
                    include: {
                        program: true
                    }
                }
            }
        });

        if (!instructor) {
            return NextResponse.json({ error: 'Instructor not found' }, { status: 404 });
        }

        return NextResponse.json(instructor, { status: 200 });
    } catch (error) {
        console.error('Error fetching instructor:', error);
        return NextResponse.json({ error: 'Failed to fetch instructor' }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    try {
        const { id } = await params;
        const data = await request.json();

        const updatedInstructor = await prisma.instructors.update({
            where: { id },
            data: {
                full_name: data.full_name,
                title: data.title || null,
                photo_url: data.photo_url || null,
                bio: data.bio || null,
                expertise: data.expertise || null,
                socials: data.socials || {},
                is_active: data.is_active !== undefined ? data.is_active : true,
            },
        });

        return NextResponse.json(updatedInstructor, { status: 200 });
    } catch (error) {
        console.error('Error updating instructor:', error);
        if (error.code === 'P2025') {
            return NextResponse.json({ error: 'Instructor not found' }, { status: 404 });
        }
        return NextResponse.json({ error: 'Failed to update instructor' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const { id } = await params;

        await prisma.instructors.delete({
            where: { id },
        });

        return NextResponse.json({ message: 'Instructor deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting instructor:', error);
        if (error.code === 'P2025') {
            return NextResponse.json({ error: 'Instructor not found' }, { status: 404 });
        }
        return NextResponse.json({ error: 'Failed to delete instructor' }, { status: 500 });
    }
}
