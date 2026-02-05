"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface MagneticButtonProps {
    children: React.ReactNode;
    className?: string;
    strength?: number; // 0 to 1 (0.5 default)
    onClick?: () => void;
}

export default function MagneticButton({ children, className = "", strength = 0.5, onClick }: MagneticButtonProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const el = containerRef.current;
        if (!el) return;

        const xTo = gsap.quickTo(el, "x", { duration: 1, ease: "elastic.out(1, 0.3)" });
        const yTo = gsap.quickTo(el, "y", { duration: 1, ease: "elastic.out(1, 0.3)" });

        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            const { height, width, left, top } = el.getBoundingClientRect();

            // Calculate distance from center
            const x = clientX - (left + width / 2);
            const y = clientY - (top + height / 2);

            // Apply strength
            xTo(x * strength);
            yTo(y * strength);
        };

        const handleMouseLeave = () => {
            xTo(0);
            yTo(0);
        };

        el.addEventListener("mousemove", handleMouseMove);
        el.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            el.removeEventListener("mousemove", handleMouseMove);
            el.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, { scope: containerRef });

    return (
        <div
            ref={containerRef}
            className={`inline-block w-fit h-fit ${className}`}
            onClick={onClick}
        >
            {children}
        </div>
    );
}
