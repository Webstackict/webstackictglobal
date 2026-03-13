import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const instructors = await prisma.instructors.findMany({
            orderBy: { created_at: 'desc' },
        });
        return NextResponse.json(instructors, { status: 200 });
    } catch (error) {
        console.error('Error fetching instructors:', error);
        return NextResponse.json({ error: 'Failed to fetch instructors' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const data = await request.json();

        if (!data.full_name) {
            return NextResponse.json({ error: 'Full name is required' }, { status: 400 });
        }

        const newInstructor = await prisma.instructors.create({
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

        return NextResponse.json(newInstructor, { status: 201 });
    } catch (error) {
        console.error('Error creating instructor:', error);
        return NextResponse.json({ error: 'Failed to create instructor' }, { status: 500 });
    }
}
