"use client";

import InnerPageLayout from "@/components/layout/InnerPageLayout";
import { productsDB } from "@/data/products";

export default function ArchivePage() {
    // Filter for maybe "old" items, or just show everything in grayscale for effect
    return (
        <InnerPageLayout title="The Archive">
            <div className="mb-8 p-4 bg-accent/10 border border-accent/20 text-accent text-sm">
                <span className="font-bold">Note:</span> Archive items are available for reference only.
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
                {productsDB.map((product) => (
                    <div key={product.id} className="group cursor-not-allowed">
                        <div className="aspect-square bg-white/5 mb-2 relative">
                            {/* Image would go here */}
                            <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">Sold Out</div>
                        </div>
                        <h4 className="font-mono text-xs uppercase">{product.name}</h4>
                        <span className="text-[10px] text-muted-foreground">Season 01</span>
                    </div>
                ))}
            </div>
        </InnerPageLayout>
    );
}
