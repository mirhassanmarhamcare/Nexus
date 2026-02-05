"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { Star } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";


gsap.registerPlugin(ScrollTrigger);

export default function TopSellersSection() {
    const containerRef = useRef<HTMLElement>(null);
    const router = useRouter();


    useGSAP(() => {
        gsap.from(".seller-card", {
            y: 60,
            opacity: 0,
            duration: 1,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 70%",
                toggleActions: "play reverse play reverse"
            }
        });
    }, { scope: containerRef });

    const categories = [
        {
            name: "Handbags",
            img: "Handbags",
            bg: "bg-[#f3e5f5]" // Light purple tint placeholder
        },
        {
            name: "Women's Shoes",
            img: "Shoes",
            bg: "bg-[#e1f5fe]" // Light blue tint placeholder
        },
        {
            name: "Men's Small Leather Goods",
            img: "Leather",
            bg: "bg-[#e0f2f1]" // Light teal tint placeholder
        },
        {
            name: "Fashion Jewelry",
            img: "Jewelry",
            bg: "bg-[#fff3e0]" // Light orange tint placeholder
        }
    ];

    return (
        <section ref={containerRef} className="top-sellers-section py-20 bg-background relative z-[5]">
            <div className="container mx-auto px-4 max-w-[1600px]"> {/* Wider container for large images */}
                <div className="mb-16 text-center">
                    <h2 className="text-3xl md:text-5xl font-display font-medium tracking-tight">Top Sellers</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {categories.map((cat, i) => (
                        <div key={i} className="seller-card group cursor-pointer" onClick={() => router.push("/shop")}>

                            <div className={`aspect-[3/4] ${cat.bg} relative overflow-hidden mb-6`}>
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500 z-10"></div>
                                {/* Image Placeholder - in production this would be <Image fill ... /> */}
                                <div className="w-full h-full flex items-center justify-center text-muted/20 font-display text-4xl uppercase tracking-widest group-hover:scale-105 transition-transform duration-700">
                                    {cat.img}
                                </div>
                            </div>

                            <div className="text-center">
                                <h3 className="text-sm md:text-base font-medium uppercase tracking-wide border-b border-transparent group-hover:border-foreground inline-block transition-all pb-1">
                                    {cat.name}
                                </h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
