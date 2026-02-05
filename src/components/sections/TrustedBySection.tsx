"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

export default function TrustedBySection() {
    const containerRef = useRef<HTMLDivElement>(null);

    // Mock Logos (Text for now to avoid broken SVGs, styled to look like logos)
    const brands = [
        "VOGUE", "WIRED", "HYPEBEAST", "MONOCLE", "GQ", "FORBES", "TECHCRUNCH"
    ];

    useGSAP(() => {
        const scroller = containerRef.current?.querySelector(".scroller-inner");
        if (!scroller) return;

        // Clone for infinite loop
        const content = scroller.innerHTML;
        scroller.innerHTML = content + content;

        gsap.to(scroller, {
            xPercent: -50,
            ease: "none",
            duration: 20,
            repeat: -1
        });

    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="py-12 border-b border-white/5 bg-background relative z-[5] overflow-hidden">
            <div className="container mx-auto px-8 mb-8 text-center">
                <p className="text-muted text-xs uppercase tracking-[0.2em]">Trusted By Industry Leaders</p>
            </div>

            <div className="scroller w-full overflow-hidden mask-gradient-x">
                <div className="scroller-inner flex w-fit gap-20 px-10 items-center whitespace-nowrap">
                    {brands.map((brand, i) => (
                        <span
                            key={i}
                            className="text-2xl md:text-4xl font-display text-white/30 font-bold uppercase tracking-widest hover:text-white/60 transition-colors duration-300 cursor-default"
                        >
                            {brand}
                        </span>
                    ))}
                </div>
            </div>
            <style jsx>{`
                .mask-gradient-x {
                    mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
                }
            `}</style>
        </section>
    );
}
