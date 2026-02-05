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
                <div className="nav-left">
                    <Link
                        href="/contact"
                        className="contact-link hoverable cursor-none"
                    >
                        <Plus size={14} /> <span className="hidden md:inline">Contact Us</span>
                    </Link>
                </div>

                {/* Center */}
                <div className="nav-center">
                    {!isHome ? (
                        <Link href="/" className="font-display text-2xl font-bold tracking-widest hover:text-accent transition-colors uppercase">
                            NEXUS
                        </Link>
                    ) : (

                        <div id="logo-dest" className="logo-placeholder"></div>
                    )}
                </div>

                {/* Right */}
                <div className="nav-right">
                    <div className="nav-icons">
                        <MagneticButton onClick={toggleCart}>
                            <button
                                className="nav-icon-btn hoverable cursor-none relative"
                            >
                                <Handbag size={20} />
                                {cartCount > 0 && (
                                    <span id="cart-count" className="cart-badge flex items-center justify-center">
                                        {cartCount}
                                    </span>
                                )}
                            </button>
                        </MagneticButton>
                        <MagneticButton onClick={toggleAuth}>
                            <button
                                className="nav-icon-btn hoverable cursor-none hidden sm:flex"
                            >
                                <User size={20} />
                            </button>
                        </MagneticButton>
                        <MagneticButton onClick={toggleSearch}>
                            <button
                                className="nav-icon-btn hoverable cursor-none hidden sm:flex"
                            >
                                <MagnifyingGlass size={20} />
                            </button>
                        </MagneticButton>
                        <button
                            id="themeBtn"
                            className="nav-icon-btn hoverable cursor-none"
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        >
                            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                    </div>
                    <MagneticButton onClick={toggleMenu}>
                        <div
                            className="menu-btn hoverable cursor-none"
                        >
                            <List size={20} />
                            <span className="hidden sm:inline">MENU</span>
                        </div>
                    </MagneticButton>
                </div>
            </div>
        </nav>
    );
}
