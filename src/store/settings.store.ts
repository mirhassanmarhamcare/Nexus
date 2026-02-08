import { create } from 'zustand';

interface SiteSettings {
    storeName: string;
    currency: string;
    announcement: string;
    freeShippingThreshold: number;
    theme: string;
    whatsapp: string;
    email: string;
    instagram: string;
    facebook: string;
}

interface SettingsState {
    settings: SiteSettings | null;
    setSettings: (settings: SiteSettings) => void;
    fetchSettings: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set) => ({
    settings: null,
    setSettings: (settings) => set({ settings }),
    fetchSettings: async () => {
        try {
            const res = await fetch('/api/admin/settings');
            if (res.ok) {
                const data = await res.json();
                set({ settings: data });
            }
        } catch (error) {
            console.error("Failed to fetch settings:", error);
        }
    }
}));
