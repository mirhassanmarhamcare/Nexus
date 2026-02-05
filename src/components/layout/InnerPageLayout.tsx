"use client";

import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/sections/Footer";

export default function InnerPageLayout({ children, title }: { children: React.ReactNode; title?: string }) {
    return (
        <main className="min-h-screen bg-background text-foreground flex flex-col">
            <Navbar />
            <div className="pt-44 pb-20 container mx-auto px-4 flex-grow relative z-10">

                {title && (
                    <header className="mb-16 fade-in text-center md:text-left">
                        <h1 className="text-[clamp(2.5rem,5vw,5rem)] font-display uppercase leading-tight tracking-tight">
                            {title}
                        </h1>
                    </header>
                )}
                {children}
            </div>
            <Footer />
        </main>
    );
}
