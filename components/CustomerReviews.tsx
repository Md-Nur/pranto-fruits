"use client";

import React, { useState, useEffect } from "react";
import { Play, Youtube, MessageCircle, ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Review {
    id: number;
    title: string;
    type: "VIDEO" | "IMAGE";
    url: string;
    authorName?: string;
    authorLink?: string;
    rating: number;
}

const getVideoId = (url: string) => {
    return url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|shorts\/|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
};

const CustomerReviews = () => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [videoIdx, setVideoIdx] = useState(0);
    const [imageIdx, setImageIdx] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await fetch("/api/reviews");
                if (!res.ok) {
                    console.warn(`Reviews API returned status: ${res.status}`);
                    setReviews([]);
                    return;
                }
                
                const contentType = res.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    const data = await res.json();
                    setReviews(Array.isArray(data) ? data : []);
                } else {
                    console.warn("Reviews API did not return JSON");
                    setReviews([]);
                }
            } catch (err) {
                console.error("Failed to fetch reviews:", err);
                setReviews([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchReviews();
    }, []);

    const videoReviews = reviews.filter(r => r.type === "VIDEO");
    const imageReviews = reviews.filter(r => r.type === "IMAGE");

    if (isLoading || reviews.length === 0) return null;

    return (
        <section className="py-24 bg-surface relative overflow-hidden">
            {/* Background Accents */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 -skew-x-12 translate-x-1/2" />
            
            <div className="w-full px-4 md:px-12 lg:px-20 relative">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Customer Reviews</h2>
                    <p className="text-gray-500 font-medium text-lg">Real feedback from our happy customers</p>
                    <div className="flex justify-center mt-6 gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} size={20} className="fill-yellow-400 text-yellow-400" />
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Video Experiences */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center text-red-600">
                                    <Youtube size={24} />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800">Watch Experiences</h3>
                            </div>
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => setVideoIdx(prev => (prev > 0 ? prev - 1 : videoReviews.length - 1))}
                                    className="p-2 rounded-full border border-gray-200 hover:bg-white hover:shadow-md transition-all"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <button 
                                    onClick={() => setVideoIdx(prev => (prev < videoReviews.length - 1 ? prev + 1 : 0))}
                                    className="p-2 rounded-full border border-gray-200 hover:bg-white hover:shadow-md transition-all"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl bg-black group">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={videoReviews[videoIdx]?.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="absolute inset-0"
                                >
                                    <iframe
                                        src={`https://www.youtube.com/embed/${getVideoId(videoReviews[videoIdx]?.url || "")}?modestbranding=1&rel=0`}
                                        className="w-full h-full border-0"
                                        allowFullScreen
                                    />
                                </motion.div>
                            </AnimatePresence>
                        </div>
                        <div className="p-4">
                            <h4 className="font-bold text-lg text-gray-900">{videoReviews[videoIdx]?.title}</h4>
                            <p className="text-sm text-gray-500">@{videoReviews[videoIdx]?.authorName || "Premium Customer"}</p>
                        </div>
                    </div>

                    {/* Image Moments */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                                    <MessageCircle size={24} />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800">Customer Moments</h3>
                            </div>
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => setImageIdx(prev => (prev > 0 ? prev - 1 : imageReviews.length - 1))}
                                    className="p-2 rounded-full border border-gray-200 hover:bg-white hover:shadow-md transition-all"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <button 
                                    onClick={() => setImageIdx(prev => (prev < imageReviews.length - 1 ? prev + 1 : 0))}
                                    className="p-2 rounded-full border border-gray-200 hover:bg-white hover:shadow-md transition-all"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl bg-white group border border-gray-100">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={imageReviews[imageIdx]?.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.05 }}
                                    className="absolute inset-0 p-4 flex items-center justify-center"
                                >
                                    <div className="relative w-full h-full rounded-2xl overflow-hidden">
                                        <img 
                                            src={imageReviews[imageIdx]?.url} 
                                            alt={imageReviews[imageIdx]?.title}
                                            className="w-full h-full object-contain"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                                            <p className="text-white font-medium italic">
                                                <Quote size={20} className="inline mr-2 opacity-50" />
                                                {imageReviews[imageIdx]?.title}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                        <div className="p-4 flex items-center justify-between">
                            <div>
                                <h4 className="font-bold text-lg text-gray-900">Verified Moment</h4>
                                <p className="text-sm text-gray-500">{imageReviews[imageIdx]?.authorName || "Happy Family"}</p>
                            </div>
                            <div className="flex items-center gap-1 bg-green-50 text-green-600 px-3 py-1 rounded-full text-xs font-bold">
                                <Star size={12} className="fill-green-600" /> Verified Purchase
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CustomerReviews;
