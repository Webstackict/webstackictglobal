import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(request, context) {
    try {
        // Await the params object before accessing its properties
        const params = await context.params;
        const body = await request.json();

        // Prevent updating ID
        delete body.id;

        const updatedProgram = await prisma.scholarship_programs.update({
            where: {
                id: params.id
            },
            data: {
                ...body,
                updated_at: new Date()
            }
        });

        return NextResponse.json(updatedProgram);
    } catch (error) {
        console.error('Error updating scholarship program:', error);
        return NextResponse.json({ error: 'Failed to update scholarship program' }, { status: 500 });
    }
}

export async function DELETE(request, context) {
    try {
        // Await the params object before accessing its properties
        const params = await context.params;

        await prisma.scholarship_programs.delete({
            where: {
                id: params.id
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting scholarship program:', error);
        return NextResponse.json({ error: 'Failed to delete scholarship program' }, { status: 500 });
    }
}
