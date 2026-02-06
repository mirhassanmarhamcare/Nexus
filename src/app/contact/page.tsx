"use client";

import InnerPageLayout from "@/components/layout/InnerPageLayout";
import { useToastStore } from "@/store/toast.store";
import { ArrowRight, CircleNotch } from "@phosphor-icons/react";
import { useState } from "react";

export default function ContactPage() {
    const { showToast } = useToastStore();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        setIsSubmitting(false);
        showToast("Message Sent. We will reply shortly.");
        // Optional: Reset form here
        (e.target as HTMLFormElement).reset();
    };

    return (
        <InnerPageLayout title="Contact Us">
            <div className="grid md:grid-cols-2 gap-16">
                <div>
                    <h3 className="text-2xl font-display mb-6">Concierge Service</h3>
                    <p className="text-xl mb-12 text-muted-foreground leading-relaxed">
                        For inquiries regarding orders, press, or custom commissions, please utilize the form below or contact our concierge directly. Our team is available 24/7 to assist with your requests.
                    </p>
                    <div className="space-y-6 text-sm uppercase tracking-widest text-muted-foreground">
                        <div className="group cursor-pointer hover:text-white transition-colors">
                            <span className="block text-[10px] text-accent/50 mb-1">Email</span>
                            concierge@nexus.com
                        </div>
                        <div className="group cursor-pointer hover:text-white transition-colors">
                            <span className="block text-[10px] text-accent/50 mb-1">Phone</span>
                            +1 (800) 000-0000
                        </div>
                        <div className="group cursor-pointer hover:text-white transition-colors">
                            <span className="block text-[10px] text-accent/50 mb-1">Atelier</span>
                            123 Mercer Street, New York, NY
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="relative group">
                            <input type="text" placeholder="Name" className="w-full bg-transparent border-b border-white/10 py-4 outline-none focus:border-accent transition-colors placeholder:text-white/20" required />
                            <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-accent transition-all group-focus-within:w-full" />
                        </div>
                        <div className="relative group">
                            <input type="email" placeholder="Email" className="w-full bg-transparent border-b border-white/10 py-4 outline-none focus:border-accent transition-colors placeholder:text-white/20" required />
                            <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-accent transition-all group-focus-within:w-full" />
                        </div>
                    </div>

                    <div className="relative group">
                        <select className="w-full bg-transparent border-b border-white/10 py-4 outline-none focus:border-accent transition-colors text-muted-foreground appearance-none cursor-pointer">
                            <option>General Inquiry</option>
                            <option>Order Support</option>
                            <option>Press</option>
                            <option>Custom Commission</option>
                        </select>
                        <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-accent transition-all group-focus-within:w-full" />
                        {/* Custom arrow could go here */}
                    </div>

                    <div className="relative group">
                        <textarea placeholder="Message" rows={4} className="w-full bg-transparent border-b border-white/10 py-4 outline-none focus:border-accent transition-colors resize-none placeholder:text-white/20" required></textarea>
                        <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-accent transition-all group-focus-within:w-full" />
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="group flex items-center gap-4 text-sm uppercase tracking-widest hover:text-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <span className="flex items-center gap-3">
                                    <CircleNotch className="animate-spin" />
                                    Transmitting...
                                </span>
                            ) : (
                                <span className="flex items-center gap-4">
                                    Send Message
                                    <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                                </span>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </InnerPageLayout>
    );
}
