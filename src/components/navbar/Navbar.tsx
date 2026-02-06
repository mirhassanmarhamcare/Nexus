"use client";

import { useUIStore } from "@/store/ui.store";
import { useCartStore } from "@/store/cart.store"; // Legacy used 'cart' array length.
import { Plus, Handbag, User, MagnifyingGlass, Sun, List, Moon } from "@phosphor-icons/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import MagneticButton from "@/components/ui/MagneticButton";

export default function Navbar() {
    const { toggleCart, toggleAuth, toggleSearch, toggleMenu, setTheme, theme } = useUIStore();
    const cartItems = useCartStore((state) => state.items);
    const cartCount = cartItems.length;
    const pathname = usePathname();
    const isHome = pathname === "/";

    return (
        <nav
            id="navbar"
            className={`hoverable group transition-colors duration-500 ${!isHome ? "scrolled-nav bg-black text-white" : ""}`}
        >
            <div className="container nav-content">
                {/* Left */}
                <div className="nav-left flex gap-6 items-center">
                    <Link
                        href="/shop"
                        className="font-display text-xs uppercase tracking-[0.2em] hover:text-accent transition-colors duration-300"
                    >
                        Shop
                    </Link>
                    <Link
                        href="/story"
                        className="font-display text-xs uppercase tracking-[0.2em] hover:text-accent transition-colors duration-300"
                    >
                        Story
                    </Link>
                </div>

                {/* Center */}
                <div className="nav-center">
                    {!isHome ? (
                        <Link href="/" className="font-display text-3xl font-bold tracking-widest hover:text-accent transition-colors uppercase">
                            NEXUS
                        </Link>
                    ) : (

                        <div id="logo-dest" className="logo-placeholder"></div>
                    )}
                </div>

                {/* Right */}
                <div className="nav-right">
                    <div className="nav-icons flex gap-4">
                        <MagneticButton onClick={toggleSearch}>
                            <button className="nav-icon-btn hover:text-accent transition-colors">
                                <MagnifyingGlass size={18} />
                            </button>
                        </MagneticButton>
                        <MagneticButton onClick={toggleAuth}>
                            <button className="nav-icon-btn hover:text-accent transition-colors hidden sm:flex">
                                <User size={18} />
                            </button>
                        </MagneticButton>
                        <MagneticButton onClick={toggleCart}>
                            <button className="nav-icon-btn hover:text-accent transition-colors relative">
                                <Handbag size={18} />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-accent text-[8px] text-white">
                                        {cartCount}
                                    </span>
                                )}
                            </button>
                        </MagneticButton>
                        <MagneticButton onClick={toggleMenu}>
                            <button className="nav-icon-btn hover:text-accent transition-colors">
                                <List size={18} />
                            </button>
                        </MagneticButton>
                        <button
                            id="themeBtn"
                            className="nav-icon-btn hover:text-accent transition-colors"
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        >
                            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
