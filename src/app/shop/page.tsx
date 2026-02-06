"use client";

import InnerPageLayout from "@/components/layout/InnerPageLayout";
import { productsDB } from "@/data/products";
import { useUIStore } from "@/store/ui.store";
import Image from "next/image";
import { useState, useMemo } from "react";
import MagneticButton from "@/components/ui/MagneticButton";

const CATEGORIES = [
    'All',
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

export default function ShopPage() {
    const { openProduct } = useUIStore();
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [visibleCount, setVisibleCount] = useState(10);

    const filteredProducts = useMemo(() => {
        if (selectedCategory === "All") return productsDB;
        return productsDB.filter(p => p.category === selectedCategory);
    }, [selectedCategory]);

    const displayProducts = filteredProducts.slice(0, visibleCount);
    const hasMore = visibleCount < filteredProducts.length;

    const handleCategoryChange = (cat: string) => {
        setSelectedCategory(cat);
        setVisibleCount(10); // Reset pagination
    };

    const handleLoadMore = () => {
        setVisibleCount(prev => prev + 10);
    };

    return (
        <InnerPageLayout title="The Collection">
            {/* Filter Bar */}
            <div className="mb-16 w-full flex justify-center">
                <div className="flex gap-8 overflow-x-auto pb-4 no-scrollbar max-w-full px-8 items-center">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => handleCategoryChange(cat)}
                            className={`group relative text-xs font-display uppercase tracking-[0.2em] transition-all duration-500 whitespace-nowrap py-2 ${selectedCategory === cat
                                ? "text-foreground font-medium"
                                : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            {cat}
                            <span className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent transition-all duration-500 ${selectedCategory === cat ? "opacity-100 scale-100" : "opacity-0 scale-0 group-hover:opacity-50 group-hover:scale-75"
                                }`} />
                        </button>
                    ))}
                </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-12 mb-16">
                {displayProducts.map((product) => (
                    <div key={product.id} className="group cursor-pointer" onClick={() => openProduct(product)}>
                        <div className="aspect-[3/4] overflow-hidden mb-4 relative bg-card">
                            <Image
                                src={product.img.startsWith('/') ? product.img : `/${product.img}`}
                                alt={product.name}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <span className="px-6 py-2 bg-white/10 backdrop-blur-md border border-white/20 uppercase text-xs tracking-widest text-white">View</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-display text-lg uppercase tracking-wide group-hover:text-accent transition-colors">{product.name}</h3>
                                <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">{product.category}</p>
                            </div>
                            <span className="font-mono text-sm opacity-60">${product.price}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
                <div className="flex justify-center">
                    <MagneticButton>
                        <button
                            onClick={handleLoadMore}
                            className="px-8 py-3 border border-white/20 hover:border-accent hover:bg-accent/10 hover:text-accent transition-all duration-500 rounded-sm text-sm uppercase tracking-[0.2em] backdrop-blur-sm"
                        >
                            Load More
                        </button>
                    </MagneticButton>
                </div>
            )}

            {/* Empty State */}
            {filteredProducts.length === 0 && (
                <div className="text-center py-20 text-muted-foreground">
                    <p>No products found in this category.</p>
                </div>
            )}
        </InnerPageLayout>
    );
}
