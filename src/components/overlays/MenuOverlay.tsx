"use client";

import { useUIStore } from "@/store/ui.store";
import { X, ArrowRight } from "@phosphor-icons/react";
import { useLenis } from "@studio-freight/react-lenis";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

// Define menu items with associated images
const MENU_ITEMS = [
    { label: "Shop", action: "shop", image: "/hero.jpg", desc: "Explore our latest arrivals" },
    { label: "Story", action: "story", image: "/hero.jpg", desc: "The legacy behind Nexus" }, // Using hero.jpg as placeholder
    { label: "Journal", action: "journal", image: "/hero.jpg", desc: "News and editorials" },
    { label: "Contact", action: "contact", image: "/hero.jpg", desc: "Get in touch with us" },
    { label: "Account", action: "account", image: "/hero.jpg", desc: "Manage your profile" },
];

export default function MenuOverlay() {
    const { isMenuOpen, toggleMenu, openPage, toggleAuth, closeAllOverlays } = useUIStore();
    const lenis = useLenis();
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeImage, setActiveImage] = useState(MENU_ITEMS[0].image);

    // Lock scroll when menu is open
    useEffect(() => {
        if (lenis) {
            if (isMenuOpen) lenis.stop();
            else lenis.start();
        }
        return () => {
            if (lenis) lenis.start();
        };
    }, [isMenuOpen, lenis]);


    useGSAP(() => {
        if (isMenuOpen) {
            // Reset state
            gsap.set(".menu-link-item", { y: 100, opacity: 0 });
            gsap.set(".menu-divider", { scaleX: 0 });
            gsap.set(".menu-image-container", { clipPath: "inset(0 100% 0 0)" });

            // Animate In
            const tl = gsap.timeline();

            tl.to(".menu-image-container", {
                clipPath: "inset(0 0% 0 0)",
                duration: 1,
                ease: "power4.inOut"
            })
                .to(".menu-link-item", {
                    y: 0,
                    opacity: 1,
                    stagger: 0.1,
                    duration: 0.8,
                    ease: "power3.out"
                }, "-=0.5")
                .to(".menu-divider", {
                    scaleX: 1,
                    duration: 0.8,
                    ease: "power2.out"
                }, "-=0.8");

        }
    }, { scope: containerRef, dependencies: [isMenuOpen] });

    const handleLinkHover = (image: string) => {
        if (image !== activeImage) {
            // Simple crossfade logic could go here, or just state switch for now
            setActiveImage(image);
        }
    };

    const router = useRouter();

    const handleLinkClick = (action: string) => {
        closeAllOverlays(); // Close everything for a clean transition
        if (action === "account") {
            toggleAuth();
        } else {
            router.push(`/${action}`);
        }
    };

    return (
        <div
            ref={containerRef}
            id="menu-overlay"
            className={`fixed inset-0 z-[9999] flex ${isMenuOpen ? "pointer-events-auto visible" : "pointer-events-none invisible transition-[visibility] delay-1000"
                }`}
        >
            {/* Backdrop / Overlay logic */}
            {/* We transform the whole container or specific panels. 
                Let's slide the container down or fade it. 
                Gucci often does a full overlay. */}

            <div
                className={`absolute inset-0 bg-background transition-transform duration-[1s] ease-[cubic-bezier(0.77,0,0.175,1)] ${isMenuOpen ? "translate-y-0" : "-translate-y-full"
                    }`}
            >
                <div className="w-full h-full flex flex-col md:flex-row">

                    {/* LEFT COLUMN: NAVIGATION */}
                    <div className="w-full md:w-1/2 h-full p-4 md:p-16 flex flex-col justify-between relative z-10">
                        {/* Header */}
                        <div className="flex justify-between items-center">
                            <h2 className="font-display text-2xl tracking-widest">NEXUS</h2>
                            <button
                                onClick={toggleMenu}
                                className="group flex items-center gap-2 text-sm uppercase tracking-widest hover:text-accent transition-colors"
                            >
                                <span>Close</span>
                                <div className="relative w-8 h-8 flex items-center justify-center border border-foreground/20 rounded-full group-hover:border-accent transition-colors">
                                    <X size={16} />
                                </div>
                            </button>
                        </div>

                        {/* Links */}
                        <div className="flex flex-col gap-4 md:gap-6 mt-8 md:mt-0">
                            {MENU_ITEMS.map((item, index) => (
                                <div
                                    key={index}
                                    className="menu-link-item group relative cursor-pointer"
                                    onMouseEnter={() => handleLinkHover(item.image)}
                                    onClick={() => handleLinkClick(item.action)}
                                >
                                    <div className="flex items-baseline gap-4 overflow-hidden">
                                        <span className="text-xs text-muted-foreground font-mono">0{index + 1}</span>
                                        <h3 className="font-display text-[clamp(2rem,10vw,5rem)] leading-[0.9] text-foreground group-hover:text-accent transition-colors duration-300">
                                            {item.label}
                                        </h3>
                                    </div>
                                    <p className="text-sm text-muted-foreground ml-10 overflow-hidden h-0 group-hover:h-auto opacity-0 group-hover:opacity-100 transition-all duration-300">
                                        {item.desc}
                                    </p>
                                    <div className="menu-divider w-full h-[1px] bg-foreground/10 mt-2 md:mt-4 origin-left transform scale-x-0 group-hover:bg-accent/50 transition-colors" />
                                </div>
                            ))}
                        </div>

                        {/* Footer Info */}
                        <div className="menu-link-item flex gap-8 text-xs uppercase tracking-widest text-muted-foreground">
                            <span>Instagram</span>
                            <span>Twitter</span>
                            <span>Facebook</span>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: IMAGERY (Desktop Only) */}
                    <div className="hidden md:block w-1/2 h-full bg-[#1a1a1a] relative overflow-hidden menu-image-container">
                        {/* We can map all images and fade between them to avoid flicker */}
                        {MENU_ITEMS.map((item, idx) => (
                            <div
                                key={idx}
                                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${activeImage === item.image && isMenuOpen ? "opacity-60" : "opacity-0"
                                    }`}
                            >
                                <img
                                    src={item.image}
                                    alt={item.label}
                                    className="w-full h-full object-cover scale-105"
                                />
                            </div>
                        ))}

                        {/* Decorative text on image */}
                        <div className="absolute bottom-16 left-16 text-white max-w-sm">
                            <p className="font-display text-4xl mb-4 italic">
                                "{MENU_ITEMS.find(i => i.image === activeImage)?.desc || 'Elevate your lifestyle'}"
                            </p>
                            <div className="flex items-center gap-4 text-sm uppercase tracking-widest">
                                <span>Discover</span>
                                <ArrowRight />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
