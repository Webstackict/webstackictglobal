import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdmin } from '@/lib/admin-auth';

export async function GET() {
    if (!await isAdmin()) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // 1. Total Students (Successful Enrollments)
        const totalStudents = await prisma.enrollments.count({
            where: { payment_status: 'PAID' }
        });

        // 2. Active Programs
        const activePrograms = await prisma.programs.count({
            where: { is_active: true }
        });

        // 3. Monthly Revenue (Successful payments in the last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const monthlyRevenue = await prisma.payments.aggregate({
            where: {
                status: 'PAID',
                created_at: { gte: thirtyDaysAgo }
            },
            _sum: {
                amount: true
            }
        });

        // 4. New Leads (Scholarship Applications)
        const newLeads = await prisma.scholarship_applications.count({
            where: { payment_status: 'unpaid' }
        });

        // 5. Apps Today (Enrollments created today)
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const appsToday = await prisma.enrollments.count({
            where: {
                created_at: { gte: today }
            }
        });

        // 6. Recent Applications
        const recentApplications = await prisma.enrollments.findMany({
            take: 5,
            orderBy: { created_at: 'desc' },
            include: {
                program: { select: { name: true } }
            }
        });

        // 7. Latest Payments
        const latestPayments = await prisma.payments.findMany({
            take: 5,
            orderBy: { created_at: 'desc' },
            include: {
                enrollment: {
                    select: {
                        full_name: true,
                        program: { select: { name: true } }
                    }
                }
            }
        });

        return NextResponse.json({
            stats: {
                totalStudents,
                activePrograms,
                monthlyRevenue: Number(monthlyRevenue._sum.amount || 0),
                newLeads,
                appsToday
            },
            recentApplications,
            latestPayments
        });

    } catch (error) {
        console.error('Dashboard Stats API Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
