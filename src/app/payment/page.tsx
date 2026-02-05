import InnerPageLayout from "@/components/layout/InnerPageLayout";

export default function PaymentPage() {
    return (
        <InnerPageLayout title="Secure Payment">
            <div className="max-w-3xl prose prose-invert">
                <p className="text-xl text-muted-foreground mb-8">Transactions on Nexus are encrypted and secure.</p>
                <section className="mb-12">
                    <h3 className="text-2xl font-display mb-4">Accepted Methods</h3>
                    <ul className="list-disc pl-5 text-muted-foreground">
                        <li className="mb-2">Major Credit Cards (Visa, Mastercard, Amex)</li>
                        <li className="mb-2">Digital Wallets (Apple Pay, Google Pay)</li>
                        <li className="mb-2">Cryptocurrency (BTC, ETH via Coinbase Commerce)</li>
                    </ul>
                </section>
                <section className="mb-12">
                    <h3 className="text-2xl font-display mb-4">Security</h3>
                    <p>We utilize industry-standard SSL encryption to protect your data. Your payment information is never stored on our servers.</p>
                </section>
            </div>
        </InnerPageLayout>
    );
}
