"use client";

import React, { useState, useEffect } from "react";
import {
    Search, Package, Truck, CheckCircle2, MapPin,
    AlertCircle, ChevronRight, Phone, RotateCcw,
    ShoppingBag, X, Loader2, History
} from "lucide-react";
import { cn } from "@/lib/utils";
import FruitLoading from "@/components/FruitLoading";

const RECENT_ORDERS_KEY = "vof_recent_order_ids";
const MAX_RECENT = 10;

function saveRecentOrderId(id: number) {
    try {
        const raw = localStorage.getItem(RECENT_ORDERS_KEY);
        const existing: number[] = raw ? JSON.parse(raw) : [];
        const updated = [id, ...existing.filter((x) => x !== id)].slice(0, MAX_RECENT);
        localStorage.setItem(RECENT_ORDERS_KEY, JSON.stringify(updated));
    } catch { /* ignore */ }
}

function loadRecentOrderIds(): number[] {
    try {
        const raw = localStorage.getItem(RECENT_ORDERS_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch { return []; }
}

function removeRecentOrderId(id: number) {
    try {
        const raw = localStorage.getItem(RECENT_ORDERS_KEY);
        const existing: number[] = raw ? JSON.parse(raw) : [];
        localStorage.setItem(RECENT_ORDERS_KEY, JSON.stringify(existing.filter((x) => x !== id)));
    } catch { /* ignore */ }
}

/* ── helpers ──────────────────────────────────────────────── */

function formatOrderId(id: number) {
    return `PF-${id.toString().padStart(6, "0")}`;
}

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-BD", {
        day: "numeric", month: "short", year: "numeric",
    });
}

function formatDateTime(dateStr: string) {
    return new Date(dateStr).toLocaleString("en-BD", {
        day: "numeric", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit",
    });
}

/* ── status config ─────────────────────────────────────────── */

type OrderStatus = "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

const STATUS_LABEL: Record<OrderStatus, string> = {
    PENDING: "Pending",
    PROCESSING: "Processing",
    SHIPPED: "On the Way",
    DELIVERED: "Delivered",
    CANCELLED: "Cancelled",
};

const STATUS_COLOR: Record<OrderStatus, string> = {
    PENDING: "text-amber-600",
    PROCESSING: "text-blue-600",
    SHIPPED: "text-indigo-600",
    DELIVERED: "text-emerald-600",
    CANCELLED: "text-red-500",
};

const STATUS_BG: Record<OrderStatus, string> = {
    PENDING: "bg-amber-50 text-amber-700 border-amber-200",
    PROCESSING: "bg-blue-50 text-blue-700 border-blue-200",
    SHIPPED: "bg-indigo-50 text-indigo-700 border-indigo-200",
    DELIVERED: "bg-emerald-50 text-emerald-700 border-emerald-200",
    CANCELLED: "bg-red-50 text-red-700 border-red-200",
};

// Timeline steps in order
const TIMELINE_STEPS: Array<{ status: OrderStatus; label: string; icon: React.ElementType; description: string }> = [
    { status: "PENDING", label: "Order Placed", icon: ShoppingBag, description: "Your order has been received and is awaiting confirmation." },
    { status: "PROCESSING", label: "Processing", icon: Package, description: "We're carefully sorting and packing your fresh fruits." },
    { status: "SHIPPED", label: "On the Way", icon: Truck, description: "Your package is out for delivery. Please keep your phone active." },
    { status: "DELIVERED", label: "Delivered", icon: CheckCircle2, description: "Your order has been successfully delivered. Enjoy!" },
];

const STATUS_ORDER: Record<OrderStatus, number> = {
    PENDING: 0,
    PROCESSING: 1,
    SHIPPED: 2,
    DELIVERED: 3,
    CANCELLED: -1,
};

/* ── types ─────────────────────────────────────────────────── */

interface OrderData {
    id: number;
    status: OrderStatus;
    totalAmount: number;
    paymentMethod: string;
    createdAt: string;
    updatedAt: string;
    shippingInfo: {
        name?: string;
        city?: string;
        address?: string;
        phone?: string;
    };
    orderItems: Array<{
        id: number;
        name: string;
        quantity: number;
        price: number;
        variant?: string;
        image?: string;
    }>;
}

/* ── main component ─────────────────────────────────────────── */

