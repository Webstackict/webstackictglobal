import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                getAll: () => request.cookies.getAll(),
                setAll: (cookiesToSet) => {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set(name, value, options)
                    );
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    const { data: { user } } = await supabase.auth.getUser();

    // 1. Admin Protection
    if (request.nextUrl.pathname.startsWith('/admin')) {
        if (request.nextUrl.pathname === '/admin/login') {
            return response;
        }
        const adminToken = request.cookies.get('admin_token');
        if (!adminToken) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
    }

    // 2. Dashboard Protection (Private routes)
    const isDashboard = request.nextUrl.pathname.startsWith('/dashboard');
    const isOnboarding = request.nextUrl.pathname.startsWith('/onboarding');

    if ((isDashboard || isOnboarding) && !user) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // 3. Prevent logged-in users from accessing login/signup
    const isAuthPage = ['/login', '/signup', '/auth'].some(path =>
        request.nextUrl.pathname.startsWith(path)
    );
    if (isAuthPage && user) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // 4. Onboarding Redirect
    if (user && !user.user_metadata?.onboarding_completed && isDashboard) {
        return NextResponse.redirect(new URL('/onboarding', request.url));
    }

    // 4. Capture referral code
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
