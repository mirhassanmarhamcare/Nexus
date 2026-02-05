"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useUIStore } from "@/store/ui.store";

export default function CustomCursor() {
    const cursorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const cursor = cursorRef.current;
        if (!cursor) return;

        // Only active on non-touch devices (matchMedia matches legacy logic)
        if (!window.matchMedia("(pointer: fine)").matches) {
            cursor.style.display = "none";
            return;
        }

        // Add class to hide default cursor
        document.documentElement.classList.add("has-custom-cursor");

        const onMouseMove = (e: MouseEvent) => {
            gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.1 });
        };

        const onMouseOver = (e: MouseEvent) => {
            if ((e.target as HTMLElement).closest(".hoverable")) {
                cursor.classList.add("hovered");
            } else {
                cursor.classList.remove("hovered");
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
            className="hidden lg:block fixed top-0 left-0 w-[20px] h-[20px] border border-accent bg-transparent rounded-full pointer-events-none z-[100000] -translate-x-1/2 -translate-y-1/2 mix-blend-difference transition-[width,height,background] duration-300 [&.hovered]:w-[40px] [&.hovered]:h-[40px] [&.hovered]:bg-white [&.hovered]:border-transparent"
        ></div>
    );
}
