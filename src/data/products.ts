import productsData from './products.json';

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
}

const CATEGORIES = [
    'Watches',
    'Home Decor',
    'Home Cleaning',
    'Men & Women Watches',
    'Couple Watches',
    'Jewelry',
    'Wallet',
    'Bras',
    'Night Suit',
    'Rings'
];

// Helper to generate products for other categories
const generateProducts = (): Product[] => {
    let products: Product[] = [];
    let idCounter = 1;

    CATEGORIES.forEach(category => {
        for (let i = 1; i <= 10; i++) {
            products.push({
                id: `prod-${idCounter}`,
                name: `${category} Item ${i}`,
                price: ((idCounter * 17) % 450) + 50, // Deterministic price based on ID
                category: category,
                images: ['/hero.jpg'], // Using placeholder image
                status: 'published',
                variants: []
            });
            idCounter++;
        }
    });

    return products;
};

// Deterministic seeded random to avoid hydration errors
let seed = 5678;
const seededRandom = () => {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
};

// Helper to shuffle array
const shuffleArray = (array: Product[]) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(seededRandom() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

// Cast and map the JSON import to include defaults for new fields
const realProducts: Product[] = (productsData as any[]).map(p => ({
    ...p,
    status: p.status || 'published',
    variants: p.variants || []
}));

export const productsDB: Product[] = [...realProducts, ...shuffleArray(generateProducts())];
