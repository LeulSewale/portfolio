import { apiClient } from './client';

export const authService = {
    async login(username: string, password: string) {
        return apiClient.post('/auth/login', { username, password });
    },

    async logout() {
        return apiClient.post('/auth/logout', {});
    },

    async verifyToken() {
        try {
            return await apiClient.get('/auth/verify');
        } catch {
            return { isAuthenticated: false };
        }
    },
};
