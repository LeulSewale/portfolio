import { NextResponse } from 'next/server';
import { readContent, getPublicContent, writeContent } from '@/lib/data-helpers';
import { isAuthenticated } from '@/lib/auth-helpers';
import type { PortfolioContent } from '@/lib/types';

// GET - Retrieve portfolio content
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const section = searchParams.get('section');
        const isAdmin = await isAuthenticated();

        const content = await readContent();

        // If not admin, return only public content (filtered)
        const responseContent = isAdmin ? content : getPublicContent(content);

        // If specific section requested
        if (section && section in responseContent) {
            return NextResponse.json({
                success: true,
                data: responseContent[section as keyof PortfolioContent],
            });
        }

        // Return all content
        return NextResponse.json({
            success: true,
            data: responseContent,
        });
    } catch (error) {
        console.error('Error fetching content:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch content' },
            { status: 500 }
        );
    }
}

// PUT - Update portfolio content (admin only)
export async function PUT(request: Request) {
    try {
        // Check authentication
        const authenticated = await isAuthenticated();
        if (!authenticated) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const updates: Partial<PortfolioContent> = await request.json();

        // Read current content
        const currentContent = await readContent();

        // Merge updates
        const updatedContent: PortfolioContent = {
            ...currentContent,
            ...updates,
        };

        // Save updated content
        await writeContent(updatedContent);

        return NextResponse.json({
            success: true,
            message: 'Content updated successfully',
            data: updatedContent,
        });
    } catch (error) {
        console.error('Error updating content:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update content' },
            { status: 500 }
        );
    }
}
