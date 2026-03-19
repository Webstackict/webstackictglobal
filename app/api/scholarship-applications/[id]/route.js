import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { processScholarshipApproval } from '@/lib/actions/scholarship-approval';
import { isAdmin } from '@/lib/admin-auth';

export async function PATCH(request, context) {
    const body = await request.json();
    const { payment_status, payment_method } = body;
    const isUserAdmin = await isAdmin();

    if (!isUserAdmin) {
        // Public users can ONLY flag their application as pending_approval for bank transfers.
        if (payment_status !== 'pending_approval' || payment_method !== 'bank_transfer') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
    }

    try {
        const params = await context.params;
        const { id } = params;

        const validStatuses = ['unpaid', 'paid', 'pending_approval', 'failed'];
        if (!payment_status || !validStatuses.includes(payment_status.toLowerCase())) {
            return NextResponse.json({ error: 'Invalid payment status' }, { status: 400 });
        }

        const updateData = { payment_status: payment_status.toLowerCase() };
        if (payment_method) {
            updateData.payment_method = payment_method.toLowerCase();
        }

        if (payment_status.toLowerCase() === 'paid') {
            if (!isUserAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            updateData.payment_verified_at = new Date();
        }

        const updatedApplication = await prisma.scholarship_applications.update({
            where: { id },
            data: updateData
        });

        // Trigger old automation pipeline if we want to issue commissions etc.
        // Though processScholarshipApproval might need rewriting, we call it if marking as paid so legacy email sends out.
        if (payment_status.toLowerCase() === 'paid') {
            try {
                // Ignore errors from automation so we don't block the UI update
                processScholarshipApproval(id).catch(e => console.error("Automation error:", e));
            } catch (autoError) {
                console.error("Failed to run automation");
            }
        }

        return NextResponse.json(updatedApplication);
    } catch (error) {
        console.error('Scholarship Update Error:', error);
        return NextResponse.json({ error: 'Failed to update application' }, { status: 500 });
    }
}
