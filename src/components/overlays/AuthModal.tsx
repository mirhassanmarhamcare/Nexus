"use client";

import { useUIStore } from "@/store/ui.store";
import { useAuthStore } from "@/store/auth.store";
import { useToastStore } from "@/store/toast.store";
import { X, SpinnerGap } from "@phosphor-icons/react";
import { useState } from "react";

export default function AuthModal() {
    const { isAuthOpen, toggleAuth } = useUIStore();
    const { login } = useAuthStore();
    const { showToast } = useToastStore();

    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");

    const handleSubmit = async () => {
        if (!email || !password) {
            showToast("Please fill in all fields");
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch('/api/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: isLogin ? 'login' : 'register',
                    email,
                    password,
                    name: !isLogin ? name : undefined
                })
            });

            const data = await res.json();

            if (!res.ok) {
                showToast(data.error || "Authentication failed");
            } else {
                login(data.user.email);
                showToast(isLogin ? "Welcome back" : "Account created");
                toggleAuth();
                // Reset form
                setEmail("");
                setPassword("");
                setName("");
            }

        } catch (error) {
            showToast("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            id="auth-modal"
            className={`modal-overlay fixed top-0 left-0 w-full h-screen bg-black/80 backdrop-blur-[10px] z-[10000] flex items-center justify-center transition-opacity duration-300 ${isAuthOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        >
            <div className="modal-card bg-card border border-white/15 p-12 w-full max-w-[400px] text-center relative">
                <button
                    className="close-btn hoverable absolute top-4 right-4 text-[1.5rem] bg-transparent border-none text-foreground cursor-none transition-transform hover:rotate-90 hover:text-accent"
                    onClick={toggleAuth}
                >
                    <X size={24} />
                </button>
                <h2 className="modal-title font-display text-[2rem] mb-8 text-foreground">
                    {isLogin ? "Welcome" : "Join Nexus"}
                </h2>

                {!isLogin && (
                    <div className="form-group mb-6 text-left">
                        <input
                            type="text"
                            className="form-input w-full p-4 bg-background border border-white/15 text-foreground outline-none cursor-none focus:border-accent transition-colors"
                            placeholder="Full Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                )}

                <div className="form-group mb-6 text-left">
                    <input
                        type="email"
                        className="form-input w-full p-4 bg-background border border-white/15 text-foreground outline-none cursor-none focus:border-accent transition-colors"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="form-group mb-6 text-left">
                    <input
                        type="password"
                        className="form-input w-full p-4 bg-background border border-white/15 text-foreground outline-none cursor-none focus:border-accent transition-colors"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button
                    className="form-btn hoverable w-full p-4 bg-accent text-black font-semibold border-none cursor-none mb-6 flex justify-center items-center gap-2"
                    onClick={handleSubmit}
                    disabled={isLoading}
                >
                    {isLoading ? <SpinnerGap className="animate-spin" size={20} /> : (isLogin ? "Sign In" : "Sign Up")}
                </button>
                <p className="text-[0.8rem] text-muted-foreground">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <span
                        className="text-accent cursor-pointer hoverable ml-2"
                        onClick={() => setIsLogin(!isLogin)}
                    >
                        {isLogin ? "Sign Up" : "Sign In"}
                    </span>
                </p>
            </div>
        </div>
    );
}
