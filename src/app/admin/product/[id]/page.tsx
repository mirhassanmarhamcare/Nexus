"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import draftsData from "@/data/drafts.json"; // Read from drafts
import ProductForm from "@/components/admin/ProductForm";
import { Product } from "@/data/products";

export default function EditProduct({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        // Find product from JSON data
        // Only cast if needed, but our imported JSON is typed as any by TS usually
        const found = (draftsData as any[]).find((p: any) => p.id === id);
        if (found) {
            setProduct(found as Product);
        } else {
            setMessage("Product not found in drafts");
        }
    }, [id]);

    const handleSave = async (updatedProduct: Product) => {
        setLoading(true);
        setMessage("");

        try {
            const res = await fetch("/api/admin/save-product", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedProduct),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage("Success! Draft saved.");
            } else {
                setMessage(`Error: ${data.error || "Failed to save"}`);
            }
        } catch (err) {
            setMessage("Error connecting to server");
        } finally {
            setLoading(false);
        }
    };

    if (!product) return <div className="p-8 text-white">Loading...</div>;

    return (
        <div>
            <header className="flex justify-between items-center mb-12 border-b border-white/10 pb-8 sticky top-0 bg-black/80 backdrop-blur z-10">
                <div className="flex items-center gap-4">
                    <Link href="/admin" className="text-gray-400 hover:text-white">&larr; Back</Link>
                    <h1 className="text-2xl font-display uppercase tracking-widest text-[#D4AF37]">
                        Edit Product <span className="text-gray-500 text-sm ml-2">(Draft)</span>
                    </h1>
                </div>
            </header>

            {message && (
                <div className={`mb-8 p-4 rounded ${message.includes("Success") ? "bg-green-900/50 text-green-200" : "bg-red-900/50 text-red-200"}`}>
                    {message}
                </div>
            )}

            <div className="max-w-4xl mx-auto">
                <ProductForm
                    initialProduct={product}
                    onSave={handleSave}
                    loading={loading}
                />
            </div>
        </div>
    );
}
