
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

async function createTestUser() {
    const email = 'audit-test@example.com';
    const password = 'Password123!';

    console.log(`Creating/Updating confirmed test user: ${email}...`);

    // Use admin API to create user with email_confirm: true
    const { data, error } = await supabase.auth.admin.createUser({
        email: email,
        password: password,
        email_confirm: true,
        user_metadata: { full_name: 'Audit Test User', role: 'student' }
    });

    if (error) {
        if (error.message.includes('already registered')) {
            console.log("User already exists. Attempting to update password and confirm...");
            const { data: users } = await supabase.auth.admin.listUsers();
            const user = users.users.find(u => u.email === email);
            if (user) {
                await supabase.auth.admin.updateUserById(user.id, {
                    password: password,
                    email_confirm: true
                });
                console.log("User updated and confirmed.");
            }
        } else {
            console.error("Error creating user:", error.message);
        }
    } else {
        console.log("User created and confirmed successfully:", data.user.id);
    }
}

createTestUser();
