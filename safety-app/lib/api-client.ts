const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${API_BASE}${endpoint}`, {
        headers: { 'Content-Type': 'application/json' },
        ...options,
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(error?.error?.message || `HTTP ${res.status}`);
    }

    return res.json();
}

// ── Health ──────────────────────────────────────────────────────────────────
export const healthApi = {
    check: () => fetchAPI<{ success: boolean; data: { status: string } }>('/health'),
};

// ── Dashboard ────────────────────────────────────────────────────────────────
export const dashboardApi = {
    getSummary: () => fetchAPI<any>('/dashboard/summary'),
    getTrends: () => fetchAPI<any>('/dashboard/trends'),
};

export const detectionApi = {
    analyze: (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        return fetchAPI<any>('/detection/analyze', {
            method: 'POST',
            headers: {},
            body: formData,
        });
    }
};

export const configApi = {
    getCurrent: () => fetchAPI<any>('/config/current'),
};
