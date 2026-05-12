"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { cn } from "@/lib/utils";
import FruitLoading from "@/components/FruitLoading";

const pageTitles: Record<string, { title: string; subtitle: string }> = {
    "/admin": { title: "Dashboard", subtitle: "Overview & Analytics" },
    "/admin/products": { title: "Products", subtitle: "Manage your product catalog" },
    "/admin/orders": { title: "Orders", subtitle: "Track and manage orders" },
    "/admin/users": { title: "Users", subtitle: "Manage customers & admins" },
    "/admin/blog": { title: "Blog Posts", subtitle: "Manage content & articles" },
    "/admin/settings": { title: "Settings", subtitle: "Site configuration" },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch("/api/auth/check");
                const data = await res.json();
                if (!data.authenticated || data.user?.role !== "ADMIN") {
                    router.push("/login");
                    return;
                }
                setUser(data.user);
            } catch {
                router.push("/login");
                return;
            }
            setLoading(false);
        };
        checkAuth();
    }, [router]);

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/login");
    };

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-gray-50">
                <FruitLoading />
            </div>
        );
    }

    const pageInfo = pageTitles[pathname] || { title: "Admin", subtitle: "" };

    return (
        <div className="min-h-screen bg-gray-50/80">
            {/* Mobile overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar — desktop always visible, mobile toggle */}
            <div className={cn("hidden lg:block")}>
                <AdminSidebar
                    collapsed={collapsed}
                    onToggle={() => setCollapsed(!collapsed)}
                    onLogout={handleLogout}
                    userName={user?.name}
                />
            </div>
            <div className={cn("lg:hidden", mobileOpen ? "block" : "hidden")}>
                <AdminSidebar
                    collapsed={false}
                    onToggle={() => setMobileOpen(false)}
                    onLogout={handleLogout}
                    userName={user?.name}
                />
            </div>

            {/* Main Content */}
            <div
                className={cn(
                    "transition-all duration-300",
                    collapsed ? "lg:ml-[72px]" : "lg:ml-[260px]"
                )}
            >
                <AdminHeader
                    title={pageInfo.title}
                    subtitle={pageInfo.subtitle}
                    onMobileMenuToggle={() => setMobileOpen(!mobileOpen)}
                />
                <main className="p-4 md:p-6 max-w-[1600px] mx-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
