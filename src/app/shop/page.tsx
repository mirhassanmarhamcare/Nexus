"use client";

import InnerPageLayout from "@/components/layout/InnerPageLayout";
import { productsDB } from "@/data/products";
import { useUIStore } from "@/store/ui.store";
import Image from "next/image";

export default function ShopPage() {
    const { openProduct } = useUIStore();

    return (
        <InnerPageLayout title="The Collection">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-12">
                {productsDB.map((product) => (
                    <div key={product.id} className="group cursor-pointer" onClick={() => openProduct(product)}>
                        <div className="aspect-[3/4] overflow-hidden mb-4 relative bg-card">
                            <Image
                                src={product.img.startsWith('/') ? product.img : `/${product.img}`}
                                alt={product.name}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <span className="px-6 py-2 bg-white/10 backdrop-blur-md border border-white/20 uppercase text-xs tracking-widest text-white">View</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-display text-lg uppercase tracking-wide group-hover:text-accent transition-colors">{product.name}</h3>
                                <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">{product.category}</p>
                            </div>
                            <span className="font-mono text-sm opacity-60">${product.price}</span>
                        </div>
                    </div>
                ))}
            </div>
        </InnerPageLayout>
    );
}
