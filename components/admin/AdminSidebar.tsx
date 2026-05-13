"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    FileText,
    Settings,
    ChevronLeft,
    ChevronRight,
    LogOut,
    Store,
    Tags,
    Star,
    Video,
    Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/products", label: "Products", icon: Package },
    { href: "/admin/categories", label: "Categories", icon: Tags },
    { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
    { href: "/admin/inquiries", label: "Inquiries", icon: Mail },
    { href: "/admin/reviews", label: "Reviews", icon: Star },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/blog", label: "Blog Posts", icon: FileText },
    { href: "/admin/stories", label: "Garden Stories", icon: Video },
    { href: "/admin/settings", label: "Settings", icon: Settings },
];

interface AdminSidebarProps {
    collapsed: boolean;
    onToggle: () => void;
    onLogout: () => void;
    userName?: string;
}

const AdminSidebar = ({ collapsed, onToggle, onLogout, userName }: AdminSidebarProps) => {
    const pathname = usePathname();

    return (
        <aside
            className={cn(
                "fixed left-0 top-0 h-screen bg-[#0f172a] text-white z-50 flex flex-col transition-all duration-300 border-r border-white/5",
                collapsed ? "w-[72px]" : "w-[260px]"
            )}
        >
            {/* Logo */}
            <div className="h-16 flex items-center px-4 border-b border-white/5 shrink-0">
                <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shrink-0">
                    <Store size={22} className="text-white" />
                </div>
                {!collapsed && (
                    <div className="ml-3 overflow-hidden">
                        <p className="font-bold text-sm leading-tight truncate">Village Organic</p>
                        <p className="text-[10px] text-emerald-400 font-medium tracking-wider uppercase">Admin Panel</p>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group",
                                isActive
                                    ? "bg-emerald-500/15 text-emerald-400"
                                    : "text-slate-400 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <Icon
                                size={20}
                                className={cn(
                                    "shrink-0 transition-colors",
                                    isActive ? "text-emerald-400" : "text-slate-500 group-hover:text-white"
                                )}
                            />
                            {!collapsed && <span className="truncate">{item.label}</span>}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Section */}
            <div className="border-t border-white/5 p-3 space-y-2 shrink-0">
                {/* Collapse Toggle */}
                <button
                    onClick={onToggle}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                >
                    {collapsed ? <ChevronRight size={20} className="shrink-0" /> : <ChevronLeft size={20} className="shrink-0" />}
                    {!collapsed && <span>Collapse</span>}
                </button>

                {/* User + Logout */}
                <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                >
                    <LogOut size={20} className="shrink-0" />
                    {!collapsed && <span>{userName ? `Logout (${userName})` : "Logout"}</span>}
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;
