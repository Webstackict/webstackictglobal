import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request, context) {
    try {
        const params = await context.params;
        const { ref } = params;

        if (!ref) {
            return NextResponse.json({ error: 'Reference ID is required' }, { status: 400 });
        }

        const application = await prisma.scholarship_applications.findUnique({
            where: { application_reference: ref },
            include: { program: true }
        });

        if (!application) {
            return NextResponse.json({ error: 'Application not found' }, { status: 404 });
        }

        // Return safe fields explicitly (no internal IDs if not needed)
        return NextResponse.json({
            id: application.id,
            full_name: application.full_name,
            email: application.email,
            phone: application.phone,
            application_fee: application.application_fee,
            payment_status: application.payment_status,
            application_reference: application.application_reference,
            program_title: application.program?.title
        });

    } catch (error) {
        console.error('Error fetching application by ref:', error);
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
