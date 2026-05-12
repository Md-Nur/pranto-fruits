"use client";

import React, { useState, useEffect } from "react";
import {
    Package,
    ShoppingCart,
    Users,
    DollarSign,
    TrendingUp,
    Clock,
    CheckCircle2,
    Truck,
    XCircle,
    ArrowUpRight,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import FruitLoading from "@/components/FruitLoading";

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: any }> = {
    PENDING: { label: "Pending", color: "text-amber-600", bg: "bg-amber-50 border-amber-200", icon: Clock },
    PROCESSING: { label: "Processing", color: "text-blue-600", bg: "bg-blue-50 border-blue-200", icon: TrendingUp },
    SHIPPED: { label: "Shipped", color: "text-purple-600", bg: "bg-purple-50 border-purple-200", icon: Truck },
    DELIVERED: { label: "Delivered", color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200", icon: CheckCircle2 },
    CANCELLED: { label: "Cancelled", color: "text-red-600", bg: "bg-red-50 border-red-200", icon: XCircle },
};

export default function AdminDashboard() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch("/api/admin/stats");
                const json = await res.json();
                setData(json);
            } catch (err) {
                console.error("Failed to fetch stats", err);
            }
            setLoading(false);
        };
        fetchStats();
    }, []);

    if (loading) return <FruitLoading />;

    const stats = data?.stats;
    const recentOrders = data?.recentOrders || [];
    const ordersByStatus = data?.ordersByStatus || {};

    const statCards = [
        {
            label: "Total Revenue",
            value: `৳${stats?.totalRevenue?.toLocaleString() || 0}`,
            icon: DollarSign,
            color: "from-emerald-500 to-teal-600",
            change: "+12.5%",
        },
        {
            label: "Total Orders",
            value: stats?.totalOrders || 0,
            icon: ShoppingCart,
            color: "from-blue-500 to-indigo-600",
            change: "+8.2%",
        },
        {
            label: "Total Users",
            value: stats?.totalUsers || 0,
            icon: Users,
            color: "from-violet-500 to-purple-600",
            change: "+5.1%",
        },
        {
            label: "Total Products",
            value: stats?.totalProducts || 0,
            icon: Package,
            color: "from-amber-500 to-orange-600",
            change: "Active",
        },
    ];

    const totalOrders = Object.values(ordersByStatus).reduce((a: number, b: any) => a + b, 0) as number;

    return (
        <div className="space-y-6">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {statCards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <div
                            key={card.label}
                            className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg transition-shadow duration-300"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={cn("w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center", card.color)}>
                                    <Icon size={22} className="text-white" />
                                </div>
                                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                                    {card.change}
                                </span>
                            </div>
                            <p className="text-2xl font-black text-gray-900">{card.value}</p>
                            <p className="text-xs text-gray-400 font-medium mt-1">{card.label}</p>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Orders by Status */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                    <h3 className="font-bold text-gray-900 mb-5">Orders by Status</h3>
                    <div className="space-y-3">
                        {Object.entries(statusConfig).map(([key, config]) => {
                            const count = ordersByStatus[key] || 0;
                            const percentage = totalOrders > 0 ? (count / totalOrders) * 100 : 0;
                            const Icon = config.icon;
                            return (
                                <div key={key} className="flex items-center gap-3">
                                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center border", config.bg)}>
                                        <Icon size={16} className={config.color} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="font-medium text-gray-700">{config.label}</span>
                                            <span className="text-gray-400 font-medium">{count}</span>
                                        </div>
                                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className={cn("h-full rounded-full transition-all duration-700", {
                                                    "bg-amber-500": key === "PENDING",
                                                    "bg-blue-500": key === "PROCESSING",
                                                    "bg-purple-500": key === "SHIPPED",
                                                    "bg-emerald-500": key === "DELIVERED",
                                                    "bg-red-500": key === "CANCELLED",
                                                })}
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="font-bold text-gray-900">Recent Orders</h3>
                        <Link
                            href="/admin/orders"
                            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                        >
                            View All <ArrowUpRight size={14} />
                        </Link>
                    </div>

                    {recentOrders.length === 0 ? (
                        <p className="text-gray-400 text-sm text-center py-8">No orders yet</p>
                    ) : (
                        <div className="overflow-x-auto -mx-6">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-left text-xs text-gray-400 uppercase tracking-wider border-b border-gray-50">
                                        <th className="pb-3 pl-6 font-semibold">Order</th>
                                        <th className="pb-3 font-semibold">Customer</th>
                                        <th className="pb-3 font-semibold">Amount</th>
                                        <th className="pb-3 font-semibold">Status</th>
                                        <th className="pb-3 pr-6 font-semibold">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentOrders.slice(0, 8).map((order: any) => {
                                        const sc = statusConfig[order.status];
                                        return (
                                            <tr key={order.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                                                <td className="py-3 pl-6 font-bold text-gray-900">#{order.id}</td>
                                                <td className="py-3">
                                                    <p className="font-medium text-gray-700">{order.user?.name}</p>
                                                    <p className="text-xs text-gray-400">{order.user?.phone}</p>
                                                </td>
                                                <td className="py-3 font-bold text-gray-900">৳{order.totalAmount?.toLocaleString()}</td>
                                                <td className="py-3">
                                                    <span className={cn("text-xs font-bold px-2 py-1 rounded-full border", sc?.bg, sc?.color)}>
                                                        {sc?.label}
                                                    </span>
                                                </td>
                                                <td className="py-3 pr-6 text-gray-400 text-xs">
                                                    {new Date(order.createdAt).toLocaleDateString("en-GB", {
                                                        day: "2-digit",
                                                        month: "short",
                                                        year: "numeric",
                                                    })}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: "Add Product", href: "/admin/products", icon: Package, color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
                    { label: "View Orders", href: "/admin/orders", icon: ShoppingCart, color: "bg-blue-50 text-blue-600 border-blue-100" },
                    { label: "Manage Users", href: "/admin/users", icon: Users, color: "bg-violet-50 text-violet-600 border-violet-100" },
                    { label: "Write Post", href: "/admin/blog", icon: TrendingUp, color: "bg-amber-50 text-amber-600 border-amber-100" },
                ].map((action) => {
                    const Icon = action.icon;
                    return (
                        <Link
                            key={action.label}
                            href={action.href}
                            className={cn(
                                "flex items-center gap-3 p-4 rounded-2xl border font-medium text-sm hover:shadow-md transition-all duration-200",
                                action.color
                            )}
                        >
                            <Icon size={20} />
                            {action.label}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
