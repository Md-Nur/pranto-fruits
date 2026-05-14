"use client";

import React from "react";
import { X, Phone, MapPin, Mail, CreditCard, Package } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
    PENDING: { label: "Pending", color: "text-amber-600", bg: "bg-amber-50 border-amber-200" },
    PAID: { label: "Paid", color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200" },
    PROCESSING: { label: "Processing", color: "text-blue-600", bg: "bg-blue-50 border-blue-200" },
    SHIPPED: { label: "Shipped", color: "text-purple-600", bg: "bg-purple-50 border-purple-200" },
    DELIVERED: { label: "Delivered", color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200" },
    CANCELLED: { label: "Cancelled", color: "text-red-600", bg: "bg-red-50 border-red-200" },
};

const allStatuses = ["PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

interface OrderDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: any;
    onStatusUpdate: (orderId: number, status: string) => Promise<void>;
}

const OrderDetailModal = ({ isOpen, onClose, order, onStatusUpdate }: OrderDetailModalProps) => {
    const [updating, setUpdating] = React.useState(false);

    if (!isOpen || !order) return null;

    const shippingInfo = typeof order.shippingInfo === "string" ? JSON.parse(order.shippingInfo) : order.shippingInfo;
    const orderItems = typeof order.orderItems === "string" ? JSON.parse(order.orderItems) : order.orderItems;
    const items = Array.isArray(orderItems) ? orderItems : [];

    const handleStatusChange = async (newStatus: string) => {
        setUpdating(true);
        try {
            await onStatusUpdate(order.id, newStatus);
        } catch (err) {
            console.error(err);
        }
        setUpdating(false);
    };

    const sc = statusConfig[order.status];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 rounded-t-2xl flex items-center justify-between z-10">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Order #{order.id}</h2>
                        <p className="text-xs text-gray-400">
                            {new Date(order.createdAt).toLocaleDateString("en-GB", {
                                day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
                            })}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                        <X size={20} className="text-gray-400" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Status + Update */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-gray-500">Current Status:</span>
                            <span className={cn("text-xs font-bold px-3 py-1 rounded-full border", sc?.bg, sc?.color)}>
                                {sc?.label}
                            </span>
                        </div>
                        <select
                            value={order.status}
                            disabled={updating}
                            onChange={(e) => handleStatusChange(e.target.value)}
                            className="border border-gray-200 rounded-xl px-4 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 disabled:opacity-50"
                        >
                            {allStatuses.map((s) => (
                                <option key={s} value={s}>{statusConfig[s].label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Customer Info */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 mb-3">Customer Information</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center gap-2 text-gray-600">
                                <Phone size={14} className="text-gray-400" />
                                <span>{order.user?.phone || shippingInfo?.phone || "N/A"}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                <Mail size={14} className="text-gray-400" />
                                <span>{order.user?.email || "N/A"}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600 sm:col-span-2">
                                <MapPin size={14} className="text-gray-400 shrink-0" />
                                <span>
                                    {shippingInfo?.address && `${shippingInfo.address}, `}
                                    {shippingInfo?.city && `${shippingInfo.city} `}
                                    {shippingInfo?.zipCode || ""}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 mb-3">Order Items</h3>
                        {items.length === 0 ? (
                            <p className="text-gray-400 text-sm">No items data available</p>
                        ) : (
                            <div className="space-y-2">
                                {items.map((item: any, idx: number) => (
                                    <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                        {item.image && (
                                            <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-gray-200">
                                                <Image src={item.image} alt={item.name} fill sizes="40px" className="object-cover" />
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">{item.name || "Product"}</p>
                                            <p className="text-xs text-gray-400">{item.variant || item.label || ""} × {item.quantity || 1}</p>
                                        </div>
                                        <p className="text-sm font-bold text-gray-900 shrink-0">
                                            ৳{((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Payment + Total */}
                    <div className="border-t border-gray-100 pt-4">
                        <div className="flex flex-col gap-2 mb-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <CreditCard size={14} />
                                    <span>Payment: <strong className="text-gray-700 uppercase">{order.paymentMethod}</strong></span>
                                </div>
                            </div>
                            {order.paymentDetails && (
                                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-xs space-y-1">
                                    <p className="text-emerald-800 font-bold uppercase tracking-wider text-[10px]">Transaction Details</p>
                                    <div className="flex justify-between">
                                        <span className="text-emerald-600/70">Sender Number:</span>
                                        <span className="font-bold text-emerald-700">{(order.paymentDetails as any).senderNumber}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-emerald-600/70">Transaction ID:</span>
                                        <span className="font-bold text-emerald-700">{(order.paymentDetails as any).transactionId}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center justify-between text-lg">
                            <span className="font-medium text-gray-700">Total</span>
                            <span className="font-black text-gray-900">৳{order.totalAmount?.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailModal;
