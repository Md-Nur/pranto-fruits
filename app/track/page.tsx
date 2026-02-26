"use client";

import React, { useState } from "react";
import { Search, Package, Truck, CheckCircle2, MapPin, Clock } from "lucide-react";
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
                                    <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
                                    <span className="text-xl font-bold text-organic-green">পথে আছে</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">সম্ভাব্য ডেলিভারি</p>
                                <span className="text-xl font-bold text-organic-green">২৫ ফেব্রুয়ারি, ২০২৬ (আজ)</span>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">ডেলিভারি পার্টনার</p>
                                <span className="text-xl font-bold text-organic-green">পিএফ ফাস্ট ডেলিভারি</span>
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
