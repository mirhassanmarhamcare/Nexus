"use client";

import { useRef } from "react";
import { useUIStore } from "@/store/ui.store";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const logo = document.getElementById("dynamic-logo");
        const logoDest = document.getElementById("logo-dest");
        const navbar = document.getElementById("navbar");

        if (!logo || !logoDest || !navbar) return;

        const setupAnimation = () => {
            // Kill existing GSAP animations on these elements
            gsap.killTweensOf(logo);
            gsap.killTweensOf(navbar);

            // Calculate destination relative to viewport
            const destRect = logoDest.getBoundingClientRect();

            // Initial position is centered by CSS (logo-container-fixed)
            // So start coordinates are effectively (0, 0) relative to its centered container
            const startX = window.innerWidth / 2;
            const startY = window.innerHeight / 2;

            const destX = destRect.left + destRect.width / 2;
            const destY = destRect.top + destRect.height / 2;

            const shiftX = destX - startX;
            const shiftY = destY - startY;

            // Scale calculations
            const startWidth = logo.offsetWidth;
            const destWidth = destRect.width;
            const finalScale = startWidth > 0 ? (destWidth / startWidth) * 0.95 : 0.12;

            // RESET STATE
            gsap.set(logo, { x: 0, y: 0, scale: 1, opacity: 1, color: "#ffffff" });
            gsap.set(navbar, { backgroundColor: "transparent", backdropFilter: "blur(0px)", borderBottom: "1px solid rgba(255,255,255,0)" });

            // Create ScrollTimeline
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: "body",
                    start: "top top",
                    end: "400px top",
                    scrub: 1.2,
                    invalidateOnRefresh: true
                }
            });

            tl.to(logo, {
                x: shiftX,
                y: shiftY,
                scale: finalScale,
                color: "#ffffff",
                ease: "power2.inOut",
                duration: 1
            }, 0);

            tl.to(navbar, {
                backgroundColor: "rgba(0,0,0,0.85)",
                backdropFilter: "blur(25px)",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
                duration: 1,
                ease: "none"
            }, 0);
        };

        // Run setup
        setupAnimation();

        // Re-calculate on resize
        const handleResize = () => {
            ScrollTrigger.refresh();
            setupAnimation();
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);

    }, { scope: containerRef });

    useGSAP(() => {
        // Floating effects
        gsap.to(".hero-scroll-bar", {
            y: 30,
            repeat: -1,
            yoyo: true,
            duration: 2,
            ease: "sine.inOut"
        });

        // Entrance animation for bottom elements
        gsap.from(".hero-footer", {
            y: 50,
            opacity: 0,
            duration: 1.5,
            ease: "power4.out",
            delay: 0.5
        });
    }, { scope: containerRef });

    return (
        <>
            <div className="logo-container-fixed">
                <h1 id="dynamic-logo">NEXUS</h1>
            </div>

            <section ref={containerRef} id="hero-sec" className="hero relative z-[1] overflow-hidden">
                <div className="absolute inset-0 z-[-1]">
                    <img
                        src="/hero.jpg"
                        alt="Background"
                        className="w-full h-full object-cover opacity-60"
                    />
                </div>

                <div className="hero-footer absolute bottom-12 left-0 w-full flex flex-col items-center gap-6 z-10">
                    <Link href="/shop" className="group flex flex-col items-center gap-4">
                        <span className="font-display text-white text-[10px] uppercase tracking-[0.5em] group-hover:tracking-[0.7em] transition-all duration-700">Explore Collection</span>
                        <div className="w-[1px] h-20 bg-white/20 relative overflow-hidden">
                            <div className="hero-scroll-bar absolute top-0 left-0 w-full h-1/2 bg-white/60"></div>
                        </div>
                    </Link>
                </div>
            </section>
        </>
    );
}
