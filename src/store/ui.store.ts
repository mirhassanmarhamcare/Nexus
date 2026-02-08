import { create } from 'zustand';

interface UIState {
    theme: 'dark' | 'light';
    isCartOpen: boolean;
    isSearchOpen: boolean;
    isMenuOpen: boolean;
    isAuthOpen: boolean;
    isCheckoutOpen: boolean;
    activePageId: string | null;
    activeProduct: any | null; // Using any for flexibility, or define a Product interface

    setTheme: (theme: 'dark' | 'light') => void;
    toggleCart: () => void;
    toggleSearch: () => void;
    toggleMenu: () => void;
    toggleAuth: () => void;
    toggleCheckout: () => void;
    openPage: (pageId: string) => void;
    closePage: () => void;
    openProduct: (product: any) => void;
    closeProduct: () => void;
    closeAllOverlays: () => void;
}

export const useUIStore = create<UIState>((set) => ({
    theme: 'dark',
    isCartOpen: false,
    isSearchOpen: false,
    isMenuOpen: false,
    isAuthOpen: false,
    isCheckoutOpen: false,
    activePageId: null,
    activeProduct: null,

    setTheme: (theme) => set({ theme }),
    toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
    toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),
    toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),
    toggleAuth: () => set((state) => ({ isAuthOpen: !state.isAuthOpen })),
    toggleCheckout: () => set((state) => ({ isCheckoutOpen: !state.isCheckoutOpen })),
    openPage: (pageId) => set({ activePageId: pageId, isMenuOpen: false }),
    closePage: () => set({ activePageId: null }),
    openProduct: (product) => set({ activeProduct: product }),
    closeProduct: () => set({ activeProduct: null }),
    closeAllOverlays: () => set({
        isCartOpen: false,
        isSearchOpen: false,
        isMenuOpen: false,
        isAuthOpen: false,
        isCheckoutOpen: false,
        activePageId: null,
        activeProduct: null
    })
}));
