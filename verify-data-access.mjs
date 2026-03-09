import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envContent = fs.readFileSync('.env.local', 'utf8');
const env = {};
envContent.split('\n').filter(line => line.trim() && !line.startsWith('#')).forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) {
        const key = parts[0].trim();
        const value = parts.slice(1).join('=').trim().replace(/^"(.*)"$/, '').replace(/^'(.*)'$/, '');
        env[key] = value;
    }
});

// Use ANON key to test if permissions are correctly granted for public access
const supabase = createClient(env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_ANON_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function verify() {
    console.log("Verifying data access with ANON key...");

    const results = {};

    // Test views
    const { data: v1, error: e1 } = await supabase.from('user_enrolled_cohorts').select('*').limit(1);
    results['user_enrolled_cohorts'] = { success: !e1, error: e1?.message || null };

    const { data: v2, error: e2 } = await supabase.from('get_user_attended_events').select('*').limit(1);
    results['get_user_attended_events'] = { success: !e2, error: e2?.message || null };

    // Test RPC
    const { data: r1, error: er1 } = await supabase.rpc('get_user_academy_journey', {
        user_id_input: '00000000-0000-0000-0000-000000000000',
        cohort_status_input: 'completed'
    });
    results['get_user_academy_journey'] = { success: !er1, error: er1?.message || null };

    console.log(JSON.stringify(results, null, 2));
}

verify();
