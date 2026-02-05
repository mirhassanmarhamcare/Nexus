import InnerPageLayout from "@/components/layout/InnerPageLayout";

export default function CareersPage() {
    return (
        <InnerPageLayout title="Careers">
            <div className="max-w-2xl">
                <p className="text-xl mb-12">We are constantly seeking visionaries to join our collective. If you believe in the convergence of art and technology, we want to hear from you.</p>

                <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-6">Open Positions</h3>

                <div className="group border-t border-white/10 py-8 cursor-pointer relative">
                    <h4 className="text-2xl font-display">Senior Frontend Engineer</h4>
                    <span className="text-sm text-muted-foreground">Remote / New York</span>
                    <span className="absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity uppercase text-xs tracking-widest">Apply</span>
                </div>
                <div className="group border-t border-white/10 py-8 cursor-pointer relative">
                    <h4 className="text-2xl font-display">Art Director</h4>
                    <span className="text-sm text-muted-foreground">Paris</span>
                    <span className="absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity uppercase text-xs tracking-widest">Apply</span>
                </div>
                <div className="group border-t border-b border-white/10 py-8 cursor-pointer relative">
                    <h4 className="text-2xl font-display">Operations Manager</h4>
                    <span className="text-sm text-muted-foreground">London</span>
                    <span className="absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity uppercase text-xs tracking-widest">Apply</span>
                </div>
            </div>
        </InnerPageLayout>
    );
}
