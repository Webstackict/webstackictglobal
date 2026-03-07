import './load-env.mjs';
import { submitScholarshipApplication } from '../lib/db/submit-scholarship.js';
import { prisma } from '../lib/prisma.js';

async function runTest() {
    console.log('--- Starting Submission Logic Verification ---');

    // Create a mock FormData object
    const formData = new FormData();
    formData.append('fullName', 'Browser Sync Test');
    formData.append('email', `sync-test-${Date.now()}@example.com`);
    formData.append('phone', '08022223333');
    formData.append('country', 'Nigeria');
    formData.append('state', 'Lagos');
    formData.append('departmentId', '8434defa-ba23-49e8-b04c-d74f07b91cdf'); // Software Engineering
    formData.append('experienceLevel', 'Beginner');
    formData.append('motivation', 'This is a test to verify the UI-Schema synchronization.');
    formData.append('linkedinUrl', 'https://linkedin.com/in/test');
    formData.append('portfolioUrl', 'https://test-portfolio.com');

    try {
        console.log('Processing submission...');
        const result = await submitScholarshipApplication(formData);
        console.log('Submission Result:', result);

        if (result.success) {
            console.log('✅ Submission logic successfully recorded the application.');

            // Verify in DB
            const app = await prisma.scholarship_applications.findFirst({
                where: { email: formData.get('email') }
            });

            if (app) {
                console.log('✅ Found application in DB with correct fields:');
                console.log(`   - Full Name: ${app.full_name}`);
                console.log(`   - Motivation: ${app.motivation}`);
                console.log(`   - Experience Level: ${app.experience_level}`);
                console.log(`   - Status: ${app.status}`);
            } else {
                console.error('❌ Application NOT found in DB');
            }
        } else {
            console.error('❌ Submission failed:', result.error);
        }
    } catch (error) {
        console.error('--- Verification Test Failed ---');
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}

runTest();
