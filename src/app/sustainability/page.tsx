import InnerPageLayout from "@/components/layout/InnerPageLayout";

export default function SustainabilityPage() {
    return (
        <InnerPageLayout title="Sustainability">
            <div className="grid md:grid-cols-2 gap-16 items-start">
                <div className="prose prose-invert">
                    <p className="text-xl">Our commitment to the environment is absolute. We do not view sustainability as a feature, but as the baseline of modern production.</p>
                    <p>Every material is traced. Every process is optimized for minimal impact. We believe in slow fashion—creating objects that endure for decades, not seasons.</p>
                </div>
                <div className="space-y-8">
                    <div className="bg-white/5 p-8 border border-white/10">
                        <h4 className="text-lg font-display mb-2">Carbon Neutral</h4>
                        <p className="text-sm text-muted-foreground">All shipments and operations are 100% carbon offset through our reforestation partners.</p>
                    </div>
                    <div className="bg-white/5 p-8 border border-white/10">
                        <h4 className="text-lg font-display mb-2">Circular Economy</h4>
                        <p className="text-sm text-muted-foreground">Our 'Archive' program allows you to return any Nexus item for refurbishment or recycling in exchange for credit.</p>
                    </div>
                </div>
            </div>
        </InnerPageLayout>
    );
}
