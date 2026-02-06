"use client";

import { useEffect } from "react";
import { ArrowClockwise } from "@phosphor-icons/react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground px-6">
            <div className="text-center max-w-lg">
                <h2 className="text-3xl font-display mb-4">System Anomaly Detected</h2>
                <p className="text-muted-foreground mb-8">
                    We encountered an unexpected error while processing your request. Our engineers have been notified.
                </p>
                <button
                    onClick={reset}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all group"
                >
                    <ArrowClockwise className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                    <span className="text-sm uppercase tracking-widest">Reinitialize</span>
                </button>
            </div>
        </div>
    );
}
