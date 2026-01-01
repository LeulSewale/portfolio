import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const SESSION_COOKIE_NAME = 'token';
// Use same secret as backend; prefer env override
const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || process.env.NEXT_PUBLIC_JWT_SECRET || 'your-secret-key-change-this-in-production'
);

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Allow login page and public assets
    // Also allow Next.js internals and static files
    if (pathname === '/admin/login' || pathname.startsWith('/_next') || pathname.startsWith('/static')) {
        return NextResponse.next();
    }

    // Check if accessing admin routes
    if (pathname.startsWith('/admin')) {
        const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;

        if (!token) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }

        try {
            // Verify token
            await jwtVerify(token, JWT_SECRET);
            return NextResponse.next();
        } catch (error) {
            // Invalid or expired token
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/admin/:path*',
};
