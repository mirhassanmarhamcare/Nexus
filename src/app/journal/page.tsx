import InnerPageLayout from "@/components/layout/InnerPageLayout";

const articles = [
    {
        title: "The Architecture of Silence",
        category: "Architecture",
        excerpt: "Exploring the role of negative space in modern brutalist structures and its influence on our latest collection.",
        date: "Feb 06, 2026",
        image: "bg-neutral-800"
    },
    {
        title: "Material Science: Graphene Weave",
        category: "Innovation",
        excerpt: "How we are integrating aerospace-grade materials into everyday functional wear.",
        date: "Jan 28, 2026",
        image: "bg-stone-900"
    },
    {
        title: "Digital Artifacts in Physical Spaces",
        category: "Technology",
        excerpt: "Blurring the lines between the metaverse and retail environments through augmented reality.",
        date: "Jan 15, 2026",
        image: "bg-slate-900"
    },
    {
        title: "Sustainable Luxury: A Paradox?",
        category: "Sustainability",
        excerpt: "Redefining what it means to be exclusive in an age of necessary conservation.",
        date: "Dec 10, 2025",
        image: "bg-zinc-800"
    }
];

export default function JournalPage() {
    return (
        <InnerPageLayout title="Journal">
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-20">
                {articles.map((article, index) => (
                    <article key={index} className="group cursor-pointer flex flex-col h-full">
                        <div className={`aspect-[4/3] ${article.image} mb-8 overflow-hidden relative w-full`}>
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                            <div className="absolute inset-0 flex items-center justify-center text-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 font-display text-4xl">
                                Read
                            </div>
                        </div>

                        <div className="flex flex-col flex-grow">
                            <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-4 gap-4">
                                <span className="text-xs uppercase tracking-widest text-accent">{article.category}</span>
                                <span className="text-xs text-muted-foreground tabular-nums">{article.date}</span>
                            </div>

                            <h2 className="text-3xl font-display mb-4 group-hover:text-accent transition-colors leading-tight">
                                {article.title}
                            </h2>

                            <p className="text-muted-foreground leading-relaxed flex-grow">
                                {article.excerpt}
                            </p>

                            <div className="mt-6 inline-flex items-center text-xs uppercase tracking-widest text-white/50 group-hover:text-white transition-colors">
                                Read Article
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </InnerPageLayout>
    );
}
