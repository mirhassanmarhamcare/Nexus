import productsData from './products.json';
import categoriesData from './categories.json';

export interface ProductVariant {
    id: string;
    name: string;
    price?: number;
    stock?: number;
}

export interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    images: string[];
    description?: string;
    details?: Record<string, string | undefined>;
    productCode?: string;
    variants?: ProductVariant[];
    status?: 'draft' | 'published' | 'archived';
    priority?: number;
    updatedAt?: string;
    inStock?: boolean;
    material?: string;
    careInstructions?: string;
    deliveryTime?: string;
    dropDate?: string; // ISO Date string for future drop
    isDrop?: boolean;
    isFlash?: boolean;
    isTopSeller?: boolean;
}


// Final exported DB, sorted by priority (lower first, e.g. 1st, 2nd, 3rd)
export const productsDB: Product[] = (productsData as any[]).map(p => ({
    ...p,
    status: p.status || 'published',
    variants: p.variants || [],
    priority: p.priority || 0
})).sort((a, b) => {
    const pA = a.priority || 0;
    const pB = b.priority || 0;

    // If both are 0, maintain some stability
    if (pA === 0 && pB === 0) return 0;
    // Push 0s to the end by giving them a very high internal value or handle explicitly
    if (pA === 0) return 1;
    if (pB === 0) return -1;

    return pA - pB;
});
