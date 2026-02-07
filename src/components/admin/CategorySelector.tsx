"use client";

interface CategorySelectorProps {
    value: string;
    onChange: (category: string) => void;
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
    'Rings',
    'Women Handbags'
];

export default function CategorySelector({ value, onChange }: CategorySelectorProps) {
    return (
        <div>
            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Category</label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full bg-zinc-900 border border-white/10 p-4 rounded text-white focus:border-[#D4AF37] outline-none appearance-none"
            >
                <option value="" disabled>Select a Category</option>
                {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                ))}
            </select>
        </div>
    );
}
