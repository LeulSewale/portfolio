import { apiClient } from './client';
import type { Project } from '../types';

export const projectsService = {
    async getPublicProjects(): Promise<Project[]> {
        return apiClient.get('/projects');
    },

    async getAdminProjects(): Promise<Project[]> {
        return apiClient.get('/projects/admin');
    },

    async createProject(data: Partial<Project>): Promise<Project> {
        return apiClient.post('/projects/admin', data);
    },

    async updateProject(id: string, data: Partial<Project>): Promise<Project> {
        return apiClient.put(`/projects/admin/${id}`, data);
    },

    async deleteProject(id: string): Promise<void> {
        return apiClient.delete(`/projects/admin/${id}`);
    },

    async toggleProject(id: string): Promise<Project> {
        return apiClient.patch(`/projects/admin/${id}/toggle`);
    },

    async reorderProjects(projects: { id: string; order: number }[]): Promise<void> {
        return apiClient.patch('/projects/admin/reorder', { projects });
    },
};
