import { apiClient } from './client';
import type { SectionConfig, NavigationItem } from '../types';

export interface SettingsData {
    sections: SectionConfig[];
    navigation: NavigationItem[];
}

export const settingsService = {
    async getSettings(): Promise<SettingsData> {
        return apiClient.get('/settings');
    },

    async updateSettings(data: SettingsData): Promise<SettingsData> {
        return apiClient.put('/settings/admin', data);
    },
};
