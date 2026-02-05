import { create } from 'zustand';

export interface CartItem {
    id: string; // Added ID for safer removal, though legacy used index. We will support index-based removal for strictness if needed, but ID is better. Legacy Cart used simple push/splice.
    name: string;
    price: number;
    img?: string;
}

interface CartState {
    items: CartItem[];
    addToCart: (item: Omit<CartItem, 'id'>) => void;
    removeFromCart: (index: number) => void; // Legacy used index-based splice
    clearCart: () => void;
    total: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
    items: [],
    addToCart: (item) => set((state) => ({
        items: [...state.items, { ...item, id: Math.random().toString(36).substr(2, 9) }]
    })),
    removeFromCart: (index) => set((state) => {
        const newItems = [...state.items];
        newItems.splice(index, 1);
        return { items: newItems };
    }),
    clearCart: () => set({ items: [] }),
    total: () => get().items.reduce((sum, item) => sum + item.price, 0),
}));
