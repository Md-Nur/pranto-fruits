"use client";

import React from "react";
import Link from "next/link";
import { Menu, Bell } from "lucide-react";

interface AdminHeaderProps {
    title: string;
    subtitle?: string;
    onMobileMenuToggle: () => void;
}

const AdminHeader = ({ title, subtitle, onMobileMenuToggle }: AdminHeaderProps) => {
    return (
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 shrink-0 sticky top-0 z-30">
            <div className="flex items-center gap-4">
                <button
                    onClick={onMobileMenuToggle}
                    className="lg:hidden p-2 -ml-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <Menu size={22} />
                </button>
                <div>
                    <h1 className="text-lg font-bold text-gray-900 leading-tight">{title}</h1>
                    {subtitle && <p className="text-xs text-gray-400 font-medium">{subtitle}</p>}
                </div>
            </div>

            <div className="flex items-center gap-3">
                <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <Bell size={20} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full" />
                </button>
                <Link href="/" className="text-xs font-medium text-gray-400 hover:text-emerald-600 border border-gray-200 px-3 py-1.5 rounded-lg hover:border-emerald-200 transition-all">
                    View Site →
                </Link>
            </div>
        </header>
    );
};

export default AdminHeader;
