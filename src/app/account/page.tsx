"use client";

import InnerPageLayout from "@/components/layout/InnerPageLayout";
import { useUIStore } from "@/store/ui.store";
import { useEffect } from "react";

export default function AccountPage() {
    const { isAuthOpen, toggleAuth } = useUIStore();

    // If not logged in, trigger auth modal (simulation)
    useEffect(() => {
        // Simulating checking auth state
        const isLoggedIn = false;
        if (!isLoggedIn && !isAuthOpen) {
            // We could trigger toggleAuth() here, but for a page rework, let's just show a login form inline
        }
    }, []);

    return (
        <InnerPageLayout title="Account">
            <div className="max-w-md mx-auto border border-white/10 p-8 bg-card">
                <h3 className="text-xl font-display mb-6">Sign In</h3>
                <form className="space-y-4">
                    <div>
                        <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Email</label>
                        <input type="email" className="w-full bg-background border border-white/10 p-3 focus:border-accent outline-none" />
                    </div>
                    <div>
                        <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Password</label>
                        <input type="password" className="w-full bg-background border border-white/10 p-3 focus:border-accent outline-none" />
                    </div>
                    <button className="w-full bg-foreground text-background py-3 uppercase tracking-widest text-sm font-bold hovering-invert transition-colors">
                        Access Account
                    </button>
                    <div className="text-center mt-4">
                        <a href="#" className="text-xs text-muted-foreground hover:text-white">Forgot Password?</a>
                    </div>
                </form>
            </div>
        </InnerPageLayout>
    );
}
