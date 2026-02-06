"use client";

import { useRef } from "react";
import { useUIStore } from "@/store/ui.store";
import MagneticButton from "@/components/ui/MagneticButton";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { openPage } = useUIStore();

    useGSAP(() => {
        const logo = document.getElementById("dynamic-logo");
        const logoDest = document.getElementById("logo-dest");
        const navbar = document.getElementById("navbar");

        if (!logo || !logoDest || !navbar) return;

        // Function to recalculate and set up the animation
        const setupAnimation = () => {
            // Get current dimensions
            const destRect = logoDest.getBoundingClientRect();
            // Since Navbar is fixed, destRect is viewport relative.
            // dynamic-logo is fixed, centered at 50% 50% with translate(-50%, -50%).

            const startX = window.innerWidth / 2;
            const startY = window.innerHeight / 2;

            const destX = destRect.left + destRect.width / 2;
            const destY = destRect.top + destRect.height / 2;

            // Calculate deltas
            const shiftX = destX - startX;
            const shiftY = destY - startY;

            // DYNAMIC SCALE CALCULATION
            // 1. Get dimensions
            const startWidth = logo.offsetWidth;
            const destWidth = destRect.width;

            // 2. Calculate the scale needed to fit the width (contain)
            // If the startWidth is huge (desktop), destWidth might be 120px.
            // If startWidth is small (mobile), destWidth is still 120px usually.
            const fitScale = startWidth > 0 ? destWidth / startWidth : 0.15;

            // 3. Optional: Check height constraint too if needed
            // const startHeight = logo.offsetHeight;
            // const destHeight = destRect.height;
            // const heightScale = startHeight > 0 ? destHeight / startHeight : 0.15;
            // const finalScale = Math.min(fitScale, heightScale);

            // Using just width fit usually looks best for text logos to fill the slot.
            const finalScale = fitScale;

            // Kill old sizing/positioning if any (reset)
            gsap.killTweensOf(logo);
            gsap.set(logo, { clearProps: "all" });

            // CRITICAL: Remove CSS transitions that conflict with GSAP usage
            // The "transition: all" or "transition: color" in CSS causes lag when GSAP scrubs.
            gsap.set([logo, navbar], { transition: "none" });

            const timeline = gsap.timeline({
                scrollTrigger: {
                    trigger: "body",
                    start: "top top",
                    end: "300px top", // Extended scroll distance for smoother transition
                    scrub: 1.5, // "Liquid" feel - higher value = more smoothing/lag
                }
            });

            // Animate Logo
            timeline.fromTo(logo,
                {
                    x: 0,
                    y: 0,
                    scale: 1,
                    opacity: 1,
                    color: "#ffffff" // Start white
                },
                {
                    x: shiftX,
                    y: shiftY,
                    scale: finalScale,
                    color: "var(--nav-text-scrolled)", // Animate color to navbar theme
                    ease: "power2.inOut", // Silky smooth ease
                    duration: 1
                },
                0
            );

            // Animate Navbar Background & Shadow smoothly
            timeline.fromTo(navbar,
                {
                    backgroundColor: "transparent",
                    backdropFilter: "blur(0px)",
                    boxShadow: "0 0 0 rgba(0,0,0,0)"
                },
                {
                    backgroundColor: "var(--nav-bg-scrolled)",
                    backdropFilter: "blur(12px)",
                    boxShadow: "0 5px 20px rgba(0, 0, 0, 0.1)",
                    ease: "power1.out",
                    duration: 1
                },
                0
            );
        };

        // Initial setup
        setupAnimation();

        // Handle Resize
        const handleResize = () => {
            // Debounce or just re-run
            // Actually ScrollTrigger handles resize usually, but we need to re-calc coordinates.
            // GSAP's invalidateOnRefresh might help if we used functional values, 
            // but let's just re-run setup for absolute robustness on heavy layout changes.
            ScrollTrigger.refresh();
            setupAnimation();
        };

        window.addEventListener("resize", handleResize);

        // Cleanup
        return () => {
            window.removeEventListener("resize", handleResize);
        };

    }, { scope: containerRef });

    useGSAP(() => {
        // Scroll Indicator Entrance
        gsap.to(".scroll-indicator", {
            opacity: 0.5,
            y: -10,
            repeat: -1,
            yoyo: true,
            duration: 1.5,
            delay: 1 // Wait a bit
        });

        // Scroll Indicator Exit
        gsap.to(".scroll-indicator", {
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "20% top",
                scrub: true,
            },
            opacity: 0,
        });

        // HERO BUTTONS ANIMATION
        // 1. Entrance (Fade in + Slide up)
        gsap.from(".hero-btn-group", {
            y: 30,
            autoAlpha: 0, // handles opacity + visibility
            duration: 1.5,
            ease: "power3.out",
            delay: 0.5
        });

        // 2. Exit on Scroll (Fade out quickly)
        // Use fromTo to strictly define the START state (visible) and END state (hidden)
        // attached to the scroll scrubbing.
        gsap.fromTo(".hero-btn-group",
            {
                autoAlpha: 1, // Start fully visible
                y: 0,
                pointerEvents: "auto"
            },
            {
                scrollTrigger: {
                    trigger: "body",
                    start: "top top",
                    end: "100px top", // Fade out quickly
                    scrub: true,
                    // toggleActions: "play none none reverse" // Alternative if scrub feels loose
                },
                autoAlpha: 0, // opacity 0 + visibility hidden
                y: -20,
                immediateRender: false, // Do not override the entrance starting values immediately
                overwrite: "auto" // Prevent conflicts
            }
        );

    }, { scope: containerRef });

    return (
        <>
            <h1 id="dynamic-logo">NEXUS</h1>
            <section ref={containerRef} id="hero-sec" className="hero h-screen relative z-[1]">
                <div className="absolute inset-0 z-[-1]">
                    <img
                        src="/hero.jpg"
                        alt="Hero Background"
                        className="w-full h-full object-cover opacity-60"
                    />
                </div>

                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
                    <Link href="/shop" className="group">
                        <span className="font-display text-white text-xs uppercase tracking-[0.3em] group-hover:tracking-[0.5em] transition-all duration-700">Explore Collection</span>
                    </Link>
                    <div className="w-[1px] h-12 bg-white/30 mt-4 overflow-hidden">
                        <div className="w-full h-full bg-white animate-scroll-down"></div>
                    </div>
                </div>
            </section >
        </>
    );
}
