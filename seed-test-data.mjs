import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envContent = fs.readFileSync('.env.local', 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) {
        const key = parts[0].trim();
        const value = parts.slice(1).join('=').trim().replace(/^"(.*)"$/, '').replace(/^'(.*)'$/, '');
        env[key] = value;
    }
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function seed() {
    console.log("Seeding test data...");

    // 1. Create or get a department
    let { data: dept, error: deptError } = await supabase
        .from('departments')
        .insert([{
            name: 'Software Engineering',
            slug: 'software-engineering',
            description: 'Learn to build modern web applications with React, Next.js, and Node.js.',
            curriculum: 'Module 1: HTML & CSS, Module 2: JavaScript, Module 3: React',
            additional_skills: 'Git, GitHub, Deployment',
            theme: 'blue',
            icon: 'laptop-code',
            job_placement: 1
        }])
        .select()
        .single();

    if (deptError) {
        if (deptError.code === '23505') {
            const { data: existingDept } = await supabase.from('departments').select('id').eq('slug', 'software-engineering').maybeSingle();
            dept = existingDept;
        } else {
            console.error("Error creating department:", deptError);
            return;
        }
    }

    console.log("Department created/found:", dept.id);

    // 2. Create a cohort
    const { data: cohort, error: cohortError } = await supabase
        .from('cohorts')
        .insert([{
            department_id: dept.id,
            cohort_number: 1,
            start_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
            graduation_date: new Date(Date.now() + 210 * 24 * 60 * 60 * 1000).toISOString(), // 210 days from now
            enrollment_deadline: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000).toISOString(), // 23 days from now
            status: 'enrolling',
            footer: 'Standard Cohort'
        }])
        .select()
        .single();

    if (cohortError) {
        console.error("Error creating cohort:", cohortError);
        return;
    }

    console.log("Cohort created:", cohort.id);
    console.log("Seeding complete!");
}

seed();
