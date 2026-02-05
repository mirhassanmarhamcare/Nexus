"use client";

import InnerPageLayout from "@/components/layout/InnerPageLayout";
import { useToastStore } from "@/store/toast.store";
import { ArrowRight } from "@phosphor-icons/react";

export default function ContactPage() {
    const { showToast } = useToastStore();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        showToast("Message Sent. We will reply shortly.");
    };

    return (
        <InnerPageLayout title="Contact Us">
            <div className="grid md:grid-cols-2 gap-16">
                <div>
                    <p className="text-xl mb-8 text-muted-foreground">
                        For inquiries regarding orders, press, or custom commissions, please utilize the form below or contact our concierge directly.
                    </p>
                    <div className="space-y-4 text-sm uppercase tracking-widest">
                        <p>concierge@nexus.com</p>
                        <p>+1 (800) 000-0000</p>
                        <p>123 Mercer Street, New York, NY</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <input type="text" placeholder="Name" className="w-full bg-transparent border-b border-white/20 py-4 outline-none focus:border-accent transition-colors" required />
                        <input type="email" placeholder="Email" className="w-full bg-transparent border-b border-white/20 py-4 outline-none focus:border-accent transition-colors" required />
                    </div>
                    <select className="w-full bg-transparent border-b border-white/20 py-4 outline-none focus:border-accent transition-colors text-muted-foreground">
                        <option>General Inquiry</option>
                        <option>Order Support</option>
                        <option>Press</option>
                    </select>
                    <textarea placeholder="Message" rows={4} className="w-full bg-transparent border-b border-white/20 py-4 outline-none focus:border-accent transition-colors resize-none" required></textarea>

                    <button type="submit" className="group flex items-center gap-4 text-sm uppercase tracking-widest mt-8 hover:text-accent transition-colors">
                        Send Message
                        <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                    </button>
                </form>
            </div>
        </InnerPageLayout>
    );
}
