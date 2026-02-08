"use client";

interface CategorySelectorProps {
    value: string;
    onChange: (category: string) => void;
}

import categoriesData from "@/data/categories.json";

const CATEGORIES = categoriesData
    .filter(c => c.name !== 'All')
    .sort((a, b) => a.order - b.order)
    .map(c => c.name);

export default function CategorySelector({ value, onChange }: CategorySelectorProps) {
    return (
        <div className="group">
            <label className="block text-[9px] uppercase tracking-[0.2em] text-gray-500 mb-2 font-black group-focus-within:text-[#D4AF37] transition-colors">Taxonomy / Category</label>
            <div className="relative">
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full bg-zinc-900/50 border border-white/5 p-4 rounded-sm text-white font-display text-[10px] uppercase tracking-widest outline-none focus:border-[#D4AF37]/50 appearance-none transition-all"
                >
                    <option value="" disabled className="bg-black">SELECT ARCHIVE...</option>
                    {CATEGORIES.map(cat => (
                        <option key={cat} value={cat} className="bg-black">{cat}</option>
                    ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-600">
                    <svg width="10" height="10" viewBox="0 0 256 256"><path fill="currentColor" d="M216.49,104.49l-80,80a12,12,0,0,1-17,0l-80-80a12,12,0,0,1,17-17L128,159l71.51-71.52a12,12,0,0,1,17,17Z"></path></svg>
                </div>
            </div>
        </div>
    );
}
