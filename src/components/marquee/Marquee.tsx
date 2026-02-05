"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

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

    const MarqueeItem = () => (
        <span className="marquee-item text-[#111] dark:text-inherit font-display font-normal italic text-[1.4rem] uppercase tracking-[0.05em] flex items-center gap-4 group-data-[theme=light]:text-white">
            {/* Note: data-theme handling. Legacy CSS: [data-theme="light"] .marquee-item { color: #fff }
          The container has bg-accent. Text color #111 (dark) or #fff (light).
          Wait, legacy CSS:
          .marquee-item { color: #111; ... }
          [data-theme="light"] .marquee-item { color: #fff; }
          Wait, if theme is light, background is generally light, but marquee HAS background: var(--accent-color).
          Ah, in Light mode, accent color might change?
          Legacy: 
          Dark: --accent-color: #c9a96e;
          Light: --accent-color: #a68b55;
          So contrast is tricky.
          Let's replicate CSS classes via Tailwind arbritrary variants or just `dark:` if we used `darkMode: class`.
          My tailwind config uses `darkMode: ['class', '[data-theme="dark"]']`.
          So `dark` variant applies when data-theme="dark".
          Legacy default IS dark.
          Legacy CSS: .marquee-item { color: #111 }. [data-theme="light"] { color: #fff }.
          So when "light" (data-theme="light"), color is white.
          When "dark" (default), color is #111.
          This means `dark:text-[#111]`?
          No, "light" theme means the *UI* is light mode.
          So `dark:` variant means data-theme="dark".
          So `text-white dark:text-[#111]` -> White in light mode, #111 in dark mode.
      */}
            New Arrivals 2026 <span className="marquee-separator not-italic text-[0.8rem] opacity-60 -translate-y-[2px]">✦</span> Global Shipping <span className="marquee-separator not-italic text-[0.8rem] opacity-60 -translate-y-[2px]">✦</span> Luxury Defined <span className="marquee-separator not-italic text-[0.8rem] opacity-60 -translate-y-[2px]">✦</span>
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
