"use client";

import { ArrowCounterClockwise, Truck, Headset, CreditCard } from "@phosphor-icons/react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function FeaturesSection() {
    const containerRef = useRef<HTMLElement>(null);

    useGSAP(() => {
        gsap.from(".feature-item", {
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 85%",
                toggleActions: "play reverse play reverse"
            }
        });
    }, { scope: containerRef });

    const features = [
        {
            icon: ArrowCounterClockwise,
            title: "Money Back Guarantee",
            desc: "Within 30 days for an exchange.",
            link: "Learn More"
        },
        {
            icon: Truck,
            title: "Free Shipping",
            desc: "Free Shipping for orders over $200",
            link: "Learn More"
        },
        {
            icon: Headset,
            title: "Online Support",
            desc: "24 hours a day, 7 days a week",
            link: "Get Support"
        },
        {
            icon: CreditCard,
            title: "Flexible Payment",
            desc: "Pay with Multiple Credit Cards",
            link: "Learn More"
        }
    ];

    return (
        <section ref={containerRef} className="features-section py-20 relative z-[5] bg-background border-b border-border">
            <div className="container mx-auto px-8 max-w-[1400px]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, i) => (
                        <div key={i} className="feature-item flex flex-col items-center text-center gap-4 p-4 hover:bg-accent/5 transition-colors duration-300 rounded-sm group">
                            <feature.icon size={48} className="text-accent mb-2" weight="light" />
                            <div>
                                <h3 className="text-lg font-medium mb-1">{feature.title}</h3>
                                <p className="text-muted text-sm mb-3">{feature.desc}</p>
                                <button className="text-sm underline decoration-accent/50 hover:decoration-accent underline-offset-4 transition-all hover:text-accent uppercase tracking-wider text-[0.7rem] font-semibold">
                                    {feature.link}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
