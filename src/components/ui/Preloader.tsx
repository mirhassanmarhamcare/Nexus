"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function Preloader() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [counter, setCounter] = useState(0);
    const [isVisible, setIsVisible] = useState(true);

    useGSAP(() => {
        const tl = gsap.timeline({
            onComplete: () => {
                setIsVisible(false);
                document.body.style.overflow = "";
            }
        });

        // 1. Initial State
        document.body.style.overflow = "hidden";

        // 2. Counter Animation
        const counterObj = { value: 0 };
        tl.to(counterObj, {
            value: 100,
            duration: 1.5,
            ease: "power2.inOut",
            onUpdate: () => setCounter(Math.round(counterObj.value))
        });

        // 3. The Split Reveal
        // Fade out text first
        tl.to([".preloader-content"], {
            opacity: 0,
            duration: 0.5,
            ease: "power2.in"
        })
            // Slide Top Up
            .to(".panel-top", {
                yPercent: -100,
                duration: 1.2,
                ease: "expo.inOut"
            }, "-=0.2")
            // Slide Bottom Down
            .to(".panel-bottom", {
                yPercent: 100,
                duration: 1.2,
                ease: "expo.inOut"
            }, "<") // Sync with top panel

            // 4. Hide Container
            .set(containerRef.current, { zIndex: -1 });

    }, { scope: containerRef });

    if (!isVisible) return null;

    return (
        <div ref={containerRef} className="fixed inset-0 z-[9999] flex flex-col items-center justify-center pointer-events-none">

            {/* Split Curtains */}
            <div className="panel-top absolute top-0 left-0 w-full h-[50vh] bg-[#050505] z-10 border-b border-white/10" />
            <div className="panel-bottom absolute bottom-0 left-0 w-full h-[50vh] bg-[#050505] z-10 border-t border-white/10" />

            {/* Content (Centered on top of curtains) */}
            <div className="preloader-content relative z-20 flex flex-col items-center gap-6">
                <h1 className="font-display text-6xl md:text-9xl text-white font-bold tracking-[0.2em] leading-none mix-blend-difference">
                    NEXUS
                </h1>

                <p className="text-white/50 text-sm font-mono tracking-widest mix-blend-difference">
                    {counter}%
                </p>
            </div>
        </div>
    );
}
