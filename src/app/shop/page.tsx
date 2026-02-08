"use client";

import InnerPageLayout from "@/components/layout/InnerPageLayout";
import { productsDB } from "@/data/products";
import { useUIStore } from "@/store/ui.store";
import Image from "next/image";
import { useState, useMemo } from "react";
import MagneticButton from "@/components/ui/MagneticButton";

import categoriesData from "@/data/categories.json";

const CATEGORIES = categoriesData
    .sort((a, b) => a.order - b.order)
    .map(c => c.name);

export default function ShopPage() {
    const { openProduct } = useUIStore();
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [visibleCount, setVisibleCount] = useState(10);

    const filteredProducts = useMemo(() => {
        const now = new Date();
        const available = productsDB.filter(p => !p.isDrop || (p.dropDate && new Date(p.dropDate) <= now));

        if (selectedCategory === "All") return available;
        return available.filter(p => p.category === selectedCategory);
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-8 mb-16">
                {displayProducts.map((product) => (
                    <div key={product.id} className="group cursor-pointer" onClick={() => openProduct(product)}>
                        <div className="aspect-square overflow-hidden mb-2 relative bg-white rounded-lg">
                            <Image
                                src={product.images[0].startsWith('/') ? product.images[0] : `/${product.images[0]}`}
                                alt={product.name}
                                fill
                                className={`object-cover object-center transition-all duration-700 ease-in-out ${product.images.length > 1 ? "group-hover:opacity-0" : "group-hover:scale-110"}`}
                            />
                            {product.images.length > 1 && (
                                <Image
                                    src={product.images[1].startsWith('/') ? product.images[1] : `/${product.images[1]}`}
                                    alt={product.name}
                                    fill
                                    className="object-cover object-center absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700 ease-in-out scale-105"
                                />
                            )}

                            {/* Overlay - Keeping it minimal */}
                            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                        </div>
                        <div className="flex flex-col items-start gap-1">
                            <span className="font-semibold text-base">Rs. {product.price.toLocaleString()}</span>
                            <h3 className="font-sans text-sm text-white/70 line-clamp-1 overflow-hidden text-ellipsis w-full" title={product.name}>{product.name}</h3>
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
