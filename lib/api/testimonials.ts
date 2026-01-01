import { apiClient } from './client';
import type { Testimonial } from '../types';

export const testimonialsService = {
    async getPublicTestimonials(): Promise<Testimonial[]> {
        return apiClient.get('/testimonials');
    },

    async getAdminTestimonials(): Promise<Testimonial[]> {
        return apiClient.get('/testimonials/admin');
    },

    async createTestimonial(data: Partial<Testimonial>): Promise<Testimonial> {
        return apiClient.post('/testimonials/admin', data);
    },

    async updateTestimonial(id: string, data: Partial<Testimonial>): Promise<Testimonial> {
        return apiClient.put(`/testimonials/admin/${id}`, data);
    },

    async deleteTestimonial(id: string): Promise<void> {
        return apiClient.delete(`/testimonials/admin/${id}`);
    },

    async toggleTestimonial(id: string): Promise<Testimonial> {
        return apiClient.patch(`/testimonials/admin/${id}/toggle`);
    },

    async reorderTestimonials(testimonials: { id: string; order: number }[]): Promise<void> {
        return apiClient.patch('/testimonials/admin/reorder', { testimonials });
    },
};
