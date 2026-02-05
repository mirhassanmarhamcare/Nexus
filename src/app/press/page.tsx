import InnerPageLayout from "@/components/layout/InnerPageLayout";

export default function PressPage() {
    return (
        <InnerPageLayout title="Press & Media">
            <div className="grid gap-8">
                <div className="border-b border-white/10 pb-8">
                    <span className="text-xs uppercase tracking-widest text-muted-foreground">Feb 2026</span>
                    <h3 className="text-3xl font-display mt-2 hover:text-accent cursor-pointer transition-colors">Vogue: "The Future of Digital Commerce"</h3>
                    <p className="mt-4 text-muted-foreground">Nexus featured in editorial coverage regarding the shift towards immersive web experiences.</p>
                </div>
                <div className="border-b border-white/10 pb-8">
                    <span className="text-xs uppercase tracking-widest text-muted-foreground">Jan 2026</span>
                    <h3 className="text-3xl font-display mt-2 hover:text-accent cursor-pointer transition-colors">Wired: "Minimalism Engineers"</h3>
                    <p className="mt-4 text-muted-foreground">An interview with our design team on the philosophy of 'Engineered Elegance'.</p>
                </div>
                <div className="mt-8">
                    <p className="text-sm uppercase tracking-widest text-muted-foreground">Inquiries: press@nexus.com</p>
                </div>
            </div>
        </InnerPageLayout>
    );
}
