import './load-env.mjs';
import { prisma } from '../lib/prisma.js';
import { processScholarshipApproval } from '../lib/actions/scholarship-approval.js';

async function runTest() {
    console.log('--- Starting Verification Test ---');

    let testAppId = null;

    try {
        // 1. Create a mock application
        const testEmail = `test-applicant-${Date.now()}@example.com`;
        const mockApp = await prisma.scholarship_applications.create({
            data: {
                full_name: 'Test Applicant',
                email: testEmail,
                phone: '08012345678',
                state: 'Lagos',
                program: 'Software Engineering', // Matching one of our departments
                reason: 'Test scholarship approval automation',
                age: 25,
                status: 'pending'
            }
        });

        testAppId = mockApp.id;
        console.log(`Created mock application: ${testAppId} with email: ${testEmail}`);

        // 2. Invoke the approval automation
        console.log('Invoking processScholarshipApproval...');
        const result = await processScholarshipApproval(testAppId);
        console.log('Automation Result:', result);

        // 3. Verify results in DB
        console.log('Verifying DB records...');

        // Check Enrollment
        const enrollment = await prisma.enrollments.findFirst({
            where: { email: testEmail }
        });

        if (enrollment) {
            console.log('✅ Enrollment record created successfully:', enrollment.id);
        } else {
            console.error('❌ Enrollment record NOT found');
        }

        // Check User Profile
        const profile = await prisma.user_profile.findFirst({
            where: { full_name: 'Test Applicant' }
        });

        if (profile) {
            console.log('✅ User profile created/updated successfully:', profile.user_id);
        } else {
            console.error('❌ User profile NOT found');
        }

        // 4. Update status to approved to reflect what the API would do
        await prisma.scholarship_applications.update({
            where: { id: testAppId },
            data: { status: 'approved' }
        });
        console.log('Mock application status updated to "approved"');

        console.log('--- Verification Test Completed Successfully ---');

    } catch (error) {
        console.error('--- Verification Test Failed ---');
        console.error(error);
    } finally {
        // Cleanup if desired, or keep for manual inspection
        // For now, let's keep it for a bit then we can delete
        console.log('\nTest data remains in DB for manual inspection if needed.');
        await prisma.$disconnect();
    }
}

runTest();
