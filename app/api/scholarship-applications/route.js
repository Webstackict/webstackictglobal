import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request) {
    try {
        const body = await request.json();
        const {
            full_name,
            email,
            phone,
            country,
            state,
            preferred_department,
            motivation,
            experience_level
        } = body;

        // Basic validation
        if (!full_name || !email || !phone || !preferred_department) {
            return NextResponse.json({
                error: 'Missing required fields (full_name, email, phone, preferred_department)'
            }, { status: 400 });
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
        }

        // Retry logic for database operations (resilience)
        const executeWithRetry = async (fn, retries = 3, delay = 1000) => {
            for (let i = 0; i < retries; i++) {
                try {
                    return await fn();
                } catch (err) {
                    const isConnectionError = err.message.includes("Can't reach database server") ||
                        err.message.includes("Timed out") ||
                        err.message.includes("Connection error");

                    if (isConnectionError && i < retries - 1) {
                        console.warn(`Database connection attempt ${i + 1} failed. Retrying in ${delay}ms...`);
                        await new Promise(resolve => setTimeout(resolve, delay));
                        continue;
                    }
                    throw err;
                }
            }
        };

        // Check for Existing Application by email
        const existingApplication = await executeWithRetry(() => prisma.scholarship_applications.findFirst({
            where: { email: email.toLowerCase() }
        }));

        if (existingApplication) {
            return NextResponse.json({
                error: 'An application with this email already exists.'
            }, { status: 409 });
        }

        // Create Scholarship Application
        const application = await executeWithRetry(() => prisma.scholarship_applications.create({
            data: {
                full_name,
                email: email.toLowerCase(),
                phone,
                country: country || 'Nigeria',
                state,
                program: preferred_department,
                reason: motivation,
                experience_level: experience_level || 'Beginner',
                referral_code: request.cookies.get('webstack_referral_code')?.value || null,
                status: 'pending'
            }
        }));

        return NextResponse.json({
            message: 'Application submitted successfully',
            applicationId: application.id
        }, { status: 201 });

    } catch (error) {
        console.error('Scholarship API Error:', {
            message: error.message,
            stack: error.stack
        });
        return NextResponse.json({
            error: 'Failed to process scholarship application',
            details: error.message
        }, { status: 500 });
    }
}
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');

        const where = {};
        if (status && status !== 'All') {
            where.status = status.toLowerCase();
        }

        const applications = await prisma.scholarship_applications.findMany({
            where,
            orderBy: { submitted_at: 'desc' }
        });

        return NextResponse.json(applications);
    } catch (error) {
        console.error('Scholarship API GET Error:', {
            message: error.message,
            stack: error.stack
        });
        return NextResponse.json({
            error: 'Failed to fetch scholarship applications',
            details: error.message
        }, { status: 500 });
    }
}
