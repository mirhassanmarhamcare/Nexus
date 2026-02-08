"use client";

import { useState } from "react";
import { ProductVariant } from "@/data/products";
import { Plus, Trash, Package, CurrencyInr } from "@phosphor-icons/react";

interface VariantEditorProps {
    variants: ProductVariant[];
    onChange: (variants: ProductVariant[]) => void;
}

export default function VariantEditor({ variants, onChange }: VariantEditorProps) {
    const [newVariantName, setNewVariantName] = useState("");
    const [newVariantPrice, setNewVariantPrice] = useState("");
    const [newVariantStock, setNewVariantStock] = useState("10");

    const addVariant = () => {
        if (!newVariantName) return;

        const newVariant: ProductVariant = {
            id: `v-${Date.now()}`,
            name: newVariantName,
            price: newVariantPrice ? Number(newVariantPrice) : undefined,
            stock: Number(newVariantStock) || 0
        };

        onChange([...variants, newVariant]);
        setNewVariantName("");
        setNewVariantPrice("");
        setNewVariantStock("10");
    };

    const removeVariant = (id: string) => {
        onChange(variants.filter(v => v.id !== id));
    };

    const updateVariant = (id: string, field: keyof ProductVariant, value: any) => {
        onChange(variants.map(v => v.id === id ? { ...v, [field]: value } : v));
    };

    return (
        <div className="space-y-8">
            {/* Header & Description */}
            <div className="flex flex-col gap-2">
                <h3 className="text-xl font-display uppercase tracking-widest text-white">Product Archetypes</h3>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest">Define size, color, or material variations for this collection.</p>
            </div>

            {/* Variant List */}
            <div className="space-y-4">
                {variants.length === 0 ? (
                    <div className="py-12 text-center border border-dashed border-white/5 bg-white/[0.02] rounded-sm">
                        <span className="text-[10px] text-gray-600 uppercase tracking-widest">No variants defined for this product</span>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {variants.map((variant) => (
                            <div key={variant.id} className="group bg-zinc-900/40 border border-white/10 p-6 rounded-sm flex flex-col md:flex-row md:items-center gap-6 transition-all hover:bg-zinc-800/40 hover:border-[#D4AF37]/30">
                                <div className="flex-1">
                                    <label className="block text-[8px] uppercase tracking-[0.2em] text-gray-600 mb-2 font-black">Archetype Name</label>
                                    <input
                                        type="text"
                                        value={variant.name}
                                        onChange={(e) => updateVariant(variant.id, 'name', e.target.value)}
                                        className="bg-transparent text-white font-display text-lg tracking-widest uppercase outline-none w-full border-b border-white/5 focus:border-[#D4AF37]/50 pb-1"
                                    />
                                </div>

                                <div className="w-full md:w-32">
                                    <label className="block text-[8px] uppercase tracking-[0.2em] text-gray-600 mb-2 font-black">Price Rs.</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={variant.price || ""}
                                            onChange={(e) => updateVariant(variant.id, 'price', Number(e.target.value))}
                                            placeholder="Base"
                                            className="bg-zinc-800/50 text-white font-mono text-xs p-3 rounded-sm w-full outline-none border border-white/5 focus:border-[#D4AF37]/50"
                                        />
                                    </div>
                                </div>

                                <div className="w-full md:w-32">
                                    <label className="block text-[8px] uppercase tracking-[0.2em] text-gray-600 mb-2 font-black">Inventory</label>
                                    <input
                                        type="number"
                                        value={variant.stock || 0}
                                        onChange={(e) => updateVariant(variant.id, 'stock', Number(e.target.value))}
                                        className="bg-zinc-800/50 text-white font-mono text-xs p-3 rounded-sm w-full outline-none border border-white/5 focus:border-[#D4AF37]/50"
                                    />
                                </div>

                                <button
                                    type="button"
                                    onClick={() => removeVariant(variant.id)}
                                    className="p-3 text-red-500/50 hover:text-red-500 hover:bg-red-500/5 rounded-sm transition-all md:mt-6"
                                >
                                    <Trash size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Add Variant Form */}
            <div className="pt-8 border-t border-white/5">
                <div className="bg-[#D4AF37]/5 border border-[#D4AF37]/10 p-8 rounded-sm">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D4AF37] mb-6">Create New Archetype</h4>
                    <div className="flex flex-col md:flex-row gap-4">
                        <input
                            type="text"
                            placeholder="NAME (E.G. MIDNIGHT BLUE / LARGE)"
                            value={newVariantName}
                            onChange={(e) => setNewVariantName(e.target.value)}
                            className="flex-1 bg-zinc-900 border border-white/10 p-4 rounded-sm text-white text-[10px] font-mono uppercase tracking-widest outline-none focus:border-[#D4AF37] transition-all"
                        />
                        <input
                            type="number"
                            placeholder="PRICE"
                            value={newVariantPrice}
                            onChange={(e) => setNewVariantPrice(e.target.value)}
                            className="w-full md:w-32 bg-zinc-900 border border-white/10 p-4 rounded-sm text-white text-[10px] font-mono outline-none focus:border-[#D4AF37]"
                        />
                        <input
                            type="number"
                            placeholder="STOCK"
                            value={newVariantStock}
                            onChange={(e) => setNewVariantStock(e.target.value)}
                            className="w-full md:w-32 bg-zinc-900 border border-white/10 p-4 rounded-sm text-white text-[10px] font-mono outline-none focus:border-[#D4AF37]"
                        />
                        <button
                            type="button"
                            onClick={addVariant}
                            className="bg-[#D4AF37] text-black px-8 py-4 rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-[#F4CF57] transition-all flex items-center justify-center gap-2"
                        >
                            <Plus size={14} weight="bold" />
                            Add Archetype
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
