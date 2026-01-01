import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth-helpers';

export async function GET() {
    try {
        const session = await getSession();

        return NextResponse.json({
            success: true,
            data: {
                isAuthenticated: session?.isAuthenticated === true,
                username: session?.username,
            },
        });
    } catch (error) {
        return NextResponse.json({
            success: true,
            data: { isAuthenticated: false },
        });
    }
}
