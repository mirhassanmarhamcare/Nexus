"use client";

import { useUIStore } from "@/store/ui.store";
import { useCartStore } from "@/store/cart.store"; // Legacy used 'cart' array length.
import { Plus, Handbag, User, MagnifyingGlass, Sun, List, Moon } from "@phosphor-icons/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import MagneticButton from "@/components/ui/MagneticButton";

import { useSettingsStore } from "@/store/settings.store";

export default function Navbar() {
    const { toggleCart, toggleAuth, toggleSearch, toggleMenu, setTheme, theme } = useUIStore();
    const { settings } = useSettingsStore();
    const cartItems = useCartStore((state) => state.items);
    const cartCount = cartItems.length;
    const pathname = usePathname();
    const isHome = pathname === "/";

    return (
        <nav id="navbar" className={`hoverable group transition-colors duration-500 ${!isHome ? "scrolled-nav bg-black text-white" : ""}`}>
            <div className="container px-8">
                <div className="nav-content">
                    {/* Left Column */}
                    <div className="nav-left">
                        <Link href="/shop" className="font-display text-[11px] uppercase tracking-[0.3em] hover:text-accent transition-colors duration-300">
                            Shop
                        </Link>
                        <Link href="/story" className="font-display text-[11px] uppercase tracking-[0.3em] hover:text-accent transition-colors duration-300">
                            Story
                        </Link>
                    </div>

                    {/* Center Column */}
                    <div className="nav-center">
                        {!isHome ? (
                            <Link href="/" className="font-display text-4xl font-bold tracking-tight hover:text-accent transition-colors uppercase">
                                {settings?.storeName || "NEXUS"}
                            </Link>
                        ) : (
                            <div id="logo-dest" className="logo-placeholder"></div>
                        )}
                    </div>

                    {/* Right Column */}
                    <div className="nav-right">
                        <div className="flex gap-4 items-center">
                            <MagneticButton onClick={toggleSearch}>
                                <button className="nav-icon-btn hover:text-accent"><MagnifyingGlass size={20} /></button>
                            </MagneticButton>
                            <MagneticButton onClick={toggleCart}>
                                <button className="nav-icon-btn hover:text-accent relative">
                                    <Handbag size={20} />
                                    {cartCount > 0 && (
                                        <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-accent text-[8px] text-white">
                                            {cartCount}
                                        </span>
                                    )}
                                </button>
                            </MagneticButton>
                            <MagneticButton onClick={toggleMenu}>
                                <button className="nav-icon-btn hover:text-accent"><List size={20} /></button>
                            </MagneticButton>
                            <button className="nav-icon-btn hover:text-accent" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                                {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>

    );
}
