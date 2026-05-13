import type { Metadata, Viewport } from "next";
import { Inter, Hind_Siliguri } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import PublicLayout from "../components/PublicLayout";
import FacebookPixel from "@/components/FacebookPixel";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const hindSiliguri = Hind_Siliguri({
  variable: "--font-hind-siliguri",
  subsets: ["bengali"],
  weight: ["300", "400", "500", "600", "700"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  title: {
    default: "Village Organic Fruits | High-Quality Fresh Fruits",
    template: "%s | Village Organic Fruits",
  },
  description: "Experience the finest seasonal fruits delivered straight from the garden with Village Organic Fruits. 100% organic, fresh, and handpicked.",
  keywords: ["organic fruits", "fresh fruits", "buy fruits online", "village organic fruits", "seasonal fruits"],
  openGraph: {
    title: "Village Organic Fruits",
    description: "Experience the finest seasonal fruits delivered straight from the garden with Village Organic Fruits.",
    url: "/",
    siteName: "Village Organic Fruits",
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
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
        <FacebookPixel />
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
