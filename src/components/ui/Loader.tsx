"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function Loader() {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const curtainRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const tl = gsap.timeline();

        // Initial State
        gsap.set(containerRef.current, { zIndex: 99999 });

        tl
            // 1. Text Entering/Breathing
            .from(textRef.current, {
                y: 50,
                opacity: 0,
                duration: 1,
                ease: "power3.out"
            })
            .to(textRef.current, {
                scale: 1.1,
                letterSpacing: "0.5em",
                duration: 1.5,
                ease: "power1.inOut"
            }, "-=0.5")

            // 2. Text Exit
            .to(textRef.current, {
                y: -50,
                opacity: 0,
                duration: 0.5,
                ease: "power2.in"
            })

            // 3. Curtain Wipe Up
            .to(curtainRef.current, {
                yPercent: -100,
                duration: 1.2,
                ease: "power4.inOut"
            })

            // 4. Cleanup
            .set(containerRef.current, { display: "none" });

    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="fixed inset-0 z-[99999] pointer-events-none">
            {/* Curtain (The visual blocker) */}
            <div
                ref={curtainRef}
                className="absolute inset-0 bg-[#000] z-20 flex items-center justify-center"
            >
                <div
                    ref={textRef}
                    className="font-display text-[3rem] md:text-[5rem] text-white tracking-[0.2em] uppercase"
                >
                    NEXUS
                </div>
            </div>
        </div>
    )
}
