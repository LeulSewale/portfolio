import { apiClient } from './client';
import type { Profile } from '../types';

export const profileService = {
    async getPublicProfile(): Promise<Profile> {
        return apiClient.get('/profile');
    },

    async getAdminProfile(): Promise<Profile> {
        return apiClient.get('/profile/admin');
    },

    async updateProfile(data: Partial<Profile>): Promise<Profile> {
        return apiClient.put('/profile/admin', data);
    },
};
