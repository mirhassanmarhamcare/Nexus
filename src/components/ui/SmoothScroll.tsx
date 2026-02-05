"use client";

import { ReactLenis } from "@studio-freight/react-lenis";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { usePathname } from "next/navigation";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
    const lenisRef = useRef<any>(null);
    const pathname = usePathname();

    // Reset scroll on navigation
    useEffect(() => {
        if (lenisRef.current?.lenis) {
            lenisRef.current.lenis.scrollTo(0, { immediate: true });
        }
    }, [pathname]);

    useEffect(() => {
        function update(time: number) {
            if (lenisRef.current?.lenis) {
                lenisRef.current.lenis.raf(time * 1000);
            }
        }

        gsap.ticker.add(update);

        return () => {
            gsap.ticker.remove(update);
        };
    }, []);

    const options = {
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
    };

    return (
        <ReactLenis root options={options} ref={lenisRef} autoRaf={false}>
            {children as any}
        </ReactLenis>
    );
}

