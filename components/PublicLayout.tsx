"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import TrustFooter from "@/components/TrustFooter";
import CartSideOver from "@/components/CartSideOver";
import SocialIntegration from "@/components/SocialIntegration";

import WhatsAppButton from "@/components/WhatsAppButton";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdmin = pathname.startsWith("/admin");

    const isLanding = pathname.startsWith("/landing");

    if (isAdmin || isLanding) {
        // Admin and Landing pages get their own layout — no public site chrome
        return <>{children}</>;
    }

    return (
        <div className="page-container relative">
            <Navbar />
            <main>
                {children}
            </main>
            <CartSideOver />
            <SocialIntegration />
            <TrustFooter />
        </div>
    );
}
