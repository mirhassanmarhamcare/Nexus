"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useUIStore } from "@/store/ui.store";
import { productsDB, Product } from "@/data/products";

gsap.registerPlugin(ScrollTrigger);

export default function FlashSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { openProduct } = useUIStore();

    const handleProductClick = (item: Product) => {
        openProduct({
            name: item.name,
            price: item.price,
            img: item.images[0],
            category: item.category
        });
    }

    const flashItems = productsDB.filter(p => p.isFlash).sort((a: Product, b: Product) => (a.priority || 0) - (b.priority || 0));
    const displayItems = flashItems.length > 0 ? flashItems : [];
    const loopedItems = [...displayItems, ...displayItems];

    return (
        <section ref={containerRef} className="flash-section container mx-auto px-0 md:px-0 max-w-full py-20 relative z-[5] overflow-hidden">
            <div className="section-header container mx-auto px-8 max-w-[1400px] flex flex-col md:flex-row justify-between items-end mb-16 border-b border-border pb-8 gap-4 md:items-start">
                <h2 className="section-title font-display text-foreground">Flash Archive</h2>
                <p className="section-subtitle text-muted text-[0.9rem] max-w-[300px] text-right md:text-left">Exclusive drops. Limited time. No restocks.</p>
            </div>

            <div className="flash-track-container w-full overflow-hidden flex">
                <div className="flash-track flex gap-4 md:gap-8 w-max px-4">
                    {loopedItems.map((item, i) => (
                        <div
                            key={i}
                            className="flash-card hoverable cursor-none min-w-[300px] max-w-[350px] relative group border border-border bg-card flex flex-col p-6"
                            onClick={() => handleProductClick(item)}
                        >
                            <div className="absolute top-4 left-4 z-20">
                                <span className={`px-2 py-0.5 text-[8px] font-black tracking-widest uppercase rounded-sm border ${item.inStock !== false ? 'bg-accent text-black border-accent' : 'bg-card text-muted border-border'}`}>
                                    {item.inStock !== false ? 'Flash Drop' : 'Sold Out'}
                                </span>
                            </div>
                            <div className="relative aspect-[4/5] w-full mb-6 overflow-hidden rounded-sm bg-accent/5">
                                <img
                                    src={item.images[0]}
                                    alt={item.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent p-6 opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
                                    <span className="text-[10px] text-white font-mono uppercase tracking-[0.3em]">View Archive Spec</span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 mt-auto">
                                <h3 className="font-display text-foreground text-lg uppercase tracking-tight line-clamp-1">
                                    {item.name}
                                </h3>
                                <div className="flex justify-between items-center border-t border-border pt-3 mt-1">
                                    <span className="text-accent text-sm font-mono">Rs. {item.price.toLocaleString()}</span>
                                    <span className="text-[8px] text-muted uppercase tracking-[0.2em]">{item.category}</span>
                                </div>
                            </div>
                        </div>
                    ))}


                    {loopedItems.length === 0 && (
                        <div className="py-24 text-center w-full">
                            <p className="text-[10px] text-gray-600 uppercase tracking-[0.5em] font-black animate-pulse italic">Awaiting Next Archive Drop...</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
