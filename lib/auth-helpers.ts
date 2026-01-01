import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const SESSION_SECRET = new TextEncoder().encode(
    process.env.SESSION_SECRET || 'your-secret-key-change-in-production'
);

const SESSION_COOKIE_NAME = 'portfolio-admin-session';
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

export interface SessionPayload {
    username: string;
    isAuthenticated: boolean;
    exp: number;
}

/**
 * Verifies admin credentials against environment variables
 */
export function verifyCredentials(username: string, password: string): boolean {
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin';

    return username === adminUsername && password === adminPassword;
}

/**
 * Creates a new session token
 */
export async function createSession(username: string): Promise<string> {
    const exp = Math.floor(Date.now() / 1000) + SESSION_DURATION / 1000;

    const token = await new SignJWT({ username, isAuthenticated: true })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime(exp)
        .setIssuedAt()
        .sign(SESSION_SECRET);

    return token;
}

/**
 * Verifies and decodes a session token
 */
export async function verifySession(token: string): Promise<SessionPayload | null> {
    try {
        const verified = await jwtVerify(token, SESSION_SECRET);
        const payload = verified.payload;

        // Validate the payload has required fields
        if (typeof payload.username === 'string' && typeof payload.isAuthenticated === 'boolean') {
            return payload as unknown as SessionPayload;
        }
        return null;
    } catch (error) {
        return null;
    }
}

/**
 * Gets the current session from cookies
 */
export async function getSession(): Promise<SessionPayload | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!token) {
        return null;
    }

    return verifySession(token);
}

/**
 * Sets the session cookie
 */
export async function setSessionCookie(token: string): Promise<void> {
    const cookieStore = await cookies();

    cookieStore.set(SESSION_COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: SESSION_DURATION / 1000, // maxAge is in seconds
        path: '/',
    });
}

/**
 * Clears the session cookie
 */
export async function clearSessionCookie(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Checks if user is authenticated (for API routes)
 */
export async function isAuthenticated(): Promise<boolean> {
    const session = await getSession();
    return session?.isAuthenticated === true;
}
