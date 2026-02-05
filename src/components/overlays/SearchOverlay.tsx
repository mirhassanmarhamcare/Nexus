"use client";

import { useUIStore } from "@/store/ui.store";
import { productsDB } from "@/data/products";
import { X, MagnifyingGlass } from "@phosphor-icons/react";
import { useLenis } from "@studio-freight/react-lenis";
import { useEffect, useState } from "react";

export default function SearchOverlay() {
    const { isSearchOpen, toggleSearch, openProduct } = useUIStore();
    const lenis = useLenis();
    const [query, setQuery] = useState("");

    // Reset query when closed
    useEffect(() => {
        if (!isSearchOpen) setQuery("");
    }, [isSearchOpen]);

    useEffect(() => {
        if (lenis) {
            if (isSearchOpen) lenis.stop();
            else lenis.start();
        }
        return () => {
            if (lenis) lenis.start();
        };
    }, [isSearchOpen, lenis]);


    // Filter Logic
    const results = query.length > 0
        ? productsDB.filter(p =>
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.category.toLowerCase().includes(query.toLowerCase())
        )
        : [];

    return (
        <div
            id="search-overlay"
            className={`overlay-container fixed top-0 left-0 w-full h-screen bg-background/95 backdrop-blur-xl z-[9999] transition-transform duration-500 ease-[cubic-bezier(0.77,0,0.175,1)] p-8 md:p-16 flex flex-col ${isSearchOpen ? "translate-x-0 pointer-events-auto" : "translate-x-[100%] pointer-events-none"
                }`}
        >
            <div className="overlay-header flex justify-between items-center mb-8">
                <h2 className="overlay-title font-display text-[3rem] text-foreground">Search</h2>
                <button
                    className="close-btn hoverable bg-transparent border-none text-foreground text-[2rem] cursor-none transition-transform duration-300 hover:rotate-90 hover:text-accent"
                    onClick={toggleSearch}
                >
                    <X size={32} />
                </button>
            </div>

            <div className="container mx-auto px-4 max-w-[1200px] h-full flex flex-col">
                <div className="relative">
                    <input
                        type="text"
                        className="search-input-large w-full bg-transparent border-none border-b-2 border-white/15 text-[2rem] md:text-[4rem] text-foreground font-display py-4 outline-none cursor-none placeholder:text-white/20"
                        placeholder="Type to search..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        autoFocus={isSearchOpen}
                    />
                    <MagnifyingGlass size={48} className="absolute right-0 top-1/2 -translate-y-1/2 text-white/20" />
                </div>

                <div className="mt-16 flex-grow overflow-y-auto pb-20">
                    {query.length === 0 ? (
                        <div>
                            <h4 className="text-muted mb-8 uppercase tracking-widest text-sm">Popular Searches</h4>
                            <div className="flex gap-4 flex-wrap text-foreground">
                                {['Watches', 'Audio', 'Gaming', 'Footwear'].map((term) => (
                                    <button
                                        key={term}
                                        onClick={() => setQuery(term)}
                                        className="hoverable border border-white/15 px-6 py-3 rounded-full cursor-none transition-all hover:bg-white hover:text-black hover:border-white uppercase tracking-wider text-sm"
                                    >
                                        {term}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {results.length > 0 ? (
                                results.map(item => (
                                    <div
                                        key={item.id}
                                        className="group cursor-none flex items-center gap-6 p-4 border border-white/5 hover:bg-white/5 transition-colors"
                                        onClick={() => {
                                            openProduct(item);
                                            toggleSearch(); // Optional: close search on select
                                        }}
                                    >
                                        <div className="w-20 h-20 bg-white/10 flex items-center justify-center text-[8px] text-muted uppercase text-center p-2">
                                            {item.name}
                                        </div>

                                        <div>
                                            <h4 className="font-display text-xl text-foreground group-hover:text-accent transition-colors">{item.name}</h4>
                                            <p className="text-sm text-muted-foreground uppercase tracking-wider">{item.category}</p>
                                            <p className="text-accent mt-1">${item.price}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full text-center py-20 text-muted">
                                    <p className="text-xl">No results found for "{query}"</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
