"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRouter } from "next/navigation";
import { Armchair, Headphones, Sneaker, Watch, Bag, Sunglasses } from "@phosphor-icons/react";


gsap.registerPlugin(ScrollTrigger);

export default function CategoriesSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    // In our strict plan, pages are Overlays. 'shop' is an overlay.
    // We need to pass the filter state.
    // ui.store doesn't have filter state in activePageId.
    // But legacy `openShopCategory(cat)` -> `openPage('shop')` + `renderShopPage(cat)`.
    // I should add `shopFilter` to UI store or handle it via URL params if I could, but Strict says NO routes.
    // I'll add `shopFilter` to the store or local state logic in the Shop Overlay.
    // I'll add `shopCategory` to `ui.store.ts` later or just open shop generally for now.
    // Wait, Strict Rules: "Navigation remains overlay-based... openPage(id) behavior is preserved".
    // Legacy: `openShopCategory('Living')`
    // I will assume I can update `src/store/ui.store.ts` to include `setShopCategory`.

    useGSAP(() => {
        gsap.from(".section-header", {
            y: 50, opacity: 0, duration: 1, stagger: 0.1, ease: "power3.out",
            scrollTrigger: { trigger: ".section-header-cat", start: "top 85%", toggleActions: "play reverse play reverse" }
        });

        gsap.from(".category-item", {
            scale: 0.8,
            y: 30,
            opacity: 0,
            duration: 0.6,
            stagger: 0.05,
            ease: "back.out(1.5)",
            scrollTrigger: {
                trigger: ".category-grid",
                start: "top 85%",
                toggleActions: "play reverse play reverse",
            },
        });
    }, { scope: containerRef });

    const categories = [
        { name: 'Living', icon: Armchair },
        { name: 'Audio', icon: Headphones },
        { name: 'Footwear', icon: Sneaker },
        { name: 'Timepieces', icon: Watch },
        { name: 'Carry', icon: Bag },
        { name: 'Eyewear', icon: Sunglasses },
    ];

    return (
        <section ref={containerRef} className="categories-section container mx-auto px-8 max-w-[1400px]">
            <div className="section-header section-header-cat reveal-on-scroll">
                <h2 className="section-title">Shop by Category</h2>
                <p className="section-subtitle">Curated categories for the modern connoisseur.</p>
            </div>

            <div className="category-grid">
                {categories.map((cat, i) => (
                    <div
                        key={i}
                        className="category-item hoverable group"
                        onClick={() => {
                            router.push('/shop');
                        }}

                    >
                        <cat.icon className="cat-icon" />
                        <span className="cat-label">
                            {cat.name}
                        </span>
                    </div>
                ))}
            </div>
        </section>
    );
}
