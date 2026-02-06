"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { usePathname } from "next/navigation";
import { useRef } from "react";

export default function Template({ children }: { children: React.ReactNode }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();

    useGSAP(() => {
        // Simple cross-fade / slide up for premium feel
        gsap.fromTo(containerRef.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", clearProps: "all" }
        );
    }, { scope: containerRef, dependencies: [pathname] }); // Re-run on path change

    return (
        <div ref={containerRef} className="min-h-screen">
            {children}
        </div>
    );
}
