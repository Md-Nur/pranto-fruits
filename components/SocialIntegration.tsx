"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle, X, Youtube, Play, ArrowRight, Instagram, ChevronLeft, ChevronRight, Volume2, VolumeX, Share2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const getVideoId = (videoUrl: string) => {
    return videoUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|shorts\/|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
};

const getYoutubeThumbnail = (videoUrl: string) => {
    const videoId = getVideoId(videoUrl);
    return videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : "";
};

const stories = [
    { id: 1, title: "Traditional Mango Harvest", video: "https://www.youtube.com/shorts/03jKaOUNg5g" },
    { id: 2, title: "Premium Quality Check", video: "https://www.youtube.com/shorts/sZ4FU6jEBLA" },
    { id: 3, title: "Innovative Packing", video: "https://www.youtube.com/shorts/BFgiIcCTe9M" },
    { id: 4, title: "Eco-Friendly Packaging", video: "https://www.youtube.com/shorts/gbn7iQuu44M" },
];



const SocialIntegration = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeStory, setActiveStory] = useState<number | null>(null);
    const [isMuted, setIsMuted] = useState(true);
    const [progress, setProgress] = useState(0);
    const pathname = usePathname();

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (activeStory !== null) {
            setProgress(0);
            interval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 100) {
                        handleNext();
                        return 0;
                    }
                    return prev + 1;
                });
            }, 150); // 15 seconds total (100 * 150ms)
        }
        return () => clearInterval(interval);
    }, [activeStory]);

    const handleNext = () => {
        if (activeStory === null) return;
        if (activeStory < stories.length - 1) {
            setActiveStory(activeStory + 1);
        } else {
            setActiveStory(null);
        }
    };

    const handlePrev = () => {
        if (activeStory === null) return;
        if (activeStory > 0) {
            setActiveStory(activeStory - 1);
        }
    };

    const handleShare = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (activeStory === null) return;

        const story = stories[activeStory];
        if (navigator.share) {
            navigator.share({
                title: story.title,
                text: `Check out this Garden Story: ${story.title}`,
                url: story.video,
            }).catch(console.error);
        } else {
            // Fallback: Copy to clipboard
            navigator.clipboard.writeText(story.video);
            alert("Link copied to clipboard!");
        }
    };

    const handleSendMessage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (activeStory === null) return;

        const story = stories[activeStory];
        const message = encodeURIComponent(`Hi! I'm watching your Garden Story: "${story.title}" and I have a question: `);
        window.open(`https://wa.me/8801XXXXXXXXX?text=${message}`, "_blank");
    };

    return (
        <>
            {/* Story Viewer Modal */}
            <AnimatePresence>
                {activeStory !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-0 md:p-4"
                    >
                        <div className="relative w-full h-full max-w-[450px] md:h-[800px] bg-black md:rounded-3xl overflow-hidden shadow-2xl flex flex-col">
                            {/* Progress Bars */}
                            <div className="absolute top-4 left-4 right-4 z-50 flex gap-1">
                                {stories.map((_, idx) => (
                                    <div key={idx} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-white transition-all duration-100 ease-linear"
                                            style={{
                                                width: idx < activeStory ? "100%" : idx === activeStory ? `${progress}%` : "0%"
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Header */}
                            <div className="absolute top-8 left-4 right-4 z-50 flex items-center justify-between text-white">
                                <div className="flex items-center gap-3 relative z-50">
                                    <div className="w-10 h-10 rounded-full border-2 border-primary p-0.5">
                                        <img
                                            src={getYoutubeThumbnail(stories[activeStory].video)}
                                            alt=""
                                            className="w-full h-full rounded-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm leading-tight">{stories[activeStory].title}</p>
                                        <p className="text-[10px] opacity-70">Organic Garden</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 relative z-50">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }}
                                        className="p-1 hover:scale-110 transition-transform"
                                    >
                                        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setActiveStory(null); }}
                                        className="p-1 hover:scale-110 transition-transform"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>
                            </div>

                            {/* Video Content */}
                            <div className="flex-1 relative bg-black flex items-center justify-center">
                                {activeStory !== null && (
                                    <iframe
                                        src={`https://www.youtube.com/embed/${getVideoId(stories[activeStory].video)}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&rel=0&showinfo=0&iv_load_policy=3&modestbranding=1`}
                                        className="w-full h-full border-0 pointer-events-none"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        title={stories[activeStory].title}
                                    />
                                )}

                                {/* Navigation overlay triggers */}
                                <div className="absolute inset-y-0 left-0 w-1/4 z-30 cursor-left" onClick={handlePrev} />
                                <div className="absolute inset-y-0 right-0 w-1/4 z-30 cursor-right" onClick={handleNext} />
                            </div>

                            {/* Footer Interaction */}
                            <div className="p-6 bg-gradient-to-t from-black to-transparent absolute bottom-0 inset-x-0 z-50">
                                <div className="flex items-center gap-4 relative z-50">
                                    <button
                                        onClick={handleSendMessage}
                                        className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 text-white py-3 rounded-full font-bold text-sm hover:bg-white/20 transition-all"
                                    >
                                        Send Message
                                    </button>
                                    <button
                                        onClick={handleShare}
                                        className="w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all"
                                    >
                                        <Share2 size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Desktop Side Navigation */}
                        <button
                            onClick={handlePrev}
                            className="hidden md:flex absolute left-8 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full items-center justify-center text-white transition-all disabled:opacity-30"
                            disabled={activeStory === 0}
                        >
                            <ChevronLeft size={32} />
                        </button>
                        <button
                            onClick={handleNext}
                            className="hidden md:flex absolute right-8 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full items-center justify-center text-white transition-all disabled:opacity-30"
                            disabled={activeStory === stories.length - 1}
                        >
                            <ChevronRight size={32} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
            {/* YouTube Stories Section */}
            {pathname === "/" && (
                <section className="py-24 bg-white relative overflow-hidden">
                    {/* Decorative background elements */}
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
                    <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl" />

                    <div className="container mx-auto px-4 md:px-6 relative">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-red-50 relative rounded-2xl flex items-center justify-center overflow-hidden group">
                                    <div className="absolute inset-0 bg-red-600 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                    <Youtube size={32} className="text-red-600 group-hover:text-white transition-colors relative z-10" />
                                </div>
                                <div>
                                    <h2 className="text-3xl md:text-4xl font-black text-organic-green font-hind-siliguri leading-tight">গার্ডেন স্টোরিজ</h2>
                                    <p className="text-gray-500 font-medium">Watch our daily harvest journey</p>
                                </div>
                            </div>
                            <button className="flex items-center gap-2 text-gray-400 hover:text-primary font-bold transition-all text-sm uppercase tracking-widest">
                                View All Stories <ArrowRight size={18} />
                            </button>
                        </div>

                        <div className="flex gap-8 overflow-x-auto pb-12 scrollbar-hide no-scrollbar -mx-4 px-4">
                            {stories.map((story, idx) => (
                                <div
                                    key={story.id}
                                    className="flex-shrink-0 group cursor-pointer"
                                    onClick={() => setActiveStory(idx)}
                                >
                                    <div className="w-24 h-24 md:w-36 md:h-36 rounded-full p-1.5 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 relative transition-transform duration-500 group-hover:scale-105 active:scale-95">
                                        <div className="w-full h-full rounded-full border-[3px] border-white overflow-hidden relative shadow-lg">
                                            <img
                                                src={getYoutubeThumbnail(story.video)}
                                                alt={story.title}
                                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors flex items-center justify-center">
                                                <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform scale-50 group-hover:scale-100 border border-white/30">
                                                    <Play size={20} className="text-white fill-white ml-0.5" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-center mt-4 text-xs font-bold text-gray-700 max-w-[96px] md:max-w-[144px] mx-auto line-clamp-1 group-hover:text-primary transition-colors">
                                        {story.title}
                                    </p>
                                </div>
                            ))}

                            {/* View More Circle */}
                            <div className="flex-shrink-0 cursor-pointer group">
                                <div className="w-24 h-24 md:w-36 md:h-36 rounded-full border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 group-hover:border-primary group-hover:bg-primary/5 group-hover:text-primary transition-all active:scale-95">
                                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-2 group-hover:bg-primary/10 transition-colors">
                                        <Instagram size={28} />
                                    </div>
                                    <span className="text-[10px] md:text-xs font-black uppercase tracking-widest">More</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Floating WhatsApp Widget */}
            <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-4">
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.8 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.8 }}
                            className="bg-white rounded-[2rem] shadow-2xl border border-gray-100 p-6 max-w-[320px] mb-2"
                        >
                            <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-50">
                                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-primary/10">
                                    <img src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=100&auto=format&fit=crop" alt="Support" className="w-full h-full object-cover" />
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-organic-green">Fresh Support</h4>
                                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Online Now</p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-6">
                                Hello! 👋 <br />
                                Need help choosing the right mangoes or tracking your order? Chat with us now!
                            </p>
                            <a
                                href="https://wa.me/8801XXXXXXXXX"
                                target="_blank"
                                className="bg-[#25D366] text-white w-full py-4 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-[#20ba59] transition-all"
                            >
                                <MessageCircle size={20} /> Start Chatting
                            </a>
                        </motion.div>
                    )}
                </AnimatePresence>

                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={cn(
                        "w-16 h-16 rounded-full flex items-center justify-center text-white shadow-2xl transition-all transform hover:scale-110",
                        isOpen ? "bg-gray-800 rotate-90" : "bg-[#25D366]"
                    )}
                >
                    {isOpen ? <X size={30} /> : <MessageCircle size={32} />}
                    {/* Badge */}
                    {!isOpen && (
                        <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 border-2 border-white rounded-full text-[10px] font-bold flex items-center justify-center animate-bounce">1</span>
                    )}
                </button>
            </div>
        </>
    );
};

export default SocialIntegration;
