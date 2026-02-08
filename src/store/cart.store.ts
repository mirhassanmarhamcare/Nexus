import { create } from 'zustand';

export interface CartItem {
    id: string; // Added ID for safer removal, though legacy used index. We will support index-based removal for strictness if needed, but ID is better. Legacy Cart used simple push/splice.
    name: string;
    price: number;
    img?: string;
}

interface Promo {
    code: string;
    type: 'percentage' | 'fixed';
    value: number;
}

interface CartState {
    items: CartItem[];
    appliedPromo: Promo | null;
    addToCart: (item: Omit<CartItem, 'id'>) => void;
    removeFromCart: (index: number) => void;
    clearCart: () => void;
    applyPromo: (promo: Promo | null) => void;
    subtotal: () => number;
    discount: () => number;
    total: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
    items: [],
    appliedPromo: null,
    addToCart: (item) => set((state) => ({
        items: [...state.items, { ...item, id: Math.random().toString(36).substr(2, 9) }]
    })),
    removeFromCart: (index) => set((state) => {
        const newItems = [...state.items];
        newItems.splice(index, 1);
        return { items: newItems };
    }),
    clearCart: () => set({ items: [], appliedPromo: null }),
    applyPromo: (promo) => set({ appliedPromo: promo }),
    subtotal: () => get().items.reduce((sum, item) => sum + item.price, 0),
    discount: () => {
        const { appliedPromo } = get();
        const sub = get().subtotal();
        if (!appliedPromo) return 0;
        if (appliedPromo.type === 'percentage') return (sub * appliedPromo.value) / 100;
        return appliedPromo.value;
    },
    total: () => {
        const sub = get().subtotal();
        if (sub === 0) return 0;
        const disc = get().discount();
        return Math.max(0, sub - disc);
    },
}));
