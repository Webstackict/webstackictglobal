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

const supabase = createClient(env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function audit() {
    console.log("Detailed Auditing Supabase schema...");

    const objects = [
        'event_attendees',
        'enrollments',
        'cohorts',
        'departments',
        'user_enrolled_cohorts',
        'get_user_attended_events'
    ];

    const results = {};
    for (const obj of objects) {
        const { data, error, status, statusText } = await supabase.from(obj).select('*').limit(1);
        results[obj] = {
            status,
            statusText,
            error: error ? { code: error.code, message: error.message, details: error.details, hint: error.hint } : null
        };
    }

    // Check RPC with first signature
    const { error: rpcError1, status: s1 } = await supabase.rpc('get_user_academy_journey', {
        user_id_input: '00000000-0000-0000-0000-000000000000',
        cohort_status_input: 'completed'
    });
    results['get_user_academy_journey_sig1'] = {
        status: s1,
        error: rpcError1 ? { code: rpcError1.code, message: rpcError1.message } : null
    };

    // Check RPC with second signature
    const { error: rpcError2, status: s2 } = await supabase.rpc('get_user_academy_journey', {
        user_id_input: '00000000-0000-0000-0000-000000000000',
        cohort_statuses_csv: 'in_progress,enrolling'
    });
    results['get_user_academy_journey_sig2'] = {
        status: s2,
        error: rpcError2 ? { code: rpcError2.code, message: rpcError2.message } : null
    };

    console.log(JSON.stringify(results, null, 2));
}

audit();
