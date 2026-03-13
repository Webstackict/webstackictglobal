import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { processScholarshipApproval } from '@/lib/actions/scholarship-approval';
import { isAdmin } from '@/lib/admin-auth';

export async function PATCH(request, { params }) {
    if (!await isAdmin()) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const { id } = await params;
        const body = await request.json();
        const { status } = body;

        if (!status || !['approved', 'rejected', 'pending', 'shortlisted'].includes(status.toLowerCase())) {
            return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
        }

        // Retry logic for database operations
        const executeWithRetry = async (fn, retries = 3, delay = 1000) => {
            for (let i = 0; i < retries; i++) {
                try {
                    return await fn();
                } catch (err) {
                    const isConnectionError = err?.message?.includes("Can't reach database server") ||
                        err?.message?.includes("Timed out") ||
                        err?.message?.includes("Connection error");

                    if (isConnectionError && i < retries - 1) {
                        console.warn(`Database connection attempt ${i + 1} failed. Retrying in ${delay}ms...`);
                        await new Promise(resolve => setTimeout(resolve, delay));
                        continue;
                    }
                    throw err;
                }
            }
        };

        const updatedApplication = await executeWithRetry(() => prisma.scholarship_applications.update({
            where: { id },
            data: { status: status.toLowerCase() }
        }));

        // Trigger automation if approved
        if (status.toLowerCase() === 'approved') {
            try {
                // We wrap this in a block to avoid blocking the main response
                // though ideally we might want to return the result
                const automationResult = await processScholarshipApproval(id);
                console.log('Scholarship automation result:', automationResult);

                return NextResponse.json({
                    ...updatedApplication,
                    automation: automationResult
                });
            } catch (autoError) {
                console.error('Automation failed but status was updated:', autoError);
                return NextResponse.json({
                    ...updatedApplication,
                    automationError: autoError.message
                }, { status: 200 }); // Still return 200 as the status was updated
            }
        }

        return NextResponse.json(updatedApplication);
    } catch (error) {
        console.error('Scholarship Status Update Error:', error);
        return NextResponse.json({
            error: 'Failed to update scholarship application status',
            details: error.message
        }, { status: 500 });
    }
}
