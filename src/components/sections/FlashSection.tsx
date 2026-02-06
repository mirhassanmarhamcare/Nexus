"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useToastStore } from "@/store/toast.store";
import { useUIStore } from "@/store/ui.store";

gsap.registerPlugin(ScrollTrigger);

export default function FlashSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { openProduct } = useUIStore(); // Remove useCartStore/useToastStore usage if not needed elsewhere, but let's keep it clean
    // but I can't easily see imports to remove them without more context or larger replace.
    // I will just update the handler.

    const handleProductClick = (item: any) => {
        openProduct({
            name: item.name,
            realName: item.realName,
            price: item.price,
            img: item.img,
            category: "Flash Drop" // Default category for flash items
        });
    }

    const items = Array(10).fill({
        name: 'Mock Data',
        price: 0,
        badge: 'MOCK',
        img: 'Mock Data'
    });

    // Double items for seamless loop
    const loopedItems = [...items, ...items];

    return (
        <section ref={containerRef} className="flash-section container mx-auto px-0 md:px-0 max-w-full py-20 relative z-[5] overflow-hidden">
            <div className="section-header container mx-auto px-8 max-w-[1400px] flex flex-col md:flex-row justify-between items-end mb-16 border-b border-white/10 pb-8 gap-4 md:items-start">
                <h2 className="section-title font-display text-foreground">Flash Archive</h2>
                <p className="section-subtitle text-muted text-[0.9rem] max-w-[300px] text-right md:text-left">Exclusive drops. Limited time. No restocks.</p>
            </div>

            <div className="flash-track-container w-full overflow-hidden flex">
                <div className="flash-track flex gap-4 md:gap-8 w-max px-4">
                    {loopedItems.map((item, i) => (
                        <div
                            key={i}
                            className="flash-card hoverable cursor-none min-w-[60vw] md:min-w-[300px]"
                            onClick={() => handleProductClick(item)}
                        >
                            <span className="flash-badge">
                                {item.badge}
                            </span>
                            <div className="img-placeholder flash-img-area group bg-accent/5 aspect-[4/5] rounded-sm flex items-center justify-center relative overflow-hidden">
                                <span className="opacity-50 font-mono tracking-widest uppercase text-xs">{item.img}</span>
                            </div>
                            <div className="flash-meta mt-4">
                                <div className="flex justify-between items-baseline">
                                    <h3 className="flash-title font-medium text-lg">
                                        {item.realName || item.name}
                                    </h3>
                                    <span className="flash-price font-bold">${item.price}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
