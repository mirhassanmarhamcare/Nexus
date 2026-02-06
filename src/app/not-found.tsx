import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 text-center px-6">
                <h1 className="text-[12rem] font-display font-bold leading-none text-accent/20 select-none">
                    404
                </h1>
                <h2 className="text-4xl md:text-5xl font-display mt-[-1rem] mb-6">
                    Lost in the Nexus
                </h2>
                <p className="text-lg text-muted-foreground max-w-md mx-auto mb-12">
                    The coordinates you are looking for do not exist within our current architecture.
                </p>

                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm uppercase tracking-widest hover:text-accent transition-colors group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Return to Base
                </Link>
            </div>
        </div>
    );
}
