"use client";

import { useState } from "react";
import { Product } from "@/data/products";
import VariantEditor from "./VariantEditor";
import CategorySelector from "./CategorySelector";
import ImageUploader from "./ImageUploader";
import { Cube, Image as ImageIcon, Stack, Info, RocketLaunch } from "@phosphor-icons/react";

interface ProductFormProps {
    initialProduct: Product;
    onSave: (product: Product) => void;
    loading: boolean;
}

export default function ProductForm({ initialProduct, onSave, loading }: ProductFormProps) {
    const [product, setProduct] = useState<Product>(initialProduct);
    const [activeTab, setActiveTab] = useState<'general' | 'media' | 'variants' | 'details' | 'drop'>('general');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(product);
    };

    const Tab = ({ id, label, icon: Icon }: { id: typeof activeTab, label: string, icon: any }) => (
        <button
            type="button"
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-3 px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${activeTab === id ? 'text-white' : 'text-gray-600 hover:text-gray-400'
                }`}
        >
            <Icon size={16} weight={activeTab === id ? "fill" : "bold"} className={activeTab === id ? "text-[#D4AF37]" : "text-gray-600"} />
            {label}
            {activeTab === id && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#D4AF37] shadow-[0_0_10px_#D4AF37]"></div>
            )}
        </button>
    );

    return (
        <form onSubmit={handleSubmit} className="space-y-12">
            {/* Tabs Navigation */}
            <div className="flex border-b border-white/5 overflow-x-auto no-scrollbar">
                <Tab id="general" label="Identity" icon={Cube} />
                <Tab id="media" label="Visuals" icon={ImageIcon} />
                <Tab id="variants" label="Archetypes" icon={Stack} />
                <Tab id="details" label="Manuscript" icon={Info} />
                <Tab id="drop" label="Orchestration" icon={RocketLaunch} />
            </div>

            {/* Identity (General) Tab */}
            {activeTab === 'general' && (
                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex flex-col lg:flex-row gap-12">
                        <div className="flex-1 space-y-8">
                            <div className="group">
                                <label className="block text-[10px] uppercase tracking-[0.3em] text-gray-600 mb-4 font-black group-focus-within:text-[#D4AF37] transition-colors">Nom de l'Article / Product Name</label>
                                <input
                                    type="text"
                                    value={product.name}
                                    onChange={(e) => setProduct({ ...product, name: e.target.value })}
                                    className="w-full bg-transparent border-b border-white/10 p-0 pb-4 text-3xl font-display text-white uppercase tracking-widest focus:border-[#D4AF37] transition-all outline-none"
                                    placeholder="Enter Product Name..."
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="group">
                                    <label className="block text-[9px] uppercase tracking-[0.2em] text-gray-500 mb-2 font-black">Base Valuation (Rs.)</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={product.price || ""}
                                            onChange={(e) => setProduct({ ...product, price: Number(e.target.value) })}
                                            className="w-full bg-zinc-900/50 border border-white/5 p-4 rounded-sm text-white font-mono text-sm focus:border-[#D4AF37]/50 outline-none transition-all"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>
                                <CategorySelector
                                    value={product.category}
                                    onChange={(cat) => setProduct({ ...product, category: cat })}
                                />
                            </div>
                        </div>

                        <div className="w-full lg:w-80 space-y-6">
                            <div className="bg-zinc-900/30 border border-white/5 p-6 rounded-sm">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">Live Availability</span>
                                    <button
                                        type="button"
                                        onClick={() => setProduct({ ...product, inStock: !product.inStock })}
                                        className={`w-10 h-5 rounded-full transition-all relative ${product.inStock !== false ? 'bg-[#D4AF37]' : 'bg-zinc-800'}`}
                                    >
                                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${product.inStock !== false ? 'left-6' : 'left-1'}`}></div>
                                    </button>
                                </div>
                                <p className="text-[8px] text-gray-600 uppercase tracking-widest leading-relaxed">
                                    {product.inStock !== false ? "This item is currently listed as available in the collection." : "This item is marked as Sold Out."}
                                </p>
                            </div>

                            <div className="bg-zinc-900/30 border border-[#D4AF37]/10 p-6 rounded-sm">
                                <label className="block text-[9px] uppercase tracking-widest text-[#D4AF37] mb-3 font-black">Display Priority</label>
                                <input
                                    type="number"
                                    value={product.priority ?? 0}
                                    onChange={(e) => setProduct({ ...product, priority: Number(e.target.value) })}
                                    className="w-full bg-transparent text-white font-display text-2xl outline-none"
                                />
                                <p className="text-[8px] text-gray-600 mt-2 uppercase tracking-wide italic">Higher values appear at the peak of the collection.</p>
                            </div>

                            <div className="bg-zinc-900/30 border border-white/5 p-6 rounded-sm space-y-4">
                                <div className="flex justify-between items-center group">
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black uppercase tracking-widest text-gray-500 group-hover:text-white transition-colors">Flash Archive</span>
                                        <span className="text-[7px] text-gray-700 uppercase">Limited Time Section</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setProduct({ ...product, isFlash: !product.isFlash })}
                                        className={`w-8 h-4 rounded-full transition-all relative ${product.isFlash ? 'bg-red-500' : 'bg-zinc-800'}`}
                                    >
                                        <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${product.isFlash ? 'left-4.5 translate-x-1' : 'left-0.5'}`}></div>
                                    </button>
                                </div>

                                <div className="flex justify-between items-center group">
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black uppercase tracking-widest text-gray-500 group-hover:text-white transition-colors">Top Seller</span>
                                        <span className="text-[7px] text-gray-700 uppercase">Home Showcase</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setProduct({ ...product, isTopSeller: !product.isTopSeller })}
                                        className={`w-8 h-4 rounded-full transition-all relative ${product.isTopSeller ? 'bg-[#D4AF37]' : 'bg-zinc-800'}`}
                                    >
                                        <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${product.isTopSeller ? 'left-4.5 translate-x-1' : 'left-0.5'}`}></div>
                                    </button>
                                </div>
                            </div>
                        </div>
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

            {/* Details (Manuscript) Tab */}
            {activeTab === 'details' && (
                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex flex-col lg:flex-row gap-12">
                        <div className="flex-1">
                            <label className="block text-[10px] uppercase tracking-[0.3em] text-gray-600 mb-4 font-black">Composition & Description</label>
                            <textarea
                                rows={10}
                                value={product.description || ""}
                                onChange={(e) => setProduct({ ...product, description: e.target.value })}
                                className="w-full bg-zinc-900/40 border border-white/5 p-8 rounded-sm text-white font-sans leading-relaxed tracking-wide text-lg outline-none focus:border-[#D4AF37]/30 transition-all no-scrollbar"
                                placeholder="Describe the soul of this product..."
                            />
                        </div>

                        <div className="w-full lg:w-96 space-y-8">
                            <div>
                                <label className="block text-[9px] uppercase tracking-[0.3em] text-[#D4AF37] mb-3 font-black underline underline-offset-8 decoration-[#D4AF37]/20">Material Constitution</label>
                                <input
                                    type="text"
                                    placeholder="e.g. 100% Organza Silk"
                                    value={product.material || ""}
                                    onChange={(e) => setProduct({ ...product, material: e.target.value })}
                                    className="w-full bg-transparent border-b border-white/10 p-2 text-white font-display uppercase tracking-widest text-sm outline-none focus:border-[#D4AF37]"
                                />
                            </div>

                            <div>
                                <label className="block text-[9px] uppercase tracking-[0.3em] text-gray-500 mb-3 font-black">Delivery Promise</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Express: 2-4 Days"
                                    value={product.deliveryTime || ""}
                                    onChange={(e) => setProduct({ ...product, deliveryTime: e.target.value })}
                                    className="w-full bg-transparent border-b border-white/10 p-2 text-white font-display uppercase tracking-widest text-sm outline-none focus:border-[#D4AF37]"
                                />
                            </div>

                            <div>
                                <label className="block text-[9px] uppercase tracking-[0.3em] text-gray-500 mb-3 font-black">Care Guidelines</label>
                                <textarea
                                    rows={4}
                                    placeholder="Preservation instructions..."
                                    value={product.careInstructions || ""}
                                    onChange={(e) => setProduct({ ...product, careInstructions: e.target.value })}
                                    className="w-full bg-zinc-900/30 border border-white/5 p-4 rounded-sm text-white font-mono text-[10px] uppercase tracking-wider outline-none focus:border-[#D4AF37]/30"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Drop Tab */}
            {activeTab === 'drop' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-[#D4AF37]/5 border border-[#D4AF37]/20 p-8 rounded-sm">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h3 className="text-lg font-display uppercase tracking-widest text-[#D4AF37] mb-2">Atelier Drop Mechanism</h3>
                                <p className="text-xs text-gray-500 uppercase tracking-wider leading-relaxed max-w-md">
                                    Scheduling a drop will hide this product from the main collection until the specified time.
                                    A countdown can be displayed on the product page to build anticipation.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setProduct({ ...product, isDrop: !product.isDrop })}
                                className={`w-14 h-7 rounded-full transition-all relative ${product.isDrop ? 'bg-[#D4AF37]' : 'bg-zinc-800'}`}
                            >
                                <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${product.isDrop ? 'left-8' : 'left-1'}`}></div>
                            </button>
                        </div>

                        {product.isDrop && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in zoom-in-95 duration-500">
                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-3">Release Date & Time</label>
                                    <input
                                        type="datetime-local"
                                        value={product.dropDate ? product.dropDate.substring(0, 16) : ""}
                                        onChange={(e) => setProduct({ ...product, dropDate: e.target.value })}
                                        className="w-full bg-zinc-900 border border-[#D4AF37]/30 p-4 rounded text-white focus:border-[#D4AF37] outline-none font-mono"
                                    />
                                </div>
                                <div className="bg-zinc-900/80 p-6 border border-white/5 rounded-sm">
                                    <label className="block text-[10px] uppercase tracking-widest text-gray-700 mb-4">Launch Preview</label>
                                    <div className="flex flex-col items-center justify-center py-4">
                                        {product.dropDate ? (
                                            <>
                                                <div className="text-2xl font-display text-white mb-2 uppercase tracking-tighter">
                                                    {new Date(product.dropDate).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                                                </div>
                                                <div className="text-xs text-[#D4AF37] font-mono">
                                                    AT {new Date(product.dropDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </>
                                        ) : (
                                            <div className="text-gray-600 text-[10px] uppercase font-black italic">Select Launch Time</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="pt-12 border-t border-white/5 flex justify-end">
                <button
                    type="submit"
                    disabled={loading}
                    className="group relative px-12 py-5 bg-[#D4AF37] text-black font-black uppercase tracking-[0.3em] text-[10px] overflow-hidden transition-all hover:pr-16 hover:bg-[#F4CF57] disabled:opacity-50"
                >
                    <span className="relative z-10">{loading ? "Synchronizing Archive..." : "Commit to Staging"}</span>
                    <div className="absolute right-0 top-0 h-full w-0 bg-black/10 transition-all group-hover:w-12 flex items-center justify-center">
                        &rarr;
                    </div>
                </button>
            </div>
        </form>
    );
}
