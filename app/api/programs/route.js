import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const programs = await prisma.program.findMany({
            orderBy: { createdAt: 'desc' },
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
        if (!data.title || !data.slug || !data.description || !data.duration) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const newProgram = await prisma.program.create({
            data: {
                title: data.title,
                slug: data.slug,
                description: data.description,
                duration: data.duration,
                price: parseFloat(data.price) || 0,
                startDate: data.startDate ? new Date(data.startDate) : null,
                instructor: data.instructor || null,
                imageUrl: data.imageUrl || null,
                status: data.status || 'ACTIVE',
            },
        });

        return NextResponse.json(newProgram, { status: 201 });
    } catch (error) {
        console.error('Error creating program:', error);
        if (error.code === 'P2002') {
            return NextResponse.json({ error: 'A program with this slug already exists' }, { status: 409 });
        }
        return NextResponse.json({ error: 'Failed to create program' }, { status: 500 });
    }
}
