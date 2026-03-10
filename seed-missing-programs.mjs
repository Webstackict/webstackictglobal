import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve('.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').filter(line => line.trim() && !line.startsWith('#')).forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) {
        env[parts[0].trim()] = parts.slice(1).join('=').trim().replace(/^"(.*)"$/, '').replace(/^'(.*)'$/, '');
    }
});

const supabase = createClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY
);

const programs = [
    {
        name: "Web Development",
        slug: "web-development",
        description: "Learn HTML, CSS, JavaScript, React, and backend development with Node.js and Databases.",
        icon: "computer",
        fee: 250000,
        curriculum: [],
        additional_skills: []
    },
    {
        name: "Cybersecurity",
        slug: "cybersecurity",
        description: "Master ethical hacking, network security, threat intelligence, and digital forensics.",
        icon: "security",
        fee: 250000,
        curriculum: [],
        additional_skills: []
    },
    {
        name: "Data Analytics",
        slug: "data-analytics",
        description: "Analyze complex data sets using Python, SQL, Tableau, and statistical modeling techniques.",
        icon: "barChart",
        fee: 250000,
        curriculum: [],
        additional_skills: []
    },
    {
        name: "UI/UX Design",
        slug: "ui-ux-design",
        description: "Design stunning user interfaces and research user experiences using Figma and Adobe XD.",
        icon: "palette",
        fee: 200000,
        curriculum: [],
        additional_skills: []
    },
    {
        name: "AI Automation",
        slug: "ai-automation",
        description: "Build intelligent systems using Generative AI, LLMs, and automation workflows.",
        icon: "brain",
        fee: 300000,
        curriculum: [],
        additional_skills: []
    },
    {
        name: "Digital Marketing",
        slug: "digital-marketing",
        description: "Dominate SEO, SEM, content strategy, and social media advertising to grow businesses.",
        icon: "trendingUp",
        fee: 150000,
        curriculum: [],
        additional_skills: []
    },
    {
        name: "Forex Trading",
        slug: "forex-trading",
        description: "Master market analysis, risk management, and trading strategies in the global currency markets.",
        icon: "dollarCoin",
        fee: 150000,
        curriculum: [],
        additional_skills: []
    }
];

async function seedPrograms() {
    console.log("Checking and seeding missing programs into 'departments' table...");

    for (const prog of programs) {
        // Check if exists
        const { data: existing, error: findError } = await supabase
            .from('departments')
            .select('id')
            .eq('slug', prog.slug)
            .maybeSingle();

        if (findError) {
            console.error(`Error checking ${prog.name}:`, findError.message);
            continue;
        }

        let deptId;

        if (!existing) {
            // Insert
            const { data: inserted, error: insertError } = await supabase
                .from('departments')
                .insert([prog])
                .select()
                .single();

            if (insertError) {
                console.error(`Error inserting ${prog.name}:`, insertError.message);
                continue;
            }
            console.log(`✅ Inserted missing program: ${prog.name}`);
            deptId = inserted.id;
        } else {
            // Update icon and other fields for existing programs
            const { error: updateError } = await supabase
                .from('departments')
                .update({ icon: prog.icon, description: prog.description })
                .eq('id', existing.id);

            if (updateError) {
                console.error(`Error updating ${prog.name}:`, updateError.message);
            } else {
                console.log(`✓ Updated program: ${prog.name}`);
            }
            deptId = existing.id;
        }

        // Now, let's make sure each program has cohorts so the payment/enrollment logic doesn't crash
        const cohorts = [
            {
                department_id: deptId,
                cohort_number: 1, // March
                start_date: "2026-03-10",
                graduation_date: "2026-06-10",
                enrollment_deadline: "2026-03-05",
                status: "enrolling",
                footer: "March Cohort"
            },
            {
                department_id: deptId,
                cohort_number: 2, // April
                start_date: "2026-04-10",
                graduation_date: "2026-07-10",
                enrollment_deadline: "2026-04-05",
                status: "enrolling",
                footer: "April Cohort"
            }
        ];

        for (const cohort of cohorts) {
            // Check if cohort exists for this dept and footer
            const { data: existingCohort } = await supabase
                .from('cohorts')
                .select('id')
                .eq('department_id', deptId)
                .eq('footer', cohort.footer)
                .maybeSingle();

            if (!existingCohort) {
                const { error: cohortError } = await supabase.from('cohorts').insert([cohort]);
                if (cohortError) console.error(`   Error inserting ${cohort.footer} for ${prog.name}:`, cohortError.message);
                else console.log(`   + Inserted ${cohort.footer} for ${prog.name}`);
            }
        }
    }

    console.log("Seeding complete!");
}

seedPrograms();
