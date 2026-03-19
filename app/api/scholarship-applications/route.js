import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdmin } from '@/lib/admin-auth';

// Create a new unpaid application
export async function POST(request) {
    try {
        const body = await request.json();
        const { full_name, email, phone, program_id, short_about_you, referral_code } = body;

        if (!full_name || !email || !phone || !program_id || !short_about_you) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
        }

        const program = await prisma.scholarship_programs.findUnique({
            where: { id: program_id }
        });

        if (!program) {
            return NextResponse.json({ error: 'Selected scholarship program does not exist' }, { status: 404 });
        }

        // Prevent duplicate application for the same program by the same email
        const existingApp = await prisma.scholarship_applications.findFirst({
            where: { email: email.toLowerCase(), program_id }
        });

        if (existingApp) {
            return NextResponse.json({ error: 'You have already applied for this program.' }, { status: 409 });
        }

        const appRef = `WS-SCH-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 6)}`.toUpperCase();

        const application = await prisma.scholarship_applications.create({
            data: {
                full_name,
                email: email.toLowerCase(),
                phone,
                program_id,
                short_about_you,
                referral_code: referral_code || request.cookies.get('webstack_referral_code')?.value || null,
                application_fee: program.application_fee,
                payment_method: null,
                payment_status: 'unpaid',
                application_reference: appRef
            }
        });

        return NextResponse.json({
            message: 'Application initiated successfully',
            applicationId: application.id,
            applicationReference: application.application_reference
        }, { status: 201 });

    } catch (error) {
        console.error('Scholarship API POST Error:', error);
        return NextResponse.json({ error: 'Failed to initiate application', details: error.message }, { status: 500 });
    }
}

// Get all applications for Admin
export async function GET(request) {
    if (!await isAdmin()) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');

        const where = {};
        if (status && status !== 'All') {
            where.payment_status = status.toLowerCase();
        }

        const applications = await prisma.scholarship_applications.findMany({
            where,
            include: {
                program: true
            },
            orderBy: { submitted_at: 'desc' }
        });

        return NextResponse.json(applications);
    } catch (error) {
        console.error('Scholarship API GET Error:', error);
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
