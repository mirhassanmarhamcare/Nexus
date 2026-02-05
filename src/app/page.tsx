import Navbar from "@/components/navbar/Navbar";
import Hero from "@/components/hero/Hero";
import FeaturesSection from "@/components/sections/FeaturesSection";
import Marquee from "@/components/marquee/Marquee";
import FlashSection from "@/components/sections/FlashSection";
import CategoriesSection from "@/components/sections/CategoriesSection";
// import BestDealsSection from "@/components/sections/BestDealsSection";
import TopSellersSection from "@/components/sections/TopSellersSection";
import CTASection from "@/components/sections/CTASection";
import Footer from "@/components/sections/Footer";
import Loader from "@/components/ui/Loader";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Loader />
      <Navbar />
      <Hero />
      <FeaturesSection />
      <Marquee />
      <FlashSection />
      <CategoriesSection />
      {/* <BestDealsSection /> removed by user request */}
      <TopSellersSection />
      <CTASection />
      <Footer />
    </main>
  );
}
