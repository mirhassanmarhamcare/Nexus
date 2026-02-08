"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { productsDB, Product } from "@/data/products";
import { useUIStore } from "@/store/ui.store";

gsap.registerPlugin(ScrollTrigger);

export default function TopSellersSection() {
    const containerRef = useRef<HTMLElement>(null);
    const { openProduct } = useUIStore();

    useGSAP(() => {
        gsap.from(".seller-card", {
            y: 60,
            opacity: 0,
            duration: 1,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 70%",
                toggleActions: "play reverse play reverse"
            }
        });
    }, { scope: containerRef });

    const topSellers = productsDB.filter(p => p.isTopSeller).slice(0, 4);

    return (
        <section ref={containerRef} className="top-sellers-section py-20 bg-background relative z-[5]">
            <div className="container mx-auto px-4 max-w-[1600px]">
                <div className="mb-16 text-center">
                    <h2 className="text-3xl md:text-5xl font-display font-medium tracking-tight uppercase">Top Sellers</h2>
                    <p className="text-[10px] text-gray-500 uppercase tracking-[0.4em] mt-4 font-black">Performance & Heritage Collection</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {topSellers.map((item, i) => (
                        <div
                            key={item.id}
                            className="seller-card group cursor-pointer"
                            onClick={() => openProduct({
                                name: item.name,
                                price: item.price,
                                img: item.images[0],
                                category: item.category
                            })}
                        >
                            <div className="aspect-[3/4] bg-card overflow-hidden mb-6 relative border border-border group-hover:border-accent/30 transition-all duration-500">
                                <img
                                    src={item.images[0]}
                                    alt={item.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-60 group-hover:opacity-100"
                                />
                                <div className="absolute top-4 right-4 bg-accent text-black text-[8px] font-black px-2 py-0.5 rounded-sm uppercase tracking-widest shadow-xl">
                                    Best Seller
                                </div>
                                <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-[10px] text-white font-mono uppercase tracking-[0.2em]">Explore Product</span>
                                </div>
                            </div>

                            <div className="text-center space-y-1">
                                <h3 className="text-xs md:text-sm font-display uppercase tracking-widest text-muted group-hover:text-foreground transition-colors truncate">
                                    {item.name}
                                </h3>
                                <p className="text-accent text-xs font-mono">Rs. {item.price.toLocaleString()}</p>
                            </div>
                        </div>
                    ))}
                    {topSellers.length === 0 && (
                        <div className="col-span-full py-20 text-center border border-dashed border-white/5 rounded-sm">
                            <p className="text-[10px] text-gray-700 uppercase tracking-widest italic">Inventory vitality check in progress...</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
