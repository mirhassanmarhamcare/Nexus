"use client";

import { useUIStore } from "@/store/ui.store";
import { useCartStore } from "@/store/cart.store";
import { useToastStore } from "@/store/toast.store";
import { X, ArrowRight, Minus, Plus } from "@phosphor-icons/react";
import { useLenis } from "@studio-freight/react-lenis";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function ProductDetailOverlay() {
    const { activeProduct, closeProduct } = useUIStore();
    const { addToCart } = useCartStore();
    const { showToast } = useToastStore();
    const lenis = useLenis();
    const containerRef = useRef<HTMLDivElement>(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState("M");

    // Lock scroll when overlay is open
    useEffect(() => {
        if (lenis) {
            if (activeProduct) lenis.stop();
            else lenis.start();
        }
        return () => {
            if (lenis) lenis.start();
        };
    }, [activeProduct, lenis]);


    useGSAP(() => {
        if (activeProduct) {
            // Reset state
            gsap.set(".product-anim-item", { y: 50, opacity: 0 });
            gsap.set(".product-image-reveal", { clipPath: "inset(0 0 100% 0)" });

            // Animate In
            const tl = gsap.timeline();

            tl.to(".product-image-reveal", {
                clipPath: "inset(0 0 0% 0)",
                duration: 1,
                ease: "power4.inOut"
            })
                .to(".product-anim-item", {
                    y: 0,
                    opacity: 1,
                    stagger: 0.1,
                    duration: 0.8,
                    ease: "power3.out"
                }, "-=0.5");

        }
    }, { scope: containerRef, dependencies: [activeProduct] });

    const handleAddToCart = () => {
        if (!activeProduct) return;
        addToCart({
            name: activeProduct.realName || activeProduct.name,
            price: activeProduct.price,
            img: activeProduct.img
        }); // Note: Quantity logic would need cart store update, defaulting to 1 for now or adding multiple
        showToast(`Added ${activeProduct.name} to Cart`);
        closeProduct();
    };

    return (
        <div
            ref={containerRef}
            id="product-overlay"
            className={`fixed inset-0 z-[10000] flex ${activeProduct ? "pointer-events-auto" : "pointer-events-none"}`}
        >
            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-background transition-transform duration-[1s] ease-[cubic-bezier(0.77,0,0.175,1)] ${activeProduct ? "translate-y-0" : "translate-y-full"}`}
            >
                <div className="w-full h-full flex flex-col md:flex-row">

                    {/* LEFT COLUMN: IMAGE */}
                    <div className="w-full md:w-1/2 h-[50vh] md:h-full bg-accent/5 relative overflow-hidden product-image-reveal">
                        <div className="absolute inset-0 flex items-center justify-center">
                            {/* Placeholder visual based on product img string */}
                            <span className="text-[10vw] md:text-[5vw] font-display text-foreground/10 uppercase tracking-widest text-center px-4">
                                {activeProduct?.name || "NEXUS"}
                            </span>

                        </div>
                        <div className="absolute bottom-8 left-8">
                            <span className="text-xs uppercase tracking-widest text-muted-foreground">Detailed View</span>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: INFO */}
                    <div className="w-full md:w-1/2 h-[50vh] md:h-full p-8 md:p-16 flex flex-col justify-between relative z-10 overflow-y-auto">
                        {/* Header */}
                        <div className="flex justify-end items-center product-anim-item">
                            <button
                                onClick={closeProduct}
                                className="group flex items-center gap-2 text-sm uppercase tracking-widest hover:text-accent transition-colors cursor-none"
                            >
                                <span>Close</span>
                                <div className="relative w-8 h-8 flex items-center justify-center border border-foreground/20 rounded-full group-hover:border-accent transition-colors">
                                    <X size={16} />
                                </div>
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex flex-col gap-8 mt-8 md:mt-0">
                            <div>
                                <span className="text-accent text-sm uppercase tracking-widest mb-2 block product-anim-item">{activeProduct?.category || "Exclusive"}</span>
                                <h2 className="font-display text-[2.5rem] md:text-[4rem] leading-[1] text-foreground mb-4 product-anim-item">
                                    {activeProduct?.realName || activeProduct?.name}
                                </h2>
                                <h3 className="text-xl md:text-2xl text-muted-foreground product-anim-item">
                                    ${activeProduct?.price}
                                </h3>
                            </div>

                            <p className="text-muted-foreground leading-relaxed max-w-md product-anim-item">
                                Meticulously engineered for the modern vanguard. This limited edition piece combines proprietary materials with artisanal craftsmanship.
                            </p>

                            {/* Options */}
                            <div className="space-y-6 product-anim-item">
                                <div>
                                    <label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">Size</label>
                                    <div className="flex gap-2">
                                        {['S', 'M', 'L', 'XL'].map(size => (
                                            <button
                                                key={size}
                                                onClick={() => setSelectedSize(size)}
                                                className={`w-10 h-10 border flex items-center justify-center text-sm transition-colors hover:border-accent cursor-none ${selectedSize === size ? 'border-accent bg-accent text-background' : 'border-white/20'}`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-4 pt-8 product-anim-item border-t border-white/10 mt-auto">
                                <button
                                    onClick={handleAddToCart}
                                    className="flex-1 bg-foreground text-background py-4 uppercase tracking-widest text-sm hover:bg-accent hover:text-foreground transition-colors cursor-none flex items-center justify-center gap-2"
                                >
                                    <span>Add to Cart</span>
                                    <ArrowRight size={16} />
                                </button>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
