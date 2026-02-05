"use client";

import { useUIStore } from "@/store/ui.store";

export default function BackgroundGradients() {
    const theme = useUIStore((state) => state.theme);

    return (
        <>
            <div
                id="bg-1"
                className={`bg-layer fixed top-0 left-0 w-full h-screen -z-10 transition-opacity duration-1500 pointer-events-none ${theme === "light" ? "opacity-0 !important" : "opacity-100"
                    } active`} // Logic for bg-1 active state matches legacy usage somewhat, but legacy had specific scrolltrigger logic for bg-1 opacity. 
                // Legacy: #bg-1 active class made it opacity 1. [data-theme=light] made it opacity 0 !important. 
                // AND sticky panel scrolltrigger modified #bg-1 opacity.
                // So we need to expose an ID for GSAP to grab, or manage state.
                // Legacy "active" class was static in HTML basically.
                style={{
                    background: "var(--bg-gradient-1)",
                }}
            ></div>
            <div
                id="bg-2"
                className="bg-layer fixed top-0 left-0 w-full h-screen -z-10 opacity-0 transition-opacity duration-1500 pointer-events-none"
                style={{
                    background: "var(--bg-gradient-2)",
                    opacity: 1 // Legacy #bg-2 didn't have active class initially but CSS had opacity 0? 
                    // Wait, legacy HTML: <div id="bg-1" class="bg-layer active"></div> <div id="bg-2" class="bg-layer"></div>
                    // CSS: .bg-layer { opacity: 0 } .bg-layer.active { opacity: 1 }
                    // So bg-2 starts invisible?
                    // "Legacy: #bg-2 { background: var(--bg-gradient-2) }"
                    // It seems bg-2 is just sitting there?
                    // Actually, looks like bg-2 is the fallback if bg-1 fades out?
                    // In legacy sticky panel, it does: "if (i === 0) gsap.to("#bg-1", { opacity: 0 });"
                    // So bg-1 fades out, revealing what's behind it? if bg-2 is z-index -1 and bg-1 is z-index -1?
                    // They are both fixed.
                    // If bg-1 fades out, bg-2 (if visible) would show. But bg-2 has class "bg-layer" (opacity 0).
                    // So default background color shows?
                    // Body has background-color: var(--bg-color).
                    // So bg-2 might be unused or I missed where it becomes active.
                    // Documentation says 1:1. I will replicate the HTML structure exactly.
                }}
            ></div>
        </>
    );
}
