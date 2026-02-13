import { NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/auth';
import { getToken } from 'next-auth/jwt';

export default async function proxy(request) {
    const { pathname } = request.nextUrl;

    // --- PATH DEFINITIONS ---
    const isPartnerRoute = pathname.startsWith('/partner');
    const isPartnerLogin = pathname.startsWith('/partner/login') || pathname.startsWith('/partner/register');

    const isAdminRoute = pathname.startsWith('/admin');
    const isAdminLogin = pathname.startsWith('/admin/login') || pathname.startsWith('/admin/signup');

    const isUserProtectedRoute = pathname.startsWith('/profile') || pathname.startsWith('/cart');
    const isUserAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/signup');

    // --- AUTH CHECKS ---
    const userToken = request.cookies.get('user_token')?.value;
    const partnerToken = request.cookies.get('partner_token')?.value;
    const adminToken = request.cookies.get('admin_token')?.value;

    // Check NextAuth Session
    const nextAuthSession = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET
    });

    let verifiedUser = userToken ? await verifyJWT(userToken) : null;
    let verifiedPartner = partnerToken ? await verifyJWT(partnerToken) : null;
    let verifiedAdmin = adminToken ? await verifyJWT(adminToken) : null;

    // --- USER LOGIC ---
    if (isUserProtectedRoute) {
        if (!verifiedUser && !nextAuthSession) {
            // Redirect to User Login if not authenticated
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    if (isUserAuthRoute || pathname === '/') {
        if (verifiedUser || nextAuthSession) {
            // Redirect to Profile if already authenticated
            return NextResponse.redirect(new URL('/profile', request.url));
        }
    }

    // --- PARTNER LOGIC ---
    if (isPartnerRoute) {
        if (isPartnerLogin) {
            if (verifiedPartner) {
                return NextResponse.redirect(new URL('/partner/dashboard', request.url));
            }
        } else {
            if (!verifiedPartner) {
                return NextResponse.redirect(new URL('/partner/login', request.url));
            }
        }
    }

    // --- ADMIN LOGIC ---
    if (isAdminRoute) {
        if (isAdminLogin) {
            if (verifiedAdmin && verifiedAdmin.role === 'admin') {
                return NextResponse.redirect(new URL('/admin/dashboard', request.url));
            }
            // Allow /admin/login and /admin/signup to proceed if not verified
            return NextResponse.next();
        } else {
            // For any other /admin/* routes
            if (pathname === '/admin') {
                if (verifiedAdmin && verifiedAdmin.role === 'admin') {
                    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
                } else {
                    return NextResponse.redirect(new URL('/admin/login', request.url));
                }
            }
            // Protected admin routes
            if (!verifiedAdmin || verifiedAdmin.role !== 'admin') {
                return NextResponse.redirect(new URL('/admin/login', request.url));
            }
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
