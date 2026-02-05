import InnerPageLayout from "@/components/layout/InnerPageLayout";

export default function LegalPage() {
    return (
        <InnerPageLayout title="Legal & Privacy">
            <div className="max-w-3xl prose prose-invert">
                <p className="text-xl text-muted-foreground mb-8">Effective Date: February 2026</p>
                <section className="mb-12">
                    <h3 className="text-2xl font-display mb-4">Terms of Service</h3>
                    <p>By accessing or using the Nexus platform, you agree to be bound by these terms. We reserve the right to modify these terms at any time.</p>
                </section>
                <section className="mb-12">
                    <h3 className="text-2xl font-display mb-4">Privacy Policy</h3>
                    <p>We respect your privacy. Data collection is limited to what is necessary for transaction processing and improving your experience. We do not sell your data.</p>
                </section>
                <section className="mb-12">
                    <h3 className="text-2xl font-display mb-4">Cookie Policy</h3>
                    <p>We use cookies to enhance navigation and analyze site usage. By continuing to use this site, you consent to our use of cookies.</p>
                </section>
            </div>
        </InnerPageLayout>
    );
}
