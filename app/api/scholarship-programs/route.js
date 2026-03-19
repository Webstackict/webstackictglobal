import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status') || 'All';

        let whereClause = {};
        if (status !== 'All') {
            whereClause.status = status.toLowerCase();
        }

        const programs = await prisma.scholarship_programs.findMany({
            where: whereClause,
            orderBy: {
                display_order: 'asc'
            },
            include: {
                _count: {
                    select: { applications: true }
                }
            }
        });

        return NextResponse.json(programs);
    } catch (error) {
        console.error('Error fetching scholarship programs:', error);
        return NextResponse.json({ error: 'Failed to fetch scholarship programs' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const body = await request.json();

        // Basic validation
        if (!body.title || !body.slug || !body.short_description) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const program = await prisma.scholarship_programs.create({
            data: {
                title: body.title,
                slug: body.slug,
                short_description: body.short_description,
                full_description: body.full_description || null,
                duration: body.duration || '3 months',
                application_fee: body.application_fee || 30000,
                status: body.status || 'active',
                display_order: parseInt(body.display_order) || 0
            }
        });

        return NextResponse.json(program, { status: 201 });
    } catch (error) {
        console.error('Error creating scholarship program:', error);
        if (error.code === 'P2002') {
            return NextResponse.json({ error: 'A program with this slug already exists' }, { status: 409 });
        }
        return NextResponse.json({ error: 'Failed to create scholarship program' }, { status: 500 });
    }
}
