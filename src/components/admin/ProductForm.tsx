"use client";

import { useState } from "react";
import { Product } from "@/data/products";
import VariantEditor from "./VariantEditor";
import CategorySelector from "./CategorySelector";
import ImageUploader from "./ImageUploader";

interface ProductFormProps {
    initialProduct: Product;
    onSave: (product: Product) => void;
    loading: boolean;
}

export default function ProductForm({ initialProduct, onSave, loading }: ProductFormProps) {
    const [product, setProduct] = useState<Product>(initialProduct);
    const [activeTab, setActiveTab] = useState<'general' | 'media' | 'variants'>('general');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(product);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Tabs */}
            <div className="flex border-b border-white/10">
                <button
                    type="button"
                    onClick={() => setActiveTab('general')}
                    className={`px-6 py-3 text-sm font-bold uppercase tracking-wider ${activeTab === 'general' ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]' : 'text-gray-500 hover:text-white'}`}
                >
                    General
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('media')}
                    className={`px-6 py-3 text-sm font-bold uppercase tracking-wider ${activeTab === 'media' ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]' : 'text-gray-500 hover:text-white'}`}
                >
                    Media
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('variants')}
                    className={`px-6 py-3 text-sm font-bold uppercase tracking-wider ${activeTab === 'variants' ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]' : 'text-gray-500 hover:text-white'}`}
                >
                    Variants
                </button>
            </div>

            {/* General Tab */}
            {activeTab === 'general' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div>
                        <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Product Name</label>
                        <input
                            type="text"
                            value={product.name}
                            onChange={(e) => setProduct({ ...product, name: e.target.value })}
                            className="w-full bg-zinc-900 border border-white/10 p-4 rounded text-white focus:border-[#D4AF37] outline-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Base Price (Rs)</label>
                            <input
                                type="number"
                                value={product.price}
                                onChange={(e) => setProduct({ ...product, price: Number(e.target.value) })}
                                className="w-full bg-zinc-900 border border-white/10 p-4 rounded text-white focus:border-[#D4AF37] outline-none"
                            />
                        </div>
                        <CategorySelector
                            value={product.category}
                            onChange={(cat) => setProduct({ ...product, category: cat })}
                        />
                    </div>

                    <div>
                        <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Description</label>
                        <textarea
                            rows={6}
                            value={product.description || ""}
                            onChange={(e) => setProduct({ ...product, description: e.target.value })}
                            className="w-full bg-zinc-900 border border-white/10 p-4 rounded text-white focus:border-[#D4AF37] outline-none"
                        />
                    </div>
                </div>
            )}

            {/* Media Tab */}
            {activeTab === 'media' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <ImageUploader
                        images={product.images}
                        onChange={(imgs) => setProduct({ ...product, images: imgs })}
                    />
                </div>
            )}

            {/* Variants Tab */}
            {activeTab === 'variants' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <VariantEditor
                        variants={product.variants || []}
                        onChange={(vars) => setProduct({ ...product, variants: vars })}
                    />
                </div>
            )}

            <div className="pt-6 border-t border-white/10 flex justify-end">
                <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 bg-[#D4AF37] text-black font-bold uppercase tracking-widest hover:bg-[#F4CF57] disabled:opacity-50 transition-colors"
                >
                    {loading ? "Saving Draft..." : "Save Draft"}
                </button>
            </div>
        </form>
    );
}
