export default function Loading() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-1 bg-white/10 overflow-hidden relative">
                    <div className="absolute inset-0 bg-accent w-full animate-[shimmer_1.5s_infinite_ease-in-out_translateX(-100%)]" />
                </div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground animate-pulse">
                    Loading Nexus
                </p>
            </div>
        </div>
    );
}
