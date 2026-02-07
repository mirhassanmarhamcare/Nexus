"use client";

import { useState } from "react";
import { ProductVariant } from "@/data/products";

interface VariantEditorProps {
    variants: ProductVariant[];
    onChange: (variants: ProductVariant[]) => void;
}

export default function VariantEditor({ variants, onChange }: VariantEditorProps) {
    const [newVariantName, setNewVariantName] = useState("");
    const [newVariantPrice, setNewVariantPrice] = useState("");

    const addVariant = () => {
        if (!newVariantName) return;

        const newVariant: ProductVariant = {
            id: `v-${Date.now()}`,
            name: newVariantName,
            price: newVariantPrice ? Number(newVariantPrice) : undefined,
            stock: 10 // Default stock
        };

        onChange([...variants, newVariant]);
        setNewVariantName("");
        setNewVariantPrice("");
    };

    const removeVariant = (id: string) => {
        onChange(variants.filter(v => v.id !== id));
    };

    return (
        <div className="bg-zinc-900 border border-white/10 p-4 rounded">
            <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-4">Variants</h3>

            <div className="space-y-2 mb-4">
                {variants.map((variant) => (
                    <div key={variant.id} className="flex items-center justify-between bg-black/50 p-3 rounded border border-white/5">
                        <div>
                            <span className="font-bold text-white mr-2">{variant.name}</span>
                            {variant.price && <span className="text-sm text-[#D4AF37]">Rs. {variant.price}</span>}
                        </div>
                        <button
                            type="button"
                            onClick={() => removeVariant(variant.id)}
                            className="text-red-500 hover:text-red-400 text-xs uppercase"
                        >
                            Remove
                        </button>
                    </div>
                ))}
            </div>

            <div className="flex gap-2">
                <input
                    type="text"
                    placeholder="Variant Name (e.g. Red, XL)"
                    value={newVariantName}
                    onChange={(e) => setNewVariantName(e.target.value)}
                    className="flex-1 bg-black border border-white/10 p-2 rounded text-white text-sm"
                />
                <input
                    type="number"
                    placeholder="Price Override (Optional)"
                    value={newVariantPrice}
                    onChange={(e) => setNewVariantPrice(e.target.value)}
                    className="w-32 bg-black border border-white/10 p-2 rounded text-white text-sm"
                />
                <button
                    type="button"
                    onClick={addVariant}
                    className="bg-white text-black px-4 py-2 rounded text-sm font-bold uppercase hover:bg-gray-200"
                >
                    Add
                </button>
            </div>
        </div>
    );
}
