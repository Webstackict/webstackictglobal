import { NextResponse } from 'next/server';

export function middleware(request) {
    let response;

    // Check if we are trying to access the admin dashboard
    if (request.nextUrl.pathname.startsWith('/admin')) {

        // Skip middleware for login page
        if (request.nextUrl.pathname === '/admin/login') {
            response = NextResponse.next();
        } else {
            // Check for our custom JWT cookie
            const adminToken = request.cookies.get('admin_token');

            // If no token exists, redirect to the admin login page
            if (!adminToken) {
                const loginUrl = new URL('/admin/login', request.url);
                response = NextResponse.redirect(loginUrl);
            } else if (request.nextUrl.pathname === '/admin') {
                // If accessing root /admin, redirect to /admin/dashboard
                const dashboardUrl = new URL('/admin/dashboard', request.url);
                response = NextResponse.redirect(dashboardUrl);
            } else {
                response = NextResponse.next();
            }
        }
    } else {
        response = NextResponse.next();
    }

    // Capture referral code from URL if present
    const ref = request.nextUrl.searchParams.get('ref');
    if (ref) {
        response.cookies.set('webstack_referral_code', ref, {
            path: '/',
            maxAge: 60 * 60 * 24 * 30, // 30 days
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
        });
    }

    return response;
}

export const config = {
    // Matches all routes except static assets
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
