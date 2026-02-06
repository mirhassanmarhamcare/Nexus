import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import BackgroundGradients from "@/components/ui/BackgroundGradients";
import CustomCursor from "@/components/ui/CustomCursor";
import GrainOverlay from "@/components/ui/GrainOverlay";
import ThemeSync from "@/components/ui/ThemeSync";
import Toast from "@/components/ui/Toast";
import SmoothScroll from "@/components/ui/SmoothScroll";
import CartOverlay from "@/components/overlays/CartOverlay";
import SearchOverlay from "@/components/overlays/SearchOverlay";
import AuthModal from "@/components/overlays/AuthModal";
import MenuOverlay from "@/components/overlays/MenuOverlay";
import ProductDetailOverlay from "@/components/overlays/ProductDetailOverlay";
import CheckoutOverlay from "@/components/overlays/CheckoutOverlay";
import Preloader from "@/components/ui/Preloader";

const inter = Inter({ subsets: ["latin"], variable: "--font-main" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-display" });

export const metadata: Metadata = {
  title: "NEXUS | Luxury Commerce",
  description: "Luxury Defined.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light" className={`${inter.variable} ${playfair.variable}`}>
      <body className="antialiased bg-background text-foreground overflow-x-hidden selection:bg-accent selection:text-black">
        <SmoothScroll>
          <div className="relative">
            {/* Global UI */}
            <CustomCursor />
            <GrainOverlay />
            <ThemeSync />
            <BackgroundGradients />
            <Toast />

            {/* Overlays */}
            <Preloader />
            <CartOverlay />
            <SearchOverlay />
            <AuthModal />
            <MenuOverlay />
            <ProductDetailOverlay />
            <CheckoutOverlay />

            {/* Main Content */}
            {children}
          </div>
        </SmoothScroll>
      </body>
    </html>
  );
}
