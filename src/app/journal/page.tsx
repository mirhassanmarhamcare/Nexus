import InnerPageLayout from "@/components/layout/InnerPageLayout";

export default function JournalPage() {
    return (
        <InnerPageLayout title="Journal">
            <div className="grid gap-12">
                {/* Article 1 */}
                <article className="group cursor-pointer">
                    <div className="aspect-[21/9] bg-white/5 mb-6 overflow-hidden relative">
                        {/* Placeholder for blog image */}
                        <div className="absolute inset-0 bg-neutral-800 flex items-center justify-center text-muted-foreground">Image Placeholder</div>
                    </div>
                    <div className="flex justify-between items-baseline mb-2">
                        <h2 className="text-3xl font-display group-hover:text-accent transition-colors">The Architecture of Silence</h2>
                        <span className="text-xs uppercase tracking-widest text-muted-foreground">Architecture</span>
                    </div>
                    <p className="text-muted-foreground max-w-2xl">Exploring the role of negative space in modern brutalist structures and its influence on our latest collection.</p>
                </article>

                {/* Article 2 */}
                <article className="group cursor-pointer">
                    <div className="aspect-[21/9] bg-white/5 mb-6 overflow-hidden relative">
                        {/* Placeholder for blog image */}
                        <div className="absolute inset-0 bg-neutral-800 flex items-center justify-center text-muted-foreground">Image Placeholder</div>
                    </div>
                    <div className="flex justify-between items-baseline mb-2">
                        <h2 className="text-3xl font-display group-hover:text-accent transition-colors">Material Science: Graphene Weave</h2>
                        <span className="text-xs uppercase tracking-widest text-muted-foreground">Innovation</span>
                    </div>
                    <p className="text-muted-foreground max-w-2xl">How we are integrating aerospace-grade materials into everyday functional wear.</p>
                </article>
            </div>
        </InnerPageLayout>
    );
}
