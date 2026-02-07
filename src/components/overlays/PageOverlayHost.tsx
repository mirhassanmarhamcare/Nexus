"use client";

import { useUIStore } from "@/store/ui.store";
import { useAuthStore } from "@/store/auth.store";
import { useToastStore } from "@/store/toast.store";
import { useCartStore } from "@/store/cart.store";
import { productsDB } from "@/data/products";
import { X } from "@phosphor-icons/react";
import { useLenis } from "@studio-freight/react-lenis";
import { useEffect, useState } from "react";

export default function PageOverlayHost() {
    const { activePageId, closePage, closeAllOverlays } = useUIStore();
    const { isLoggedIn, logout } = useAuthStore();
    const { showToast } = useToastStore();
    const { addToCart } = useCartStore();
    const lenis = useLenis();
    const [shopFilter, setShopFilter] = useState("All");

    useEffect(() => {
        if (lenis) {
            if (activePageId) lenis.stop();
            else lenis.start();
        }
    }, [activePageId, lenis]);

    // Shop Component Logic
    const ShopContent = () => {
        const filtered = shopFilter === "All" ? productsDB : productsDB.filter((p) => p.category === shopFilter);
        const categories = ["All", "Living", "Audio", "Footwear", "Timepieces", "Carry", "Eyewear", "Gaming"];

        return (
            <>
                <div className="shop-controls flex gap-4 flex-wrap mb-8 pb-4 border-b border-white/15">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            className={`shop-filter-btn hoverable bg-transparent border border-white/15 text-foreground px-6 py-2 rounded-full text-[0.8rem] uppercase cursor-none transition-all duration-300 hover:bg-foreground hover:text-background hover:border-foreground ${cat === shopFilter ? "bg-foreground text-background border-foreground" : ""
                                }`}
                            onClick={() => setShopFilter(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
                <div className="shop-grid grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-8">
                    {filtered.length === 0 ? (
                        <p className="col-span-full text-center text-muted">No items found in this category.</p>
                    ) : (
                        filtered.map((p) => (
                            <div
                                key={p.id}
                                className="flash-card hoverable p-8 bg-card border border-white/15 flex flex-col gap-6 shadow-lg transition-[transform,border-color,background-color] duration-300 hover:border-accent hover:-translate-y-2 cursor-none"
                                onClick={() => {
                                    // openProduct(p); we need to destructure openProduct from store first
                                    useUIStore.getState().openProduct(p);
                                }}
                            >
                                <div className="img-placeholder flash-img-area w-full h-[250px] bg-gradient-to-tr from-[#1a1a1a] to-[#222] flex items-center justify-center text-muted text-foreground uppercase tracking-[0.2em] relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                                    <img src={p.images[0]} alt={p.name} className="absolute inset-0 w-full h-full object-cover" />
                                </div>
                                <div className="flash-meta flex justify-between items-start">
                                    <div>
                                        <h3 className="flash-title font-display text-[1.2rem] mb-2 text-foreground">{p.name}</h3>
                                        <span className="flash-price text-accent">Rs. {p.price.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </>
        );
    };

    const renderContent = () => {
        switch (activePageId) {
            case "shop":
                return <ShopContent />;
            case "contact":
                return (
                    <>
                        <h3 className="text-foreground text-[1.5rem] font-display mt-8 mb-4">Get in Touch</h3>
                        <p className="mb-6 text-[1.1rem]">We are available 24/7 to assist you with your inquiries.</p>
                        <div className="form-group mb-6"><label className="block mb-2">Name</label><input type="text" className="form-input w-full p-4 bg-background border border-white/15 text-foreground outline-none cursor-none" placeholder="Your Name" /></div>
                        <div className="form-group mb-6"><label className="block mb-2">Email</label><input type="email" className="form-input w-full p-4 bg-background border border-white/15 text-foreground outline-none cursor-none" placeholder="Your Email" /></div>
                        <div className="form-group mb-6"><label className="block mb-2">Message</label><textarea className="form-input w-full p-4 bg-background border border-white/15 text-foreground outline-none cursor-none" rows={5} placeholder="How can we help?"></textarea></div>
                        <button className="form-btn hoverable w-full p-4 bg-accent text-black font-semibold border-none cursor-none" onClick={() => showToast("Message Sent")}>Send Message</button>
                        <div className="mt-12 text-muted text-[1.1rem]">
                            <p className="mb-2"><strong>HQ:</strong> 100 Luxury Blvd, Milan, Italy</p>
                            <p><strong>Email:</strong> concierge@nexus.com</p>
                        </div>
                    </>
                );
            case "profile":
                return (
                    <>
                        <h3 className="text-foreground text-[1.5rem] font-display mt-8 mb-4">My Profile</h3>
                        <p className="mb-6 text-[1.1rem]">Member since 2026</p>
                        <div className="mt-8 p-6 border border-white/15 bg-card">
                            <h4 className="mb-2 text-[1rem]">Recent Order #8821</h4>
                            <p className="text-accent mb-4">Status: Shipped via Express</p>
                            <p className="text-[0.9rem] text-muted">Sonic Pro ANC, Nexus Watch</p>
                        </div>
                        <button
                            className="form-btn hoverable mt-8 w-full p-4 bg-white/15 text-white font-semibold border-none cursor-none"
                            onClick={() => {
                                logout();
                                closePage();
                                showToast("Logged Out");
                            }}
                        >
                            Log Out
                        </button>
                    </>
                );
            case "story":
                return (
                    <>
                        <h3 className="text-foreground text-[1.5rem] font-display mt-8 mb-4">The Origin</h3>
                        <p className="mb-6 text-[1.1rem]">Founded in the digital age, NEXUS was born from a desire to strip away the noise of modern commerce. We believe in objects that last, design that speaks, and logistics that feel like magic.</p>
                        <p className="mb-6 text-[1.1rem]">Our curation process is rigorous. Only 1% of products we review make it to our catalog. We prioritize craftsmanship, sustainable materials, and timeless aesthetics over fleeting trends.</p>
                        <h3 className="text-foreground text-[1.5rem] font-display mt-8 mb-4">Our Philosophy</h3>
                        <p className="mb-6 text-[1.1rem]">True luxury is seamlessness. It is the absence of friction. From the moment you land on our platform to the unboxing experience, every interaction is engineered for elegance.</p>
                    </>
                );
            case "journal":
                return (
                    <>
                        <h3 className="text-foreground text-[1.5rem] font-display mt-8 mb-4">Latest Editorials</h3>
                        <div className="grid gap-8 mt-8">
                            <div className="p-8 border border-white/15">
                                <h4 className="text-[1.5rem] mb-4">The Future of Minimalism</h4>
                                <p className="mb-4 text-[1.1rem]">How AI and generative design are reshaping the aesthetics of everyday objects.</p>
                                <a className="hoverable text-accent uppercase text-[0.8rem] cursor-none">Read Article</a>
                            </div>
                            <div className="p-8 border border-white/15">
                                <h4 className="text-[1.5rem] mb-4">Sustainable Luxury</h4>
                                <p className="mb-4 text-[1.1rem]">Why the world's leading brands are turning to recycled composites.</p>
                                <a className="hoverable text-accent uppercase text-[0.8rem] cursor-none">Read Article</a>
                            </div>
                        </div>
                    </>
                );
            case "sustainability": return <><h3 className="text-foreground text-[1.5rem] font-display mt-8 mb-4">Commitment to Earth</h3><p className="mb-6 text-[1.1rem]">We are carbon neutral. For every shipment, we plant a tree. Our packaging is 100% biodegradable.</p></>;
            case "careers": return <><h3 className="text-foreground text-[1.5rem] font-display mt-8 mb-4">Join Us</h3><p className="mb-6 text-[1.1rem]">We are always looking for visionaries. Current openings in Design, Engineering, and Logistics.</p></>;
            case "press": return <><h3 className="text-foreground text-[1.5rem] font-display mt-8 mb-4">In The News</h3><p className="mb-6 text-[1.1rem]">NEXUS featured in Vogue, Wired, and Monocle.</p></>;
            case "service": return <><h3 className="text-foreground text-[1.5rem] font-display mt-8 mb-4">Client Services</h3><p className="mb-6 text-[1.1rem]">Need styling advice? Our concierge team is ready to help you curate your lifestyle.</p></>;
            case "shipping": return <><h3 className="text-foreground text-[1.5rem] font-display mt-8 mb-4">Global Velocity</h3><p className="mb-6 text-[1.1rem]">We ship to over 100 countries. Standard shipping is 3-5 business days. Express is 1-2 days.</p></>;
            case "payment": return <><h3 className="text-foreground text-[1.5rem] font-display mt-8 mb-4">Secure Transactions</h3><p className="mb-6 text-[1.1rem]">All payments are encrypted with military-grade security. We accept all major cards and crypto.</p></>;
            case "legal": return <><h3 className="text-foreground text-[1.5rem] font-display mt-8 mb-4">Terms & Privacy</h3><p className="mb-6 text-[1.1rem]">By using NEXUS, you agree to our terms of service. We respect your privacy and data.</p></>;
            case "archive": return <><h3 className="text-foreground text-[1.5rem] font-display mt-8 mb-4">The Archive</h3><p className="mb-6 text-[1.1rem]">Past collections and limited drops that defined our journey. Currently view-only.</p></>;
            default: return <p>Content loading...</p>;
        }
    };

    const title = activePageId ? activePageId.charAt(0).toUpperCase() + activePageId.slice(1) : "";

    return (
        <div
            id="page-overlay"
            className={`overlay-container fixed top-0 left-0 w-full h-screen bg-background z-[9999] transition-transform duration-500 ease-[cubic-bezier(0.77,0,0.175,1)] p-8 md:p-16 flex flex-col overflow-y-auto ${activePageId ? "translate-x-0 pointer-events-auto" : "translate-x-[100%] pointer-events-none"
                }`}
        >
            <div className="overlay-header flex justify-between items-center mb-16 shrink-0">
                <h2 className="overlay-title font-display text-[3rem] text-foreground">{title === 'Shop' ? 'Shop Collection' : title}</h2>
                <button
                    className="close-btn hoverable bg-transparent border-none text-foreground text-[2rem] cursor-none transition-transform duration-300 hover:rotate-90 hover:text-accent"
                    onClick={closePage}
                >
                    <X size={32} />
                </button>
            </div>
            <div className="container mx-auto px-8 max-w-[800px] text-muted leading-[1.8] flex-grow pb-24">
                {renderContent()}
            </div>
        </div>
    );
}
