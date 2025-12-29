const BASE_URL = '/data';

export interface RequestOptions extends RequestInit {
    params?: Record<string, string>;
}

export const apiClient = {
    async get<T>(path: string, options: RequestOptions = {}): Promise<T> {
        const url = new URL(`${BASE_URL}${path}`, window.location.origin);

        if (options.params) {
            Object.entries(options.params).forEach(([key, value]) => {
                url.searchParams.append(key, value);
            });
        }

        const response = await fetch(url.toString(), {
            method: 'GET',
            ...options,
        });

        if (!response.ok) {
            // In a real app, we might handle 401, 403, etc. here
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        return response.json();
    }
};
