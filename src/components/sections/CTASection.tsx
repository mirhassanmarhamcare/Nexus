"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRouter } from "next/navigation";


export default function CTASection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const router = useRouter();


    useGSAP(() => {
        gsap.to(".cta-glow-bg", {
            scale: 1.2,
            opacity: 0.25,
            duration: 4,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
        });

        // Reveal interaction matching ".reveal-on-scroll"
        gsap.from(containerRef.current!.children, { // Using children or specific elements? Legacy: gsap.utils.toArray(".reveal-on-scroll") loop.
            // But CTA section IS a ".reveal-on-scroll".
            // So we should animate the content inside? 
            // Legacy code targets "section.children" inside the loop.
            // So .cta-content and .cta-glow-bg (if strict child).
            y: 50,
            opacity: 0,
            duration: 1,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 85%",
                toggleActions: "play reverse play reverse",
            },
        });
    }, { scope: containerRef });

    return (
        <section
            ref={containerRef}
            className="cta-section py-48 relative overflow-hidden flex items-center justify-center z-[5]"
        >
            <div className="cta-glow-bg"></div>
            <div className="cta-content">
                <span className="cta-label">
                    The Next Step
                </span>
                <h2 className="cta-heading">
                    <span className="cta-text-small">
                        Ready to
                    </span>
                    <span className="cta-text-huge">
                        Elevate?
                    </span>
                </h2>
                <p className="cta-subtext">
                    Join the inner circle of connoisseurs who define luxury on their own terms.
                </p>
                <button
                    className="cta-btn hoverable bg-transparent cursor-none relative group"
                    onClick={() => router.push("/shop")}
                >

                    <span className="relative z-10">Begin The Journey</span>
                </button>
            </div>
        </section>
    );
}
