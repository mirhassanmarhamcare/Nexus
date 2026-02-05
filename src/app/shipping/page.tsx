import InnerPageLayout from "@/components/layout/InnerPageLayout";

export default function ShippingPage() {
    return (
        <InnerPageLayout title="Shipping & Returns">
            <div className="max-w-3xl prose prose-invert">
                <section className="mb-12">
                    <h3 className="text-2xl font-display mb-4">Global Delivery</h3>
                    <p>We offer complimentary express shipping on all orders over $500. All shipments are insured and require signature upon delivery.</p>
                </section>
                <section className="mb-12">
                    <h3 className="text-2xl font-display mb-4">Returns</h3>
                    <p>Items may be returned within 14 days of receipt. Products must be in original condition with all tags attached.</p>
                </section>
                <section className="mb-12">
                    <h3 className="text-2xl font-display mb-4">Custom & Duties</h3>
                    <p>International orders may be subject to import duties and taxes, which are the responsibility of the recipient.</p>
                </section>
            </div>
        </InnerPageLayout>
    );
}