const TrackOrder = () => {
    const [orderId, setOrderId] = useState("");
    const [phone, setPhone] = useState("");
    const [requiresPhone, setRequiresPhone] = useState(false);
    const [searching, setSearching] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [trackedOrder, setTrackedOrder] = useState<OrderData | null>(null);

    // Logged-in user orders
    const [userOrders, setUserOrders] = useState<OrderData[]>([]);
    const [loadingUser, setLoadingUser] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    // Guest recent order IDs (from localStorage)
    const [recentIds, setRecentIds] = useState<number[]>([]);

    /* fetch user orders on mount */
    useEffect(() => {
        const fetchUserOrders = async () => {
            try {
                const checkRes = await fetch("/api/auth/check");
                const checkData = await checkRes.json();
                if (checkData.authenticated) {
                    setIsLoggedIn(true);
                    const res = await fetch("/api/orders/user");
                    if (res.ok) {
                        const data = await res.json();
                        setUserOrders(data.orders || []);
                    }
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoadingUser(false);
            }
        };
        fetchUserOrders();
        // Load guest history from localStorage
        setRecentIds(loadRecentOrderIds());
    }, []);

    /* track by ID */
    const handleTrack = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!orderId.trim()) return;
        setError(null);
        setSearching(true);
        setTrackedOrder(null);

        try {
            const params = new URLSearchParams({ id: orderId.trim() });
            if (phone.trim()) params.set("phone", phone.trim());

            const res = await fetch(`/api/orders/track?${params}`);
            const data = await res.json();

            if (!res.ok) {
                if (res.status === 403) {
                    // Needs phone verification
                    setRequiresPhone(true);
                    setError("Please enter your phone number to verify this order.");
                } else {
                    setError(data.error || "Order not found. Please check the ID and try again.");
                }
                return;
            }

            setTrackedOrder(data.order);
            setRequiresPhone(false);
            setError(null);
            // Persist to recent history for guests
            saveRecentOrderId(data.order.id);
            setRecentIds(loadRecentOrderIds());
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setSearching(false);
        }
    };

    /* quick-select a user order */
    const handleSelectOrder = (order: any) => {
        setTrackedOrder(order);
        setOrderId(formatOrderId(order.id));
        setError(null);
        setRequiresPhone(false);
        saveRecentOrderId(order.id);
        setRecentIds(loadRecentOrderIds());
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    /* quick-track a recent ID (guest) */
    const handleTrackRecentId = (id: number) => {
        setOrderId(formatOrderId(id));
        setError(null);
        setRequiresPhone(false);
        setTrackedOrder(null);
        setSearching(true);
        fetch(`/api/orders/track?id=${formatOrderId(id)}`)
            .then((r) => r.json())
            .then((data) => {
                if (data.order) {
                    setTrackedOrder(data.order);
                    saveRecentOrderId(data.order.id);
                    setRecentIds(loadRecentOrderIds());
                } else if (data.error) {
                    if (data.error.includes("Phone") || data.error.includes("match")) {
                        setRequiresPhone(true);
                        setError("Please enter your phone number to verify this order.");
                    } else {
                        setError(data.error);
                    }
                }
            })
            .catch(() => setError("Something went wrong."))
            .finally(() => setSearching(false));
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleRemoveRecent = (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        removeRecentOrderId(id);
        setRecentIds(loadRecentOrderIds());
    };

    const clearResult = () => {
        setTrackedOrder(null);
        setOrderId("");
        setPhone("");
        setError(null);
        setRequiresPhone(false);
    };

    if (loadingUser) return <FruitLoading />;

    const currentStepIndex = trackedOrder
        ? STATUS_ORDER[trackedOrder.status]
        : -1;

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50/30">
            {/* ── Hero header ─────────────────────────────────── */}
            <div className="bg-gradient-to-r from-primary/90 to-emerald-600 text-white pt-28 pb-16 px-4">
                <div className="max-w-3xl mx-auto text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-5 backdrop-blur-sm">
                        <MapPin size={32} className="text-white" />
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold mb-3">Track Your Order</h1>
                    <p className="text-white/80 text-lg">
                        Enter your Order ID from your confirmation SMS to see live updates.
                    </p>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 md:px-6 -mt-8 pb-20">

                {/* ── Search card ──────────────────────────────── */}
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8 mb-8">
                    <form onSubmit={handleTrack} className="space-y-4">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="flex-1 relative">
                                <Package size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    id="order-id-input"
                                    type="text"
                                    placeholder="e.g. PF-000042"
                                    value={orderId}
                                    onChange={(e) => { setOrderId(e.target.value); setError(null); }}
                                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all font-semibold text-base placeholder:font-normal placeholder:text-gray-400"
                                    autoComplete="off"
                                />
                                {orderId && (
                                    <button type="button" onClick={clearResult} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                        <X size={18} />
                                    </button>
                                )}
                            </div>
                            <button
                                type="submit"
                                disabled={searching || !orderId.trim()}
                                className="bg-primary text-white px-8 py-4 rounded-2xl font-bold text-base hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed min-w-[140px]"
                            >
                                {searching ? <Loader2 size={20} className="animate-spin" /> : <Search size={20} />}
                                {searching ? "Searching…" : "Track Order"}
                            </button>
                        </div>

                        {/* Phone verification (shown only when needed) */}
                        {requiresPhone && (
                            <div className="flex gap-3 animate-in slide-in-from-top duration-300">
                                <div className="flex-1 relative">
                                    <Phone size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        id="phone-input"
                                        type="tel"
                                        placeholder="Your phone number (e.g. 01XXXXXXXXX)"
                                        value={phone}
                                        onChange={(e) => { setPhone(e.target.value); setError(null); }}
                                        className="w-full bg-gray-50 border-2 border-amber-200 rounded-2xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-amber-300 focus:border-amber-400 outline-none transition-all font-semibold text-base placeholder:font-normal placeholder:text-gray-400"
                                        autoFocus
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={searching || !phone.trim()}
                                    className="bg-amber-500 text-white px-6 py-4 rounded-2xl font-bold hover:bg-amber-600 transition-all flex items-center gap-2 disabled:opacity-60"
                                >
                                    {searching ? <Loader2 size={18} className="animate-spin" /> : <ChevronRight size={18} />}
                                    Verify
                                </button>
                            </div>
                        )}
                    </form>

                    {/* Error message */}
                    {error && (
                        <div className="mt-4 flex items-start gap-3 bg-red-50 border border-red-100 text-red-700 rounded-2xl px-5 py-4 animate-in fade-in duration-300">
                            <AlertCircle size={20} className="shrink-0 mt-0.5" />
                            <p className="text-sm font-medium">{error}</p>
                        </div>
                    )}
                </div>

                {/* ── Tracking result ──────────────────────────── */}
                {trackedOrder && (
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl shadow-primary/5 overflow-hidden animate-in fade-in slide-in-from-bottom duration-500 mb-10">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-primary/5 to-emerald-50 px-6 md:px-8 py-6 border-b border-gray-100">
                            <div className="flex flex-wrap items-start justify-between gap-4">
                                <div>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Order ID</p>
                                    <p className="text-2xl font-black text-gray-800">{formatOrderId(trackedOrder.id)}</p>
                                </div>
                                <div className="text-right">
                                    <span className={cn(
                                        "inline-flex items-center gap-2 px-4 py-2 rounded-full border font-bold text-sm",
                                        STATUS_BG[trackedOrder.status]
                                    )}>
                                        {(trackedOrder.status === "PROCESSING" || trackedOrder.status === "SHIPPED") && (
                                            <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                                        )}
                                        {STATUS_LABEL[trackedOrder.status]}
                                    </span>
                                    <p className="text-xs text-gray-400 mt-2 font-medium">
                                        Last update: {formatDateTime(trackedOrder.updatedAt)}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
                                <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Order Date</p>
                                    <p className="font-bold text-gray-800 text-sm">{formatDate(trackedOrder.createdAt)}</p>
                                </div>
                                <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Total Amount</p>
                                    <p className="font-bold text-gray-800 text-sm">৳{trackedOrder.totalAmount.toFixed(2)}</p>
                                </div>
                                <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm col-span-2 sm:col-span-1">
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Payment</p>
                                    <p className="font-bold text-gray-800 text-sm capitalize">
                                        {trackedOrder.paymentMethod === "cod" ? "Cash on Delivery" : trackedOrder.paymentMethod}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Timeline */}
                        {trackedOrder.status !== "CANCELLED" ? (
                            <div className="px-6 md:px-8 py-8">
                                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-8">Delivery Progress</h3>
                                <div className="relative">
                                    {/* Vertical line */}
                                    <div className="absolute left-[19px] top-5 bottom-5 w-0.5 bg-gray-100" />

                                    <div className="space-y-8">
                                        {TIMELINE_STEPS.map((step, idx) => {
                                            const stepIdx = STATUS_ORDER[step.status];
                                            const done = stepIdx <= currentStepIndex;
                                            const isCurrent = stepIdx === currentStepIndex;
                                            const Icon = step.icon;

                                            return (
                                                <div key={step.status} className="flex gap-6 relative">
                                                    <div className={cn(
                                                        "w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 transition-all duration-500 border-2",
                                                        done
                                                            ? "bg-primary border-primary text-white shadow-lg shadow-primary/30"
                                                            : "bg-white border-gray-200 text-gray-300"
                                                    )}>
                                                        {isCurrent ? (
                                                            <div className="relative">
                                                                <Icon size={18} />
                                                                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border border-white animate-pulse" />
                                                            </div>
                                                        ) : (
                                                            <Icon size={18} />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-1 pt-1">
                                                        <div>
                                                            <h4 className={cn(
                                                                "font-bold text-base",
                                                                done ? "text-gray-800" : "text-gray-400"
                                                            )}>
                                                                {step.label}
                                                                {isCurrent && (
                                                                    <span className="ml-2 text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">Current</span>
                                                                )}
                                                            </h4>
                                                            {done && (
                                                                <p className="text-sm text-gray-500 mt-0.5">{step.description}</p>
                                                            )}
                                                        </div>
                                                        {done && (
                                                            <div className="text-sm text-gray-400 font-medium sm:text-right shrink-0">
                                                                {isCurrent
                                                                    ? formatDateTime(trackedOrder.updatedAt)
                                                                    : formatDate(trackedOrder.createdAt)
                                                                }
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="px-6 md:px-8 py-10 text-center">
                                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <X size={32} className="text-red-500" />
                                </div>
                                <h3 className="text-xl font-bold text-red-600 mb-2">Order Cancelled</h3>
                                <p className="text-gray-500 text-sm max-w-xs mx-auto">
                                    This order was cancelled. If you have questions, please contact our support.
                                </p>
                            </div>
                        )}

                        {/* Shipping Info */}
                        {trackedOrder.shippingInfo?.name && (
                            <div className="border-t border-gray-100 px-6 md:px-8 py-6">
                                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Delivery Address</h3>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                                        <MapPin size={20} className="text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-800">{trackedOrder.shippingInfo.name}</p>
                                        {trackedOrder.shippingInfo.address && (
                                            <p className="text-gray-500 text-sm mt-0.5">{trackedOrder.shippingInfo.address}</p>
                                        )}
                                        {trackedOrder.shippingInfo.city && (
                                            <p className="text-gray-500 text-sm">{trackedOrder.shippingInfo.city}</p>
                                        )}
                                        {trackedOrder.shippingInfo.phone && (
                                            <p className="text-primary text-sm font-medium mt-1 flex items-center gap-1">
                                                <Phone size={14} /> {trackedOrder.shippingInfo.phone}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Order Items */}
                        {Array.isArray(trackedOrder.orderItems) && trackedOrder.orderItems.length > 0 && (
                            <div className="border-t border-gray-100 px-6 md:px-8 py-6">
                                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Items Ordered</h3>
                                <div className="space-y-3">
                                    {(trackedOrder.orderItems as any[]).map((item: any, i: number) => (
                                        <div key={i} className="flex items-center gap-4 bg-gray-50 rounded-2xl p-3">
                                            {item.image ? (
                                                <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                                            ) : (
                                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                                    <Package size={22} className="text-primary" />
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-gray-800 truncate">{item.name || item.productName}</p>
                                                {(item.variant || item.variantLabel) && (
                                                    <p className="text-xs text-gray-400">{item.variant || item.variantLabel}</p>
                                                )}
                                            </div>
                                            <div className="text-right shrink-0">
                                                <p className="font-bold text-gray-800">৳{(item.price * item.quantity).toFixed(0)}</p>
                                                <p className="text-xs text-gray-400">× {item.quantity}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                                    <span className="font-bold text-gray-600">Total</span>
                                    <span className="font-black text-xl text-primary">৳{trackedOrder.totalAmount.toFixed(2)}</span>
                                </div>
                            </div>
                        )}

                        {/* Footer actions */}
                        <div className="border-t border-gray-100 px-6 md:px-8 py-5 bg-gray-50/50 flex flex-wrap gap-3 justify-between items-center">
                            <button
                                onClick={clearResult}
                                className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors"
                            >
                                <RotateCcw size={16} /> Track Another Order
                            </button>
                            <a
                                href={`https://wa.me/8801XXXXXXXXX?text=Hello! I need help with order ${formatOrderId(trackedOrder.id)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-sm bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-emerald-600 transition-colors"
                            >
                                <Phone size={16} /> Contact Support
                            </a>
                        </div>
                    </div>
                )}

                {/* ── Order History (always visible) ───────────── */}
                <div className="mt-4">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center">
                            <History size={18} className="text-primary" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800">Order History</h2>
                    </div>

                    {/* Logged-in: full order list from API */}
                    {isLoggedIn && userOrders.length > 0 && (
                        <div className="grid gap-4 md:grid-cols-2 mb-4">
                            {userOrders.slice(0, 8).map((order) => (
                                <button
                                    key={order.id}
                                    onClick={() => handleSelectOrder(order)}
                                    className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-primary/20 transition-all flex items-center justify-between group text-left w-full"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            "w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110",
                                            order.status === "DELIVERED" ? "bg-emerald-100 text-emerald-600" :
                                                order.status === "CANCELLED" ? "bg-red-100 text-red-500" :
                                                    order.status === "SHIPPED" ? "bg-indigo-100 text-indigo-600" :
                                                        "bg-primary/10 text-primary"
                                        )}>
                                            {order.status === "SHIPPED" ? <Truck size={22} /> :
                                                order.status === "DELIVERED" ? <CheckCircle2 size={22} /> :
                                                    <Package size={22} />}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-800">{formatOrderId(order.id)}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className={cn(
                                                    "text-xs px-2 py-0.5 rounded-full font-bold border",
                                                    STATUS_BG[order.status]
                                                )}>
                                                    {STATUS_LABEL[order.status]}
                                                </span>
                                                <span className="text-xs text-gray-400">{formatDate(order.createdAt)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <p className="font-bold text-primary">৳{order.totalAmount}</p>
                                        <ChevronRight size={20} className="text-gray-300 group-hover:text-primary transition-colors" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Logged-in but no orders yet */}
                    {isLoggedIn && userOrders.length === 0 && (
                        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
                            <ShoppingBag size={36} className="text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500 font-medium">You haven&apos;t placed any orders yet.</p>
                            <a href="/shop" className="mt-4 inline-block px-6 py-2.5 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors">
                                Start Shopping
                            </a>
                        </div>
                    )}

                    {/* Guest: recently tracked order IDs (from localStorage) */}
                    {!isLoggedIn && recentIds.length > 0 && (
                        <div>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-3">Recently Tracked</p>
                            <div className="flex flex-wrap gap-3">
                                {recentIds.map((id) => (
                                    <div key={id} className="flex items-center gap-0 bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                                        <button
                                            onClick={() => handleTrackRecentId(id)}
                                            className="flex items-center gap-2 px-4 py-3 hover:bg-primary/5 transition-colors"
                                        >
                                            <Package size={16} className="text-primary shrink-0" />
                                            <span className="font-bold text-gray-800 text-sm">{formatOrderId(id)}</span>
                                        </button>
                                        <button
                                            onClick={(e) => handleRemoveRecent(id, e)}
                                            className="px-3 py-3 text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors border-l border-gray-100"
                                            title="Remove"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Guest: no history yet */}
                    {!isLoggedIn && recentIds.length === 0 && (
                        <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-8 text-center">
                            <Package size={36} className="text-gray-200 mx-auto mb-3" />
                            <p className="text-gray-400 text-sm font-medium mb-1">No order history found</p>
                            <p className="text-gray-400 text-xs mb-5">
                                Track an order above and it will appear here. Or log in to see your full order history.
                            </p>
                            <a href="/login" className="inline-block px-6 py-2.5 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors">
                                Login to see all orders
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TrackOrder;
