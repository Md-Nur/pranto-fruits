import type { Metadata } from "next";
import { Inter, Hind_Siliguri } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import TrustFooter from "@/components/TrustFooter";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import CartSideOver from "@/components/CartSideOver";
import SocialIntegration from "@/components/SocialIntegration";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const hindSiliguri = Hind_Siliguri({
  variable: "--font-hind-siliguri",
  subsets: ["bengali"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Pranto Fruits Ltd. | High-Quality Fresh Fruits",
  description: "Experience the finest seasonal fruits delivered straight from the garden with Pranto Fruits Ltd.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${hindSiliguri.variable} antialiased`}
        suppressHydrationWarning
      >
        <CartProvider>
          <WishlistProvider>
            <div className="page-container relative">
              <Navbar />
              <main className="pt-20">
                {children}
              </main>
              <CartSideOver />
              <SocialIntegration />
              <TrustFooter />
            </div>
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
