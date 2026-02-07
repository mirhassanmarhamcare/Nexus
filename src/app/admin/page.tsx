"use client";

import { useState } from "react";
import Link from "next/link";
import draftsData from "@/data/drafts.json";
import productsData from "@/data/products.json";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function AdminDashboard() {
    const [publishing, setPublishing] = useState(false);
    const [message, setMessage] = useState("");

    const handlePublish = async () => {
        if (!confirm("Are you sure? This will push all DRAFTS to the LIVE SITE.")) return;

        setPublishing(true);
        setMessage("");

        try {
            const res = await fetch("/api/admin/publish", { method: "POST" });
            const data = await res.json();

            if (res.ok) {
                setMessage("Success! Changes published to live site.");
            } else {
                setMessage(`Error: ${data.error}`);
            }
        } catch (error) {
            setMessage("Failed to connect to server");
        } finally {
            setPublishing(false);
        }
    };

    return (
        <div className="text-white">
            <header className="flex justify-between items-center mb-12 border-b border-white/10 pb-8">
                <div>
                    <h1 className="text-3xl font-display uppercase tracking-widest text-[#D4AF37]">Nexus Admin</h1>
                    <p className="text-gray-500 text-sm mt-1">Staging Mode</p>
                </div>

                <div className="flex gap-4">
                    <Link
                        href="/"
                        target="_blank"
                        className="px-4 py-2 bg-zinc-900 text-white font-bold uppercase tracking-wider text-sm hover:bg-zinc-800 transition-colors border border-white/10"
                    >
                        View Live Site
                    </Link>
                    <button
                        onClick={handlePublish}
                        disabled={publishing}
                        className="px-6 py-2 bg-[#D4AF37] text-black font-bold uppercase tracking-wider text-sm hover:bg-[#F4CF57] disabled:opacity-50 transition-colors shadow-[0_0_20px_rgba(212,175,55,0.3)] animate-pulse"
                    >
                        {publishing ? "Publishing..." : "Commit All Changes"}
                    </button>
                </div>
            </header>

            {message && (
                <div className={`mb-8 p-4 rounded ${message.includes("Success") ? "bg-green-900/50 text-green-200" : "bg-red-900/50 text-red-200"}`}>
                    {message}
                </div>
            )}

            <div className="grid grid-cols-1 gap-4 max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Drafts ({draftsData.length})</h2>
                    <span className="text-xs text-gray-500 uppercase">Edits here do not affect live site until committed</span>
                </div>

                {draftsData.map((product: any) => (
                    <Link
                        href={`/admin/product/${product.id}`}
                        key={product.id}
                        className="group flex items-center justify-between p-6 bg-zinc-900/50 border border-white/5 hover:border-[#D4AF37] transition-all rounded-lg"
                    >
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 relative bg-white/5 rounded overflow-hidden">
                                {product.images[0] && (
                                    <img
                                        src={product.images[0]}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                    />
                                )}
                            </div>
                            <div>
                                <h3 className="font-display text-lg group-hover:text-[#D4AF37] transition-colors">{product.name}</h3>
                                <p className="text-sm text-gray-500">{product.category}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-8">
                            <span className="font-mono text-[#D4AF37]">Rs. {product.price.toLocaleString()}</span>
                            {product.status === 'draft' && (
                                <span className="px-2 py-1 bg-yellow-900/50 text-yellow-200 text-[10px] uppercase tracking-wider rounded">Draft</span>
                            )}
                            <span className="px-4 py-2 border border-white/10 rounded text-xs uppercase tracking-widest group-hover:bg-white group-hover:text-black transition-all">
                                Edit
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
