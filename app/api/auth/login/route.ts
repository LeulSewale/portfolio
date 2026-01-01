import { NextResponse } from 'next/server';
import { verifyCredentials, createSession, setSessionCookie } from '@/lib/auth-helpers';

export async function POST(request: Request) {
    try {
        const { username, password } = await request.json();

        // Validate credentials
        if (!verifyCredentials(username, password)) {
            return NextResponse.json(
                { success: false, error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Create session token
        const token = await createSession(username);

        // Set session cookie
        await setSessionCookie(token);

        return NextResponse.json({
            success: true,
            message: 'Login successful',
        });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { success: false, error: 'Login failed' },
            { status: 500 }
        );
    }
}
