import { promises as fs } from 'fs';
import path from 'path';
import type { PortfolioContent } from './types';

const CONTENT_FILE_PATH = path.join(process.cwd(), 'data', 'content.json');

/**
 * Reads the portfolio content from the JSON file
 */
export async function readContent(): Promise<PortfolioContent> {
    try {
        const fileContent = await fs.readFile(CONTENT_FILE_PATH, 'utf-8');
        return JSON.parse(fileContent) as PortfolioContent;
    } catch (error) {
        console.error('Error reading content file:', error);
        throw new Error('Failed to read portfolio content');
    }
}

/**
 * Writes portfolio content to the JSON file with atomic operation
 */
export async function writeContent(content: PortfolioContent): Promise<void> {
    try {
        // Update timestamp
        content.updatedAt = new Date().toISOString();

        // Write to temporary file first
        const tempPath = `${CONTENT_FILE_PATH}.tmp`;
        await fs.writeFile(tempPath, JSON.stringify(content, null, 2), 'utf-8');

        // Rename to actual file (atomic operation)
        await fs.rename(tempPath, CONTENT_FILE_PATH);
    } catch (error) {
        console.error('Error writing content file:', error);
        throw new Error('Failed to save portfolio content');
    }
}

/**
 * Updates a specific section of the portfolio content
 */
export async function updateContentSection<K extends keyof PortfolioContent>(
    section: K,
    data: PortfolioContent[K]
): Promise<PortfolioContent> {
    const content = await readContent();
    content[section] = data;
    await writeContent(content);
    return content;
}

/**
 * Validates that required fields exist in content
 */
export function validateContent(content: Partial<PortfolioContent>): boolean {
    // Basic validation - extend as needed
    if (content.profile) {
        if (!content.profile.name || !content.profile.email) {
            return false;
        }
    }
    return true;
}

/**
 * Gets public-safe content (filters out hidden items)
 */
export function getPublicContent(content: PortfolioContent): PortfolioContent {
    return {
        ...content,
        skillCategories: content.skillCategories
            .filter(cat => cat.visible)
            .sort((a, b) => a.order - b.order),
        projects: content.projects
            .filter(proj => proj.visible)
            .sort((a, b) => a.order - b.order),
        testimonials: content.testimonials
            .filter(test => test.visible)
            .sort((a, b) => a.order - b.order),
        navigation: content.navigation.filter(nav => nav.visible),
        sections: content.sections
            .filter(sec => sec.visible)
            .sort((a, b) => a.order - b.order),
    };
}
