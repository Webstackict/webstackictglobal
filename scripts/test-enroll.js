const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testEnrollment() {
    // get the april cohort
    const cohort = await prisma.cohorts.findFirst({
        where: { name: { contains: 'April' } }
    });

    // get web dev program
    const program = await prisma.programs.findFirst({
        where: { name: { contains: 'Web Development' } }
    });

    if (!cohort || !program) {
        console.error('Cohort or program not found', { cohort: !!cohort, program: !!program });
        return;
    }

    const payload = {
        user_id: null,
        cohort_id: cohort.id,
        program_id: program.id,
        payment_method: 'card',
        full_name: 'John Doe',
        email: 'johndoe@example.com',
        phone: '+2348012345678',
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
