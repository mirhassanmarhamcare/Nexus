"use client";

import { useUIStore } from "@/store/ui.store";
import { useCartStore } from "@/store/cart.store";
import { useAuthStore } from "@/store/auth.store";
import { useToastStore } from "@/store/toast.store";
import { X, CheckCircle, CreditCard, SpinnerGap } from "@phosphor-icons/react";
import { useLenis } from "@studio-freight/react-lenis";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function CheckoutOverlay() {
    const { isCheckoutOpen, toggleCheckout } = useUIStore();
    const { total, clearCart, items } = useCartStore();
    const { user } = useAuthStore(); // We can pass user email/id
    const { showToast } = useToastStore();
    const lenis = useLenis();
    const containerRef = useRef<HTMLDivElement>(null);
    const [step, setStep] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderId, setOrderId] = useState<string>("");

    // Form State
    const [shipping, setShipping] = useState({
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        postalCode: ""
    });

    // Lock scroll when overlay is open
    useEffect(() => {
        if (lenis) {
            if (isCheckoutOpen) lenis.stop();
            else lenis.start();
        }
        return () => {
            if (lenis) lenis.start();
        };
    }, [isCheckoutOpen, lenis]);


    useGSAP(() => {
        if (isCheckoutOpen) {
            setStep(1); // Reset step on open
            setIsProcessing(false);
            setOrderId("");
        }
    }, { scope: containerRef, dependencies: [isCheckoutOpen] });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setShipping({ ...shipping, [e.target.name]: e.target.value });
    };

    const nextStep = async () => {
        if (step === 1) {
            if (!shipping.firstName || !shipping.address || !shipping.city) {
                showToast("Please complete shipping details");
                return;
            }
            setStep(2);
        } else if (step === 2) {
            // Process Payment
            setIsProcessing(true);

            try {
                // Simulate Payment Gateway delay
                await new Promise(resolve => setTimeout(resolve, 1500));

                // Create Order on Backend
                const res = await fetch('/api/checkout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        items,
                        shipping,
                        total: total(),
                        userId: user || 'guest'
                    })
                });

                const data = await res.json();

                if (!res.ok) {
                    showToast(data.error || "Payment failed");
                    setIsProcessing(false);
                } else {
                    setOrderId(data.orderId);
                    clearCart();
                    setStep(3);
                    setIsProcessing(false);
                }

            } catch (error) {
                showToast("Payment processing error");
                setIsProcessing(false);
            }
        }
    };

    return (
        <div
            ref={containerRef}
            id="checkout-overlay"
            className={`fixed inset-0 z-[11000] flex items-center justify-center ${isCheckoutOpen ? "pointer-events-auto" : "pointer-events-none"}`}
        >
            {/* Backdrop */}
            <div
                onClick={toggleCheckout}
                className={`absolute inset-0 bg-background/80 backdrop-blur-md transition-opacity duration-500 ${isCheckoutOpen ? "opacity-100" : "opacity-0"}`}
            />

            {/* Modal */}
            <div
                className={`relative w-full max-w-2xl bg-card border border-white/10 shadow-2xl p-8 md:p-12 transition-all duration-500 transform ${isCheckoutOpen ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-10 scale-95"}`}
            >
                {/* Header */}
                <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                    <h2 className="font-display text-3xl">Checkout</h2>
                    <button onClick={toggleCheckout} className="hover:text-accent transition-colors"><X size={24} /></button>
                </div>

                {/* Steps Indicator */}
                <div className="flex gap-4 mb-8 text-sm uppercase tracking-widest text-muted-foreground">
                    <span className={step === 1 ? "text-accent font-bold" : ""}>01 Shipping</span>
                    <span>/</span>
                    <span className={step === 2 ? "text-accent font-bold" : ""}>02 Payment</span>
                    <span>/</span>
                    <span className={step === 3 ? "text-accent font-bold" : ""}>03 Confirm</span>
                </div>

                {/* Step Content */}
                <div className="min-h-[300px]">
                    {step === 1 && (
                        <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-4 duration-500">
                            <h3 className="text-xl mb-4">Shipping Details</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <input name="firstName" onChange={handleInputChange} value={shipping.firstName} type="text" placeholder="First Name" className="p-4 bg-background border border-white/10 outline-none focus:border-accent transition-colors" />
                                <input name="lastName" onChange={handleInputChange} value={shipping.lastName} type="text" placeholder="Last Name" className="p-4 bg-background border border-white/10 outline-none focus:border-accent transition-colors" />
                            </div>
                            <input name="address" onChange={handleInputChange} value={shipping.address} type="text" placeholder="Address" className="p-4 bg-background border border-white/10 outline-none focus:border-accent transition-colors" />
                            <div className="grid grid-cols-2 gap-4">
                                <input name="city" onChange={handleInputChange} value={shipping.city} type="text" placeholder="City" className="p-4 bg-background border border-white/10 outline-none focus:border-accent transition-colors" />
                                <input name="postalCode" onChange={handleInputChange} value={shipping.postalCode} type="text" placeholder="Postal Code" className="p-4 bg-background border border-white/10 outline-none focus:border-accent transition-colors" />
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-4 duration-500">
                            <h3 className="text-xl mb-4">Payment Method</h3>
                            <div className="p-6 border border-zinc-700 bg-zinc-900/50 rounded-lg mb-4 flex items-center gap-4">
                                <CreditCard size={32} className="text-accent" />
                                <div>
                                    <p className="font-mono">**** **** **** 4242</p>
                                    <p className="text-xs text-muted-foreground">Expires 12/28</p>
                                </div>
                            </div>
                            <input type="text" placeholder="Card Number" className="p-4 bg-background border border-white/10 outline-none focus:border-accent transition-colors" />
                            <div className="grid grid-cols-2 gap-4">
                                <input type="text" placeholder="MM/YY" className="p-4 bg-background border border-white/10 outline-none focus:border-accent transition-colors" />
                                <input type="text" placeholder="CVC" className="p-4 bg-background border border-white/10 outline-none focus:border-accent transition-colors" />
                            </div>
                            <div className="mt-4 flex justify-between text-xl font-display">
                                <span>Total to Pay:</span>
                                <span>${total()}</span>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="flex flex-col items-center justify-center p-8 gap-6 animate-in fade-in zoom-in duration-500 text-center">
                            <CheckCircle size={80} className="text-accent" weight="fill" />
                            <h3 className="text-3xl font-display">Order Confirmed</h3>
                            <p className="text-muted-foreground">Thank you for your purchase. A confirmation email has been sent to you.</p>
                            <p className="font-mono text-sm border border-white/10 p-2 px-4 rounded-full">Order #{orderId}</p>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="mt-8 pt-8 border-t border-white/10 flex justify-end">
                    {step < 3 ? (
                        <button
                            onClick={nextStep}
                            disabled={isProcessing}
                            className="bg-foreground text-background px-8 py-4 uppercase tracking-widest font-semibold hover:bg-accent hover:text-foreground transition-all disabled:opacity-50 min-w-[200px] flex justify-center"
                        >
                            {isProcessing ? <SpinnerGap size={24} className="animate-spin" /> : (step === 2 ? `Pay $${total()}` : "Continue")}
                        </button>
                    ) : (
                        <button
                            onClick={toggleCheckout}
                            className="bg-accent text-foreground px-8 py-4 uppercase tracking-widest font-semibold hover:bg-white transition-all min-w-[200px]"
                        >
                            Close
                        </button>
                    )}
                </div>

            </div>
        </div>
    );
}
