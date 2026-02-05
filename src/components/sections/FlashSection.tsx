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

    const items = [
        { name: 'Sonic Pro', price: 299, badge: '-30% OFF', img: 'Sonic Pro' },
        { name: 'Nexus Watch', price: 199, badge: '-40% OFF', img: 'Nexus Watch', realName: 'Series 5 Watch' },
        { name: 'Alpha Lens', price: 1200, badge: 'LIMITED', img: 'Alpha Cam' },
        { name: 'Hammershoi', price: 85, badge: 'RARE', img: 'Ceramic Vase' },
        { name: 'Lunar Pods', price: 150, badge: 'NEW', img: 'Lunar Pods' },
        { name: 'Stealth Cam', price: 899, badge: 'HOT', img: 'Stealth Cam' },
        { name: 'Vortex Drone', price: 450, badge: '-15% OFF', img: 'Vortex Drone' },
        { name: 'Echo Smart', price: 99, badge: 'DEAL', img: 'Echo Smart' },
        { name: 'Fusion Tab', price: 600, badge: '-20% OFF', img: 'Fusion Tab' },
        { name: 'Nova Speaker', price: 220, badge: 'POPULAR', img: 'Nova Speaker' },
        { name: 'Zenith Hub', price: 120, badge: 'SALE', img: 'Zenith Hub' },
        { name: 'Quantum Key', price: 180, badge: 'LIMITED', img: 'Quantum Key' },
    ];

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
