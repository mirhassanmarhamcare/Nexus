"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminLogin() {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Simple client-side check for demo purposes (In real app, use API/Server Action)
        // For this specific architecture, we set a cookie via server action or API
        try {
            const res = await fetch("/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            });

            if (res.ok) {
                router.push("/admin");
            } else {
                setError("Invalid password");
            }
        } catch (err) {
            setError("Something went wrong");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white">
            <div className="w-full max-w-md p-8 border border-white/10 rounded-lg bg-zinc-900/50 backdrop-blur-md">
                <div className="flex justify-center mb-8">
                    <h1 className="text-2xl font-display uppercase tracking-widest text-[#D4AF37]">Nexus Admin</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">Access Key</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-black/50 border border-white/10 p-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#D4AF37] transition-colors"
                            placeholder="Enter admin password"
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <button
                        type="submit"
                        className="w-full bg-[#D4AF37] text-black font-bold uppercase tracking-widest py-4 hover:bg-[#F4CF57] transition-colors"
                    >
                        Enter System
                    </button>
                </form>
            </div>
        </div>
    );
}
