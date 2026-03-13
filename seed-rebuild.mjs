import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    console.log('Seeding new enrollment system data...');

    // 1. Create Instructors
    const instructors = await Promise.all([
        prisma.instructors.create({
            data: {
                full_name: 'Dr. Michael Chen',
                title: 'Chief Technology Officer',
                bio: 'Senior architect with over 15 years of experience in distributed systems and web technologies.',
                expertise: 'Software Architecture, React, Node.js',
                is_active: true,
                socials: { linkedin: "https://linkedin.com", twitter: "https://twitter.com" }
            }
        }),
        prisma.instructors.create({
            data: {
                full_name: 'Sarah Adebayo',
                title: 'Senior Data Scientist',
                bio: 'Expert in statistical modeling and machine learning applications in financial technology.',
                expertise: 'Data Analysis, Python, AI Automation',
                is_active: true,
                socials: { linkedin: "https://linkedin.com" }
            }
        })
    ]);

    console.log(`Created ${instructors.length} instructors.`);

    // 2. Create Programs
    const programData = [
        { name: 'Website Development', slug: 'website-development', short_description: 'Master modern full-stack web development from HTML/CSS to React and Next.js.' },
        { name: 'Data Analysis', slug: 'data-analysis', short_description: 'Learn to extract insights from complex datasets using Python, SQL, and PowerBI.' },
        { name: 'Cybersecurity', slug: 'cybersecurity', short_description: 'Protect digital assets and defend against sophisticated cyber threats.' },
        { name: 'Forex Trading', slug: 'forex-trading', short_description: 'Advanced strategies for technical and fundamental analysis in currency markets.' },
        { name: 'Mobile App Development', slug: 'mobile-app-development', short_description: 'Build native and cross-platform mobile applications for iOS and Android.' },
        { name: 'Digital Marketing', slug: 'digital-marketing', short_description: 'Comprehensive strategies for SEO, SEM, content marketing, and brand growth.' },
        { name: 'AI Automation', slug: 'ai-automation', short_description: 'Leverage LLMs and automation tools to revolutionize business workflows.' }
    ];

    const createdPrograms = [];
    for (const p of programData) {
        const program = await prisma.programs.create({
            data: {
                ...p,
                price: 250000,
                discount_price: 225000,
                is_active: true,
                duration: '3 months intensive',
                full_description: `Our ${p.name} program is designed to take students from beginner to professional level within 12 weeks of intensive project-based learning.`
            }
        });
        createdPrograms.push(program);
    }

    console.log(`Created ${createdPrograms.length} programs.`);

    // 3. Assign Instructors to Programs
    await prisma.program_instructors.createMany({
        data: [
            { program_id: createdPrograms[0].id, instructor_id: instructors[0].id },
            { program_id: createdPrograms[4].id, instructor_id: instructors[0].id },
            { program_id: createdPrograms[1].id, instructor_id: instructors[1].id },
            { program_id: createdPrograms[6].id, instructor_id: instructors[1].id }
        ]
    });

    console.log('Assigned instructors to key programs.');

    // 4. Create Cohorts
    const cohortsData = [
        {
            name: 'April 2026 Intake',
            cohort_code: 'WS-2026-APR',
            cohort_number: 1,
            start_date: new Date('2026-04-10'),
            graduation_date: new Date('2026-07-10'),
            enrollment_deadline: new Date('2026-04-05'),
            status: 'enrolling',
            visibility_logic: 'public',
            label: 'April Cohort',
            description: 'The first major intake of 2026 featuring all tech specializations.'
        },
        {
            name: 'May 2026 Intake',
            cohort_code: 'WS-2026-MAY',
            cohort_number: 2,
            start_date: new Date('2026-05-15'),
            graduation_date: new Date('2026-08-15'),
            enrollment_deadline: new Date('2026-05-10'),
            status: 'enrolling',
            visibility_logic: 'public',
            label: 'May Cohort',
            description: 'Summer intensive programs for students and professionals.'
        }
    ];

    for (const c of cohortsData) {
        await prisma.cohorts.create({ data: c });
    }

    console.log('Created active cohorts.');
    console.log('Seed successful!');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
