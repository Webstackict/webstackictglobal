import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';

export async function POST(request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
        }

        const supabase = await createClient();

        // 1. Authenticate with Supabase
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error || !data.user) {
            return NextResponse.json({ error: error?.message || 'Invalid credentials' }, { status: 401 });
        }

        // 2. Check if user is an admin in the database
        const adminUser = await prisma.users.findUnique({
            where: { id: data.user.id },
            select: { is_super_admin: true }
        });

        if (!adminUser?.is_super_admin) {
            // Sign out if they aren't an admin
            await supabase.auth.signOut();
            return NextResponse.json({ error: 'Access denied. You do not have administrative privileges.' }, { status: 403 });
        }

        // 3. Set the admin_token cookie
        const response = NextResponse.json({ success: true, message: 'Logged in successfully' });

        // We set a long-lived session cookie for the admin panel
        response.cookies.set('admin_token', 'webstack-admin-verified', {
            path: '/',
            maxAge: 60 * 60 * 24, // 24 hours
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
        });

        return response;
    } catch (error) {
        console.error('Admin Login API Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
