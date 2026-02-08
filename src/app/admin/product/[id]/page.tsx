"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
// Removed static import of draftsData
import ProductForm from "@/components/admin/ProductForm";
import { Product } from "@/data/products";

export default function EditProduct({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {
        // Fetch product dynamically
        async function fetchProduct() {
            try {
                const res = await fetch(`/api/admin/get-product?id=${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setProduct(data);
                } else {
                    setMessage("Product not found");
                }
            } catch (err) {
                setMessage("Failed to load product");
            } finally {
                setInitialLoading(false);
            }
        }

        if (id) {
            fetchProduct();
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
    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this product?")) return;
        setLoading(true);
        try {
            const res = await fetch("/api/admin/delete-product", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });
            if (res.ok) {
                router.push("/admin");
            } else {
                setMessage("Failed to delete product");
            }
        } catch (err) {
            setMessage("Error connecting to server");
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) return <div className="p-8 text-white">Loading product...</div>;
    if (!product) return <div className="p-8 text-white">Product not found. <Link href="/admin" className="text-[#D4AF37] underline">Go Back</Link></div>;

    return (
        <div>
            <header className="flex justify-between items-center mb-12 border-b border-white/10 pb-8 sticky top-0 bg-black/80 backdrop-blur z-10 transition-all">
                <div className="flex items-center gap-4">
                    <Link href="/admin" className="text-gray-400 hover:text-white transition-colors">&larr; Back</Link>
                    <h1 className="text-2xl font-display uppercase tracking-widest text-[#D4AF37]">
                        Edit Product <span className="text-gray-500 text-sm ml-2">(Draft)</span>
                    </h1>
                </div>
                <button
                    onClick={handleDelete}
                    disabled={loading}
                    className="px-4 py-2 bg-red-900/20 text-red-500 hover:bg-red-900/50 hover:text-red-400 border border-red-900/50 rounded text-xs font-bold uppercase tracking-wider transition-all"
                >
                    {loading ? "Deleting..." : "Delete Product"}
                </button>
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
