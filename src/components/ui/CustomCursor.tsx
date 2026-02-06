"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function CustomCursor() {
    const cursorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const cursor = cursorRef.current;
        if (!cursor) return;

        // Only active on non-touch devices
        if (!window.matchMedia("(pointer: fine)").matches) {
            cursor.style.display = "none";
            return;
        }

        document.documentElement.classList.add("has-custom-cursor");

        // Mouse Move - Instant, perfect tracking (like a desktop cursor)
        const onMouseMove = (e: MouseEvent) => {
            gsap.to(cursor, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.05, // Almost instant, just smooth enough to feel software-rendered
                overwrite: true
            });
        };

        // Hover Effect
        const onMouseOver = (e: MouseEvent) => {
            if ((e.target as HTMLElement).closest(".hoverable")) {
                cursor.classList.add("cursor-hovered");
            } else {
                cursor.classList.remove("cursor-hovered");
            }
        };

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseover", onMouseOver);

        return () => {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseover", onMouseOver);
            document.documentElement.classList.remove("has-custom-cursor");
        };

    }, []);

    return (
        <div
            ref={cursorRef}
            id="cursor"
            className="hidden lg:block fixed top-0 left-0 pointer-events-none z-[100000] mix-blend-difference"
        >
            {/*
                PREMIUM CURSOR SVG
                Sharp, angular, minimal.
            */}
            <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="transition-transform duration-300 ease-out origin-top-left [&.cursor-hovered]:scale-75 [&.cursor-hovered]:-rotate-12"
            >
                <path
                    d="M3 3 L10 22 L13 13 L22 10 L3 3 Z"
                    fill="white"
                    stroke="none"
                />
            </svg>
        </div>
    );
}
