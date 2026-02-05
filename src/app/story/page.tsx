import InnerPageLayout from "@/components/layout/InnerPageLayout";

export default function StoryPage() {
    return (
        <InnerPageLayout title="Our Story">
            <div className="max-w-4xl mx-auto text-center space-y-12">
                <p className="text-2xl md:text-4xl font-display leading-tight">
                    Nexus was born from a desire to strip away the noise. In a world of excess, we seek the essential.
                </p>
                <div className="h-[1px] w-24 bg-white/20 mx-auto"></div>
                <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                    Founded in 2024, our atelier brings together artisans and engineers. We do not just design products; we architect experiences. Every stitch, every pixel, every interaction is considered.
                    <br /><br />
                    We believe in the power of minimalism not as an aesthetic choices, but as a philosophy of living. By removing the non-essential, we amplify what remains.
                </p>

                <div className="grid md:grid-cols-3 gap-8 mt-24 text-left">
                    <div className="p-6 border border-white/5 bg-white/5 backdrop-blur-sm">
                        <span className="text-4xl font-display text-accent mb-4 block">01</span>
                        <h4 className="text-lg uppercase mb-2">Precision</h4>
                        <p className="text-sm text-muted-foreground">Uncompromising attention to detail in every aspect of production.</p>
                    </div>
                    <div className="p-6 border border-white/5 bg-white/5 backdrop-blur-sm">
                        <span className="text-4xl font-display text-accent mb-4 block">02</span>
                        <h4 className="text-lg uppercase mb-2">Utility</h4>
                        <p className="text-sm text-muted-foreground">Form follows function. Beauty is found in usefulness.</p>
                    </div>
                    <div className="p-6 border border-white/5 bg-white/5 backdrop-blur-sm">
                        <span className="text-4xl font-display text-accent mb-4 block">03</span>
                        <h4 className="text-lg uppercase mb-2">Timelessness</h4>
                        <p className="text-sm text-muted-foreground">Design that transcends trends and endures for generations.</p>
                    </div>
                </div>
            </div>
        </InnerPageLayout>
    );
}
