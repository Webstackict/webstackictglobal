const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const crypto = require('crypto');

async function testEnrollment() {
    const cohort = await prisma.cohorts.findFirst({
        where: { name: { contains: 'April' } }
    });

    const program = await prisma.programs.findFirst({
        where: { name: { contains: 'Web Development' } }
    });

    if (!cohort || !program) {
        console.error('Cohort or program not found');
        return;
    }

    const payload = {
        user_id: crypto.randomUUID(), // fake user id
        cohort_id: cohort.id,
        program_id: program.id,
        payment_method: 'card',
        full_name: 'John Doe Logged In',
        email: 'johndoe-log@example.com',
        phone: '+2348012345679',
        country: 'Nigeria',
        city: 'Lagos',
        referral_code: ''
    };

    const url = 'http://localhost:3000/api/enrollments';
    console.log(`Sending POST to ${url} with`, payload);

    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    const json = await res.json();
    console.log('Status:', res.status);
    console.log('Response:', json);
}

testEnrollment().catch(console.error).finally(() => prisma.$disconnect());
