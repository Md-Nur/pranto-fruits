import type { Metadata } from "next";
import { Inter, Hind_Siliguri } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import PublicLayout from "../components/PublicLayout";

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
  title: "Village Organic Fruits | High-Quality Fresh Fruits",
  description: "Experience the finest seasonal fruits delivered straight from the garden with Village Organic Fruits.",
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
            <PublicLayout>
              {children}
            </PublicLayout>
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
