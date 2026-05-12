"use client";

import React, { useState, useEffect } from "react";
import { Search, Eye, Clock, TrendingUp, Truck, CheckCircle2, XCircle, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import FruitLoading from "@/components/FruitLoading";
import OrderDetailModal from "@/components/admin/OrderDetailModal";

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: any }> = {
    PENDING: { label: "Pending", color: "text-amber-600", bg: "bg-amber-50 border-amber-200", icon: Clock },
    PROCESSING: { label: "Processing", color: "text-blue-600", bg: "bg-blue-50 border-blue-200", icon: TrendingUp },
    SHIPPED: { label: "Shipped", color: "text-purple-600", bg: "bg-purple-50 border-purple-200", icon: Truck },
    DELIVERED: { label: "Delivered", color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200", icon: CheckCircle2 },
    CANCELLED: { label: "Cancelled", color: "text-red-600", bg: "bg-red-50 border-red-200", icon: XCircle },
};

const statusTabs = [
    { key: "", label: "All" },
    { key: "PENDING", label: "Pending" },
    { key: "PROCESSING", label: "Processing" },
    { key: "SHIPPED", label: "Shipped" },
    { key: "DELIVERED", label: "Delivered" },
    { key: "CANCELLED", label: "Cancelled" },
];

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("");
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [modalOpen, setModalOpen] = useState(false);

    const fetchOrders = async () => {
        try {
            const params = new URLSearchParams();
            if (statusFilter) params.set("status", statusFilter);
            const res = await fetch(`/api/admin/orders?${params}`);
            const data = await res.json();
            setOrders(data.orders || []);
        } catch (err) {
            console.error("Failed to fetch orders", err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchOrders();
    }, [statusFilter]);

    const handleStatusUpdate = async (orderId: number, status: string) => {
        const res = await fetch(`/api/admin/orders/${orderId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status }),
        });
        if (!res.ok) throw new Error("Failed to update");
        const data = await res.json();
        // Update local state
        setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: data.order.status } : o)));
        setSelectedOrder((prev: any) => prev && prev.id === orderId ? { ...prev, status: data.order.status } : prev);
    };

    if (loading) return <FruitLoading />;

    return (
        <div className="space-y-6">
            {/* Status Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {statusTabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setStatusFilter(tab.key)}
                        className={cn(
                            "px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all border",
                            statusFilter === tab.key
                                ? "bg-emerald-500 text-white border-emerald-500 shadow-sm shadow-emerald-200"
                                : "bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-700"
                        )}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                {orders.length === 0 ? (
                    <div className="text-center py-16">
                        <ShoppingCart size={48} className="mx-auto text-gray-200 mb-4" />
                        <p className="text-gray-400 font-medium">No orders found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-xs text-gray-400 uppercase tracking-wider border-b border-gray-100 bg-gray-50/50">
                                    <th className="px-6 py-3 font-semibold">Order ID</th>
                                    <th className="px-4 py-3 font-semibold">Customer</th>
                                    <th className="px-4 py-3 font-semibold">Amount</th>
                                    <th className="px-4 py-3 font-semibold">Payment</th>
                                    <th className="px-4 py-3 font-semibold">Status</th>
                                    <th className="px-4 py-3 font-semibold">Date</th>
                                    <th className="px-6 py-3 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => {
                                    const sc = statusConfig[order.status];
                                    return (
                                        <tr key={order.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4 font-bold text-gray-900">#{order.id}</td>
                                            <td className="px-4 py-4">
                                                <p className="font-medium text-gray-700">{order.user?.name || "Unknown"}</p>
                                                <p className="text-xs text-gray-400">{order.user?.phone}</p>
                                            </td>
                                            <td className="px-4 py-4 font-bold text-gray-900">৳{order.totalAmount?.toLocaleString()}</td>
                                            <td className="px-4 py-4">
                                                <span className="text-xs font-medium uppercase text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                                    {order.paymentMethod}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className={cn("text-xs font-bold px-2.5 py-1 rounded-full border", sc?.bg, sc?.color)}>
                                                    {sc?.label}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-gray-400 text-xs">
                                                {new Date(order.createdAt).toLocaleDateString("en-GB", {
                                                    day: "2-digit", month: "short", year: "numeric",
                                                })}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => { setSelectedOrder(order); setModalOpen(true); }}
                                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="View Details"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Order Detail Modal */}
            <OrderDetailModal
                isOpen={modalOpen}
                onClose={() => { setModalOpen(false); setSelectedOrder(null); }}
                order={selectedOrder}
                onStatusUpdate={handleStatusUpdate}
            />
        </div>
    );
}
