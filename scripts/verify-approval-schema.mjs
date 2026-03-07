import './load-env.mjs';
import { processScholarshipApproval } from '../lib/actions/scholarship-approval.js';
import { prisma } from '../lib/prisma.js';

async function runTest() {
    console.log('--- Verifying Approval Automation with New Schema ---');

    try {
        // 1. Find the latest test application
        const app = await prisma.scholarship_applications.findFirst({
            where: { full_name: 'Browser Sync Test' },
            orderBy: { submitted_at: 'desc' }
        });

        if (!app) {
            throw new Error('Test application not found. Run test-submission.mjs first.');
        }

        console.log(`Found application ID: ${app.id} for ${app.full_name}`);

        // 2. Process Approval
        console.log('Processing approval...');
        const result = await processScholarshipApproval(app.id);
        console.log('Approval Result:', result);

        if (result.success) {
            console.log('✅ Approval automation completed successfully.');

            // 3. Verify Enrollment
            const enrollment = await prisma.enrollments.findFirst({
                where: { email: app.email }
            });

            if (enrollment) {
                console.log('✅ Enrollment record found:');
                console.log(`   - Program: ${enrollment.program}`);
                console.log(`   - Cohort ID: ${enrollment.cohort_id}`);
                console.log(`   - Payment Status: ${enrollment.payment_status}`);
            } else {
                console.error('❌ Enrollment record NOT found');
            }
        } else {
            console.error('❌ Approval failed');
        }
    } catch (error) {
        console.error('--- Verification Test Failed ---');
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}

runTest();
