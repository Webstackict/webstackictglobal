import './load-env.mjs';
import { prisma } from '../lib/prisma.js';

async function run() {
    console.log('Reseeding departments and cohorts...');
    try {
        // 1. Create Departments
        const depts = [
            { id: "8434defa-ba23-49e8-b04c-d74f07b91cdf", name: "Software Engineering", slug: "software-engineering", description: "Learn software development from scratch.", curriculum: {} },
            { id: "0656a900-ec27-43e1-a43c-db6154b6cf8b", name: "Web Development", slug: "web-development", description: "Modern web development with the latest stacks.", curriculum: {} }
        ];

        for (const dept of depts) {
            await prisma.departments.upsert({
                where: { id: dept.id },
                update: dept,
                create: dept
            });
            console.log(`✅ Department ${dept.name} seeded.`);
        }

        // 2. Create an "enrolling" cohort for Software Engineering
        const startDate = new Date();
        startDate.setDate(startDate.getDate() + 30); // Start in 30 days
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 6); // 6 months duration

        const cohort = {
            id: "c962b144-8abd-4720-94f7-e7e23f03762c",
            department_id: "8434defa-ba23-49e8-b04c-d74f07b91cdf",
            cohort_number: 1,
            label: "Cohort 1 - Software Engineering",
            status: "enrolling",
            start_date: startDate,
            graduation_date: endDate,
            enrollment_deadline: startDate,
            footer: "Apply now for Cohort 1!"
        };

        await prisma.cohorts.upsert({
            where: { id: cohort.id },
            update: cohort,
            create: cohort
        });
        console.log(`✅ Cohort ${cohort.label} seeded.`);

    } catch (error) {
        console.error('❌ Failed to reseed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

run();
