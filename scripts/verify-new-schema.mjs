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

async function verify() {
    console.log("Verifying cohorts table...");
    const { data: cohorts, error: cohortError } = await supabase.from('cohorts').select('label, duration, onsite_seats, online_seats, status').limit(3);
    if (cohortError) console.error("Cohort table error:", cohortError.message);
    else {
        console.log("Cohort table sample data:");
        console.table(cohorts);
    }

    console.log("\nVerifying user_enrolled_cohorts view...");
    const { data: viewData, error: viewError } = await supabase.from('user_enrolled_cohorts').select('*').limit(1);
    if (viewError) console.error("View error:", viewError.message);
    else {
        console.log("View sample data structure:");
        console.log(JSON.stringify(viewData[0], null, 2));
    }
}

verify();
