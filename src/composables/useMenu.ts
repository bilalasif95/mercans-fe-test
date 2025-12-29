import { ref } from 'vue';
import { menuService } from '../services/menuService';
import type { MenuLink } from '../types';

export function useMenu() {
    const menuLinks = ref<MenuLink[]>([]);
    const isLoading = ref(false);
    const error = ref<string | null>(null);

    const fetchMenu = async () => {
        isLoading.value = true;
        error.value = null;
        try {
            menuLinks.value = await menuService.getMenuLinks();
        } catch (e) {
            error.value = e instanceof Error ? e.message : 'Failed to load menu';
        } finally {
            isLoading.value = false;
        }
    };

    return {
        menuLinks,
        isLoading,
        error,
        fetchMenu
    };
}
