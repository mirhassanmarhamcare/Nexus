export interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    img: string;
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

// Helper to generate products
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
                img: '/hero.jpg' // Using placeholder image as we don't have real 100 images
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

export const productsDB: Product[] = shuffleArray(generateProducts());
