import { apiClient } from './client';
import type { SkillCategory } from '../types';

// Service aligned with backend skillCategory endpoints
export const skillsService = {
    async getPublicSkills(): Promise<SkillCategory[]> {
        return apiClient.get('/skills');
    },

    async getAdminSkills(): Promise<SkillCategory[]> {
        return apiClient.get('/skills/admin');
    },

    // Create a skill category (includes skills array)
    async createCategory(data: Partial<SkillCategory>): Promise<SkillCategory> {
        return apiClient.post('/skills/admin', data);
    },

    // Update a skill category (including skills array)
    async updateCategory(id: string, data: Partial<SkillCategory>): Promise<SkillCategory> {
        return apiClient.put(`/skills/admin/${id}`, data);
    },

    async deleteCategory(id: string): Promise<void> {
        return apiClient.delete(`/skills/admin/${id}`);
    },

    async toggleCategory(id: string): Promise<SkillCategory> {
        return apiClient.patch(`/skills/admin/${id}/toggle`);
    },

    async reorderCategories(categories: { id: string; order: number }[]): Promise<void> {
        return apiClient.patch('/skills/admin/reorder', { skills: categories });
    },
};
