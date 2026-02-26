"use client";

import React, { useState } from "react";
import { Search, Package, Truck, CheckCircle2, MapPin, Clock, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

const timelinePositions = [
    { status: "প্রসেসিং হচ্ছে", date: "২৪ ফেব্রুয়ারি, ২০২৬", time: "সকাল ১০:৩০", active: true },
    { status: "সর্টেড ও প্যাকড", date: "২৪ ফেব্রুয়ারি, ২০২৬", time: "বিকাল ০৪:১৫", active: true },
    { status: "ডেলিভারির জন্য বের হয়েছে", date: "২৫ ফেব্রুয়ারি, ২০২৬", time: "সকাল ০৯:০০", active: true },
    { status: "ডেলিভারি হয়েছে", date: "অপেক্ষমান", time: "", active: false },
];

const TrackOrder = () => {
    const [orderId, setOrderId] = useState("");
    const [showResult, setShowResult] = useState(false);
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeOrderDetails, setActiveOrderDetails] = useState<any>(null);

    React.useEffect(() => {
        const fetchOrders = async () => {
            try {
                const checkRes = await fetch("/api/auth/check");
                const checkData = await checkRes.json();
                if (checkData.authenticated) {
                    const res = await fetch("/api/orders/user");
                    if (res.ok) {
                        const data = await res.json();
                        setOrders(data.orders);
                    }
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const handleTrack = (e: React.FormEvent) => {
        e.preventDefault();
        if (orderId) setShowResult(true);
    };

    return (
        <div className="container mx-auto px-4 md:px-6 py-20 min-h-[70vh]">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-5xl font-bold text-organic-green mb-4">আপনার অর্ডার ট্র্যাক করুন</h1>
                    <p className="text-gray-500">আপনার কনফার্মেশন এসএমএস-এ দেওয়া অর্ডার আইডি লিখুন।</p>
                </div>

                {!loading && orders.length > 0 && (
                    <div className="mb-12">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-800">আপনার সাম্প্রতিক অর্ডারসমূহ</h2>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            {orders.slice(0, 4).map((order) => (
                                <div key={order.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                            <Package size={24} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-800">অর্ডার #PF-{order.id.toString().padStart(6, '0')}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className={cn(
                                                    "text-xs px-2 py-1 rounded-full font-medium",
                                                    order.status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-700' :
                                                        order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                                                            'bg-blue-100 text-blue-700'
                                                )}>
                                                    {order.status === 'PENDING' && "পেন্ডিং"}
                                                    {order.status === 'PROCESSING' && "প্রসেসিং হচ্ছে"}
                                                    {order.status === 'SHIPPED' && "পথে আছে"}
                                                    {order.status === 'DELIVERED' && "ডেলিভারি হয়েছে"}
                                                    {order.status === 'CANCELLED' && "বাতিল"}
                                                </span>
                                                <span className="text-xs text-gray-400 font-medium">
                                                    {new Date(order.createdAt).toLocaleDateString('bn-BD', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setOrderId(`PF-${order.id.toString().padStart(6, '0')}`);
                                            setActiveOrderDetails(order);
                                            setShowResult(true);
                                        }}
                                        className="text-primary hover:text-primary-dark p-2 hover:bg-primary/5 rounded-lg transition-colors"
                                    >
                                        <ExternalLink size={20} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-4 mb-16">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            placeholder="উদাঃ PF-987654"
                            value={orderId}
                            onChange={(e) => setOrderId(e.target.value)}
                            className="w-full bg-white border-2 border-gray-100 rounded-2xl px-6 py-5 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-bold text-lg"
                        />
                        <Package size={24} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300" />
                    </div>
                    <button className="bg-primary text-white px-12 py-5 rounded-2xl font-bold text-lg hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2">
                        <Search size={20} /> ট্র্যাক করুন
                    </button>
                </form>

                {showResult && (
                    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl p-8 md:p-12 animate-in fade-in slide-in-from-bottom duration-500">
                        <div className="flex flex-wrap items-center justify-between gap-6 mb-12 pb-8 border-b border-gray-50">
                            <div>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">অর্ডার স্ট্যাটাস</p>
                                <div className="flex items-center gap-2">
                                    {(activeOrderDetails?.status === 'PROCESSING' || activeOrderDetails?.status === 'SHIPPED') && (
                                        <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
                                    )}
                                    <span className={cn("text-xl font-bold",
                                        activeOrderDetails?.status === 'CANCELLED' ? 'text-red-500' : 'text-organic-green'
                                    )}>
                                        {activeOrderDetails ? (
                                            activeOrderDetails.status === 'PENDING' ? "পেন্ডিং" :
                                                activeOrderDetails.status === 'PROCESSING' ? "প্রসেসিং হচ্ছে" :
                                                    activeOrderDetails.status === 'SHIPPED' ? "পথে আছে" :
                                                        activeOrderDetails.status === 'DELIVERED' ? "ডেলিভারি হয়েছে" :
                                                            "বাতিল"
                                        ) : "পথে আছে"}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">অর্ডার কনফার্ম</p>
                                <span className="text-xl font-bold text-organic-green">
                                    {activeOrderDetails
                                        ? new Date(activeOrderDetails.createdAt).toLocaleDateString('bn-BD', { day: 'numeric', month: 'short', year: 'numeric' })
                                        : "২৪ ফেব্রুয়ারি, ২০২৬"}
                                </span>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">মোট মূল্য</p>
                                <span className="text-xl font-bold text-organic-green">
                                    {activeOrderDetails ? `৳${activeOrderDetails.totalAmount}` : "৳১২৫০"}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-0 relative">
                            {/* Central Line */}
                            <div className="absolute left-[15px] top-4 bottom-4 w-[3px] bg-gray-100" />

                            {timelinePositions.map((item, index) => (
                                <div key={index} className="flex gap-8 pb-12 last:pb-0 group">
                                    <div className={cn(
                                        "w-[34px] h-[34px] rounded-full flex items-center justify-center shrink-0 z-10 transition-colors",
                                        item.active ? "bg-primary text-white shadow-lg shadow-primary/30" : "bg-gray-100 text-gray-400"
                                    )}>
                                        {item.active ? <CheckCircle2 size={18} /> : <div className="w-2 h-2 bg-gray-300 rounded-full" />}
                                    </div>
                                    <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                        <div>
                                            <h4 className={cn("text-lg font-bold", item.active ? "text-organic-green" : "text-gray-400")}>
                                                {item.status}
                                            </h4>
                                            {item.active && (
                                                <p className="text-sm text-gray-500 flex items-center gap-1">
                                                    <MapPin size={12} /> রাজশাহী হাব থেকে বেরিয়েছে
                                                </p>
                                            )}
                                        </div>
                                        {item.active && (
                                            <div className="text-right sm:text-right">
                                                <div className="flex items-center gap-2 text-sm font-bold text-gray-800">
                                                    <Clock size={14} className="text-primary" /> {item.time}
                                                </div>
                                                <div className="text-xs text-gray-400">{item.date}</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-12 p-6 bg-surface rounded-3xl flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                                <Truck className="text-primary" size={24} />
                            </div>
                            <p className="text-sm text-gray-600">
                                <span className="font-bold">সর্বশেষ আপডেট:</span> আপনার প্যাকেজটি ডেলিভারি লোকেশন থেকে মাত্র ২ কিমি দূরে আছে। অনুগ্রহ করে আপনার ফোন সচল রাখুন।
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TrackOrder;
