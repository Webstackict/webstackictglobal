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

async function seed() {
    console.log("Seeding cohorts into actual schema...");

    const { data: dept } = await supabase
        .from('departments')
        .select('id')
        .eq('slug', 'software-engineering')
        .maybeSingle();

    if (!dept) {
        console.error("Department not found!");
        return;
    }

    // Clear existing "enrolling" test cohorts to avoid confusion if needed, 
    // but better to just add them.

    const cohorts = [
        {
            department_id: dept.id,
            cohort_number: 1, // March
            start_date: "2026-03-10",
            graduation_date: "2026-06-10",
            enrollment_deadline: "2026-03-05",
            status: "enrolling",
            max_size: 130,
            footer: "March Cohort"
        },
        {
            department_id: dept.id,
            cohort_number: 2, // April
            start_date: "2026-04-10",
            graduation_date: "2026-07-10",
            enrollment_deadline: "2026-04-05",
            status: "enrolling",
            max_size: 130,
            footer: "April Cohort"
        },
        {
            department_id: dept.id,
            cohort_number: 3, // May
            start_date: "2026-05-10",
            graduation_date: "2026-08-10",
            enrollment_deadline: "2026-05-05",
            status: "enrolling",
            max_size: 130,
            footer: "May Cohort"
        }
    ];

    for (const cohort of cohorts) {
        const { data, error } = await supabase.from('cohorts').insert([cohort]).select();
        if (error) console.error(`Error inserting ${cohort.footer}:`, error.message);
        else console.log(`Inserted ${cohort.footer}`);
    }
}

seed();
