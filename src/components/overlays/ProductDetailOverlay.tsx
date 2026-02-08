"use client";

import { useUIStore } from "@/store/ui.store";
import { useCartStore } from "@/store/cart.store";
import { useToastStore } from "@/store/toast.store";
import { X, ArrowRight, Minus, Plus, CaretLeft, CaretRight } from "@phosphor-icons/react";
import { useLenis } from "@studio-freight/react-lenis";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Image from "next/image";

export default function ProductDetailOverlay() {
    const { activeProduct, closeProduct } = useUIStore();
    const { addToCart } = useCartStore();
    const { showToast } = useToastStore();
    const lenis = useLenis();
    const containerRef = useRef<HTMLDivElement>(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState("M");
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Reset image index when product opens
    useEffect(() => {
        if (activeProduct) {
            setCurrentImageIndex(0);
        }
    }, [activeProduct]);

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
            img: activeProduct.images?.[0] || activeProduct.img // Fallback for safety
        });
        showToast(`Added ${activeProduct.name} to Cart`);
        closeProduct();
    };

    const nextImage = () => {
        if (!activeProduct?.images) return;
        setCurrentImageIndex((prev) => (prev + 1) % activeProduct.images.length);
    };

    const prevImage = () => {
        if (!activeProduct?.images) return;
        setCurrentImageIndex((prev) => (prev - 1 + activeProduct.images.length) % activeProduct.images.length);
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
                    <div className="w-full md:w-1/2 h-[50vh] md:h-full bg-white relative overflow-hidden product-image-reveal group">
                        {activeProduct?.images && activeProduct.images.length > 0 ? (
                            <>
                                <Image
                                    src={activeProduct.images[currentImageIndex]}
                                    alt={activeProduct.name}
                                    fill
                                    className="object-contain p-12 md:p-24"
                                    priority
                                />
                                {activeProduct.images.length > 1 && (
                                    <>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); prevImage(); }}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/20 backdrop-blur-md border border-white/10 flex items-center justify-center rounded-full text-foreground hover:bg-accent hover:text-white transition-colors z-20"
                                        >
                                            <CaretLeft size={20} />
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); nextImage(); }}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/20 backdrop-blur-md border border-white/10 flex items-center justify-center rounded-full text-foreground hover:bg-accent hover:text-white transition-colors z-20"
                                        >
                                            <CaretRight size={20} />
                                        </button>
                                        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 z-20">
                                            {activeProduct.images.map((_: string, idx: number) => (
                                                <button
                                                    key={idx}
                                                    onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(idx); }}
                                                    className={`w-2 h-2 rounded-full transition-all ${idx === currentImageIndex ? 'bg-accent w-4' : 'bg-white/50 hover:bg-white'}`}
                                                />
                                            ))}
                                        </div>
                                    </>
                                )}
                            </>
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                                {/* Placeholder visual based on product img string */}
                                <span className="text-[10vw] md:text-[5vw] font-display text-foreground/10 uppercase tracking-widest text-center px-4">
                                    {activeProduct?.name || "NEXUS"}
                                </span>
                            </div>
                        )}

                        <div className="absolute top-8 left-8 z-10">
                            <span className="text-xs uppercase tracking-widest text-muted-foreground bg-background/50 backdrop-blur px-2 py-1 rounded">
                                {activeProduct?.productCode}
                            </span>
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
                                    Rs. {activeProduct?.price?.toLocaleString()}
                                </h3>
                            </div>

                            <div className="product-anim-item text-muted-foreground leading-relaxed max-w-md">
                                <p className="mb-4">
                                    {activeProduct?.description || "Meticulously engineered for the modern vanguard. This limited edition piece combines proprietary materials with artisanal craftsmanship."}
                                </p>

                                {/* Specifications Section */}
                                <div className="space-y-4 mt-8 pt-8 border-t border-white/5">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D4AF37]">Specifications</h4>
                                    <div className="grid grid-cols-1 gap-y-3">
                                        {activeProduct?.material && (
                                            <div className="flex gap-4">
                                                <span className="text-[9px] uppercase tracking-widest text-gray-500 w-24 shrink-0 font-mono">Composition:</span>
                                                <span className="text-xs text-white">{activeProduct.material}</span>
                                            </div>
                                        )}
                                        {activeProduct?.deliveryTime && (
                                            <div className="flex gap-4">
                                                <span className="text-[9px] uppercase tracking-widest text-gray-500 w-24 shrink-0 font-mono">Logistics:</span>
                                                <span className="text-xs text-white">{activeProduct.deliveryTime}</span>
                                            </div>
                                        )}
                                        {activeProduct?.careInstructions && (
                                            <div className="flex gap-4">
                                                <span className="text-[9px] uppercase tracking-widest text-gray-500 w-24 shrink-0 font-mono">Maintenance:</span>
                                                <span className="text-xs text-white leading-relaxed">{activeProduct.careInstructions}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {activeProduct?.details && (
                                    <div className="grid grid-cols-1 gap-y-2 text-sm mt-6 border-t border-white/10 pt-4">
                                        {Object.entries(activeProduct.details).map(([key, value]) => (
                                            <div key={key} className="flex gap-2">
                                                <span className="uppercase text-muted-foreground w-24 shrink-0 text-xs tracking-wider">{key}:</span>
                                                <span className="text-foreground">{value as string}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Options */}
                            <div className="space-y-6 product-anim-item">

                            </div>

                            {/* Actions */}
                            <div className="flex gap-4 pt-8 product-anim-item border-t border-white/10 mt-auto">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={activeProduct?.inStock === false}
                                    className={`flex-1 py-4 uppercase tracking-[0.3em] text-[10px] font-black transition-all cursor-none flex items-center justify-center gap-4 ${activeProduct?.inStock !== false
                                            ? "bg-foreground text-background hover:bg-accent hover:text-foreground"
                                            : "bg-zinc-800 text-gray-500 border border-white/5 cursor-not-allowed"
                                        }`}
                                >
                                    <span>{activeProduct?.inStock !== false ? "Commit to Cart" : "Sold Out"}</span>
                                    {activeProduct?.inStock !== false && <ArrowRight size={14} />}
                                </button>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
