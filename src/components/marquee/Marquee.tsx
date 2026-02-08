"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useSettingsStore } from "@/store/settings.store";

export default function Marquee() {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        gsap.to(".marquee-track", {
            xPercent: -50,
            ease: "none",
            duration: 20,
            repeat: -1,
        });
    }, { scope: containerRef });

    const { settings } = useSettingsStore();

    const MarqueeItem = () => (
        <span className="marquee-item text-[#111] dark:text-inherit font-display font-normal italic text-[1.4rem] uppercase tracking-[0.05em] flex items-center gap-4 group-data-[theme=light]:text-white">
            {settings?.announcement || "New Arrivals 2026"}
            <span className="marquee-separator not-italic text-[0.8rem] opacity-60 -translate-y-[2px]">✦</span>
            Global Shipping
            <span className="marquee-separator not-italic text-[0.8rem] opacity-60 -translate-y-[2px]">✦</span>
            Luxury Defined
            <span className="marquee-separator not-italic text-[0.8rem] opacity-60 -translate-y-[2px]">✦</span>
        </span>
    );

    return (
        <div
            ref={containerRef}
            className="marquee-section bg-accent py-5 overflow-hidden relative z-[5] mb-20 transform-none border-y border-[rgba(0,0,0,0.05)]"
        >
            <div className="marquee-track flex whitespace-nowrap gap-24">
                {/* Replicating items 8 times as per legacy HTML count roughly */}
                {[...Array(8)].map((_, i) => (
                    <MarqueeItem key={i} />
                ))}
            </div>
        </div>
    );
}
