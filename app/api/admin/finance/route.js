import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin-auth";

export async function GET() {
    if (!await isAdmin()) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        // 1. Calculate Total Revenue (YTD) - All PAID payments
        const totalRevenueResult = await prisma.payments.aggregate({
            where: { status: 'PAID' },
            _sum: { amount: true }
        });
        const totalRevenue = Number(totalRevenueResult._sum.amount || 0);

        // 2. Calculate Monthly Revenue - All PAID payments in the last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const monthlyRevenueResult = await prisma.payments.aggregate({
            where: {
                status: 'PAID',
                created_at: { gte: thirtyDaysAgo }
            },
            _sum: { amount: true }
        });
        const monthlyRevenue = Number(monthlyRevenueResult._sum.amount || 0);

        // 3. Outstanding Invoices mock (Calculate total of PENDING payments instead)
        const outstandingResult = await prisma.payments.aggregate({
            where: { status: 'PENDING' },
            _sum: { amount: true }
        });
        const outstandingRevenue = Number(outstandingResult._sum.amount || 0);

        // 4. Active Subscriptions / Enrollments
        const activeEnrollmentsCount = await prisma.enrollments.count({
            where: {
                payment_status: 'PAID'
            }
        });

        // 5. Recent Transactions
        const rawTransactions = await prisma.payments.findMany({
            take: 10,
            orderBy: { created_at: 'desc' },
            include: {
                enrollment: {
                    include: {
                        program: true
                    }
                }
            }
        });

        const transactions = rawTransactions.map(txn => {
            const statusMap = {
                'PAID': 'Completed',
                'PENDING': 'Pending',
                'FAILED': 'Failed',
                'AWAITING_VERIFICATION': 'Pending',
                'REJECTED': 'Failed'
            };

            const date = new Date(txn.created_at);
            const isToday = new Date().toDateString() === date.toDateString();
            const dateStr = isToday ? `Today, ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}` : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

            return {
                id: txn.reference ? `TXN-${txn.reference.substring(0, 6).toUpperCase()}` : `TXN-${txn.id.substring(0, 6).toUpperCase()}`,
                student: txn.enrollment?.full_name || "Unknown Student",
                amount: Number(txn.amount),
                date: dateStr,
                status: statusMap[txn.status] || 'Pending',
                type: txn.enrollment?.program?.title || "Program Enrollment"
            };
        });

        // Fetch Invoices
        let rawInvoices = [];
        try {
            rawInvoices = await prisma.$queryRawUnsafe(`
                SELECT id, invoice_number, client_name, amount, due_date, status 
                FROM public.invoices 
                ORDER BY created_at DESC 
                LIMIT 5;
            `);
        } catch (e) {
            console.error("No invoices table yet or query failed", e);
        }

        const invoices = rawInvoices.map(inv => {
            const date = new Date(inv.due_date);
            return {
                id: inv.invoice_number,
                client: inv.client_name,
                amount: Number(inv.amount),
                due: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                status: inv.status
            };
        });

        return NextResponse.json({
            success: true,
            metrics: {
                totalRevenue,
                monthlyRevenue,
                outstandingRevenue,
                activeEnrollmentsCount
            },
            transactions,
            invoices
        }, { status: 200 });

    } catch (error) {
        console.error("Finance API Error:", error);
        return NextResponse.json({ error: "Failed to fetch finance data" }, { status: 500 });
    }
}
