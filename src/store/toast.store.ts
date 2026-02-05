import { create } from 'zustand';

interface ToastState {
    message: string | null;
    isActive: boolean;
    showToast: (msg: string) => void;
    hideToast: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
    message: null,
    isActive: false,
    showToast: (msg) => {
        set({ message: msg, isActive: true });
        setTimeout(() => {
            set({ isActive: false });
        }, 3000);
    },
    hideToast: () => set({ isActive: false }),
}));
