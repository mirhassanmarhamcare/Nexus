"use client";

import { useUIStore } from "@/store/ui.store";
import { useCartStore } from "@/store/cart.store";
import { useToastStore } from "@/store/toast.store";
import { X, Trash } from "@phosphor-icons/react";
import { useLenis } from "@studio-freight/react-lenis";
import { useEffect } from "react";

export default function CartOverlay() {
    const { isCartOpen, toggleCart } = useUIStore();
    const { items, removeFromCart, total } = useCartStore();
    const { showToast } = useToastStore();
    const lenis = useLenis();

    useEffect(() => {
        if (lenis) {
            if (isCartOpen) lenis.stop();
            else lenis.start();
        }
        return () => {
            if (lenis) lenis.start();
        };
    }, [isCartOpen, lenis]);


    return (
        <div
            id="cart-overlay"
            className={`overlay-container fixed top-0 right-0 h-screen bg-card z-[9999] transition-transform duration-500 ease-[cubic-bezier(0.77,0,0.175,1)] p-8 md:p-16 flex flex-col w-full md:max-w-[500px] border-l border-white/15 ${isCartOpen ? "translate-x-0 pointer-events-auto" : "translate-x-[100%] pointer-events-none"
                }`}
        >
            <div className="overlay-header flex justify-between items-center mb-16">
                <h2 className="overlay-title font-display text-[3rem] text-foreground">Your Cart</h2>
                <button
                    className="close-btn hoverable bg-transparent border-none text-foreground text-[2rem] cursor-none transition-transform duration-300 hover:rotate-90 hover:text-accent"
                    onClick={toggleCart}
                >
                    <X size={32} />
                </button>
            </div>

            <div className="cart-items flex-grow flex flex-col gap-8 overflow-y-auto">
                {items.length === 0 ? (
                    <p className="text-muted text-center mt-8">Your cart is empty.</p>
                ) : (
                    items.map((item, index) => (
                        <div key={index} className="cart-item flex gap-4 items-center border-b border-white/15 pb-4">
                            <div className="cart-item-img w-[80px] h-[80px] relative bg-[#222] rounded-[4px] overflow-hidden shrink-0">
                                {item.img && (
                                    <img
                                        src={item.img}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                    />
                                )}
                            </div>
                            <div className="cart-item-info">
                                <h4 className="text-[1rem] mb-[0.2rem] font-display uppercase tracking-wider">{item.name}</h4>
                                <p className="text-accent text-sm">Rs. {item.price.toLocaleString()}</p>
                            </div>
                            <button
                                className="hoverable ml-auto bg-transparent border-none text-danger cursor-none opacity-50 hover:opacity-100 transition-opacity"
                                onClick={() => removeFromCart(index)}
                            >
                                <Trash size={20} />
                            </button>
                        </div>
                    ))
                )}
            </div>

            <div className="cart-footer mt-auto border-t border-white/15 pt-8">
                <div className="cart-total flex justify-between text-[1.5rem] mb-8 font-display">
                    <span>Total</span>
                    <span>Rs. {total().toLocaleString()}</span>
                </div>
                <button
                    className="checkout-btn hoverable w-full bg-foreground text-background p-4 font-semibold uppercase border-none cursor-none"
                    onClick={() => {
                        toggleCart();
                        setTimeout(() => useUIStore.getState().toggleCheckout(), 300); // Slight delay for smooth transition
                    }}
                >
                    Checkout
                </button>
            </div>
        </div>
    );
}
