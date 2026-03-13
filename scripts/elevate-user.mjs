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

async function elevate() {
    console.log("Elevating webstackict@gmail.com to super admin...");

    // We can't update auth.users directly via .from('users') if it's not in public schema
    // But we can use the admin auth API
    const { data: users, error: listError } = await supabase.auth.admin.listUsers();

    if (listError) {
        console.error("Error listing users:", listError.message);
        return;
    }

    const user = users.users.find(u => u.email === 'webstackict@gmail.com');
    if (!user) {
        console.error("User not found in auth.users");
        return;
    }

    const { data, error } = await supabase.auth.admin.updateUserById(
        user.id,
        { user_metadata: { ...user.user_metadata, role: 'admin' }, app_metadata: { ...user.app_metadata, is_super_admin: true } }
    );

    if (error) console.error("Error updating user:", error.message);
    else {
        console.log("User elevated successfully:", data.user.id);
        // Also update the public.users record if it exists (via Prisma/Raw SQL)
        // Actually, the check-test-user.mjs failed to find public.users, so maybe it doesn't exist or is in another schema.
    }
}

elevate();
