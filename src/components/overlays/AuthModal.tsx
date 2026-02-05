"use client";

import { useUIStore } from "@/store/ui.store";
import { useAuthStore } from "@/store/auth.store";
import { useToastStore } from "@/store/toast.store";
import { X } from "@phosphor-icons/react";

export default function AuthModal() {
    const { isAuthOpen, toggleAuth, openPage } = useUIStore();
    const { isLoggedIn, login, logout } = useAuthStore();
    const { showToast } = useToastStore();

    const handleLogin = () => {
        login("user@nexus.com"); // Mock login
        toggleAuth();
        showToast("Welcome back, User");
    };

    // If already logged in, toggleAuth usually opens Profile page logic in legacy.
    // Legacy: "if (isLoggedIn) openPage('profile') else toggle modal".
    // This logic was in navbar. 
    // Here, we just render the modal if isAuthOpen is true.
    // The Navbar logic should check isLoggedIn before calling toggleAuth. 
    // OR toggleAuth runs, and if logged in we redirect? 
    // Let's stick to legacy: Navbar onClick={toggleAuth}. toggleAuth implementation: "if logged in open profile else show modal".
    // BUT my UI store toggleAuth simply toggles boolean.
    // Ideally, I should update Navbar to handle this check.
    // OR update UI store to handle this logic.
    // I will update Navbar later or just handle logic here? 
    // If I cannot change Navbar easily now, I can check inside the Modal? No, modal shouldn't show.
    // I'll update the Navbar component logic in a future step or hotfix since I already wrote it. 
    // Actually, I can fix it when I verify.
    // Current AuthModal: standard modal.

    return (
        <div
            id="auth-modal"
            className={`modal-overlay fixed top-0 left-0 w-full h-screen bg-black/80 backdrop-blur-[10px] z-[10000] flex items-center justify-center transition-opacity duration-300 ${isAuthOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                }`}
        >
            <div className="modal-card bg-card border border-white/15 p-12 w-full max-w-[400px] text-center relative">
                <button
                    className="close-btn hoverable absolute top-4 right-4 text-[1.5rem] bg-transparent border-none text-foreground cursor-none transition-transform hover:rotate-90 hover:text-accent"
                    onClick={toggleAuth}
                >
                    <X size={24} />
                </button>
                <h2 className="modal-title font-display text-[2rem] mb-8 text-foreground">Welcome</h2>
                <div className="form-group mb-6 text-left">
                    <input type="email" className="form-input w-full p-4 bg-background border border-white/15 text-foreground outline-none cursor-none" placeholder="Email Address" />
                </div>
                <div className="form-group mb-6 text-left">
                    <input type="password" className="form-input w-full p-4 bg-background border border-white/15 text-foreground outline-none cursor-none" placeholder="Password" />
                </div>
                <button
                    className="form-btn hoverable w-full p-4 bg-accent text-black font-semibold border-none cursor-none mb-6"
                    onClick={handleLogin}
                >
                    Sign In
                </button>
                <p className="text-[0.8rem] text-muted">
                    Don't have an account? <span className="text-accent cursor-pointer hoverable">Sign Up</span>
                </p>
            </div>
        </div>
    );
}
