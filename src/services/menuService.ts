import { apiClient } from './apiClient';
import type { MenuLink } from '../types';

export const menuService = {
    async getMenuLinks(): Promise<MenuLink[]> {
        return apiClient.get<MenuLink[]>('/menuLinks.json');
    }
};
