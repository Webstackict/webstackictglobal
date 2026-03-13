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

async function checkUser() {
    console.log("Checking user account status for webstackict@gmail.com...");

    // Check auth.users via a direct raw query if possible, or just look for the profile
    const { data: profile, error: profileError } = await supabase
        .from('user_profile')
        .select('*')
        .eq('full_name', 'Webstack Test User') // From previous check
        .maybeSingle();

    if (profileError) console.error("Profile error:", profileError.message);
    else console.log("Profile found:", profile);

    const { data: user, error: userError } = await supabase
        .from('users') // auth.users mapped via Prisma
        .select('id, email, role, is_super_admin')
        .eq('email', 'webstackict@gmail.com')
        .maybeSingle();

    if (userError) console.error("User error:", userError.message);
    else console.log("User found:", user);
}

checkUser();
