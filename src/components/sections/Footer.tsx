"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useUIStore } from "@/store/ui.store";
import { useToastStore } from "@/store/toast.store";
import { ArrowRight } from "@phosphor-icons/react";
import Link from "next/link";
import { useSettingsStore } from "@/store/settings.store";

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
    const containerRef = useRef<HTMLElement>(null);
    const { openPage } = useUIStore();
    const { settings } = useSettingsStore();
    const { showToast } = useToastStore();
    const year = new Date().getFullYear();

    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 85%",
                toggleActions: "play none none none",
            },
        });

        tl.from(".footer-brand", { y: 30, opacity: 0, duration: 0.8, ease: "power3.out" })
            .from(".footer-col", { y: 20, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power3.out" }, "-=0.6")
            .from(".footer-bottom", { y: 20, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.6");

        gsap.from(".footer-huge-text", {
            y: 100,
            opacity: 0,
            scale: 0.9,
            duration: 1,
            ease: "power4.out",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 85%",
                end: "bottom bottom",
                toggleActions: "play reverse play reverse",
            },
        });
    }, { scope: containerRef });

    return (
        <footer ref={containerRef}>
            <div className="container relative z-[2]">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <h2>Join the<br />Inner Circle.</h2>
                        <p>Subscribe for early access to drops and exclusive atelier updates.</p>
                        <div className="newsletter-wrapper">
                            <input type="email" placeholder="Email Address" className="newsletter-input hoverable cursor-none" />
                            <ArrowRight
                                size={24}
                                className="arrow-submit hoverable cursor-none"
                                onClick={() => showToast("Subscribed to Newsletter")}
                            />
                        </div>
                    </div>

                    <div className="footer-col">
                        <h4>Collections</h4>
                        <ul>
                            <li><Link href="/shop" className="hoverable cursor-none">Latest Drops</Link></li>
                            <li><Link href="/shop" className="hoverable cursor-none">Ready to Wear</Link></li>
                            <li><Link href="/shop" className="hoverable cursor-none">Objects</Link></li>
                            <li><Link href="/archive" className="hoverable cursor-none">Archive</Link></li>
                        </ul>
                    </div>

                    <div className="footer-col">
                        <h4>Maison</h4>
                        <ul>
                            <li><Link href="/story" className="hoverable cursor-none">Our Story</Link></li>
                            <li><Link href="/sustainability" className="hoverable cursor-none">Sustainability</Link></li>
                            <li><Link href="/careers" className="hoverable cursor-none">Careers</Link></li>
                            <li><Link href="/press" className="hoverable cursor-none">Press</Link></li>
                        </ul>
                    </div>

                    <div className="footer-col">
                        <h4>Assistance</h4>
                        <ul>
                            <li><Link href="/service" className="hoverable cursor-none">Client Services</Link></li>
                            <li><Link href="/shipping" className="hoverable cursor-none">Shipping & Returns</Link></li>
                            <li><Link href="/payment" className="hoverable cursor-none">Secure Payment</Link></li>
                            <li><Link href="/legal" className="hoverable cursor-none">Legal</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <span className="pl-16 md:pl-0 font-mono text-[9px] tracking-widest uppercase">&copy; {year} {settings?.storeName || "NEXUS"} ATELIER.</span>
                    <div className="flex gap-8">
                        {settings?.instagram && (
                            <a href={settings.instagram} target="_blank" className="hoverable cursor-none hover:text-accent font-mono text-[9px] tracking-widest uppercase">INSTAGRAM</a>
                        )}
                        {settings?.facebook && (
                            <a href={settings.facebook} target="_blank" className="hoverable cursor-none hover:text-accent font-mono text-[9px] tracking-widest uppercase">FACEBOOK</a>
                        )}
                        <span className="hoverable cursor-none hover:text-accent font-mono text-[9px] tracking-widest uppercase" onClick={() => showToast('Inquiry Received')}>GLOBAL</span>
                    </div>
                </div>
            </div>
            <h1 className="footer-huge-text">
                {settings?.storeName || "NEXUS"}
            </h1>
        </footer>
    );
}
