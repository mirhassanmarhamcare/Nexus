import InnerPageLayout from "@/components/layout/InnerPageLayout";

export default function ServicePage() {
    return (
        <InnerPageLayout title="Client Services">
            <div className="grid md:grid-cols-2 gap-12">
                <div>
                    <h3 className="text-2xl font-display mb-4">Personal Shopping</h3>
                    <p className="text-muted-foreground mb-8">Our advisors are available to assist with styling advice, gift selection, and sizing queries.</p>
                    <button className="border border-white/20 px-6 py-3 uppercase text-sm hover:bg-white/10 transition-colors">Book Appointment</button>
                </div>
                <div>
                    <h3 className="text-2xl font-display mb-4">Care Instructions</h3>
                    <p className="text-muted-foreground">To ensure longevity, we recommend professional cleaning for all garments. Store in a cool, dry place away from direct sunlight.</p>
                </div>
                <div>
                    <h3 className="text-2xl font-display mb-4">Contact</h3>
                    <p className="text-muted-foreground">Email: concierge@nexus.com</p>
                    <p className="text-muted-foreground">Phone: +1 (800) 555-0199</p>
                </div>
            </div>
        </InnerPageLayout>
    );
}
