"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function NarrativeSection() {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        // Logic for sticky panels
        // Legacy: const panels = document.querySelectorAll('.sticky-panel');
        // We should select from our ref scope.
        const panels = gsap.utils.toArray<HTMLElement>(".sticky-panel");

        panels.forEach((panel, i) => {
            const text = panel.querySelector(".panel-text");
            const visual = panel.querySelector(".panel-visual");

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: panel,
                    start: "top 60%",
                    end: "top 20%",
                    scrub: 1,
                },
            });

            tl.to(text, { opacity: 1, y: 0, duration: 1 })
                .to(visual, { opacity: 1, scale: 1, duration: 1 }, "<");

            ScrollTrigger.create({
                trigger: panel,
                start: "top center",
                onEnter: () => {
                    if (i === 0) gsap.to("#bg-1", { opacity: 0 }); // Interact with global background
                },
                onLeaveBack: () => {
                    if (i === 0) gsap.to("#bg-1", { opacity: 1 });
                },
            });
        });
    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="narrative-section relative pb-[10vh] z-[5]">
            {/* Panel 1 */}
            <div className="sticky-panel">
                <div className="panel-content">
                    <div className="panel-text">
                        <div className="panel-num">01</div>
                        <h2 className="panel-head">
                            Engineered<br />Elegance
                        </h2>
                        <p className="panel-desc">
                            We strip away the non-essential. What remains is pure form, function, and aesthetic clarity. A design language that speaks without shouting.
                        </p>
                    </div>
                    <div className="img-placeholder panel-visual">
                        <div className="absolute top-0 -left-full w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-[25deg] animate-[shine_3s_infinite]"></div>
                        Concept Visual
                    </div>
                </div>
            </div>
            {/* Add more panels if needed, legacy had only 01. */}
        </section>
    );
}
