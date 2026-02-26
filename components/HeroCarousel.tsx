"use client";

import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

const slides = [
    {
        title: "ফলের রাজা: রাজশাহীর আম",
        subtitle: "প্রাকৃতিকভাবে পাকানো, রাসায়নিকমুক্ত",
        description: "রাজশাহীর বাগান থেকে সরাসরি আপনার দরজায় পৌঁছে দেওয়া তাজা ও খাঁটি আম।",
        image: "https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=1974&auto=format&fit=crop",
        cta: "এখনই অর্ডার করুন",
        color: "bg-orange-50"
    },
    {
        title: "প্রিমিয়াম মরিয়ম খেজুর",
        subtitle: "মিষ্টি, নরম ও পুষ্টিকর",
        description: "আপনার সুস্বাস্থ্য ও উপহারের জন্য সেরা মানের খেজুরের বাছাই করা সংগ্রহ।",
        image: "https://images.unsplash.com/photo-1614061811858-dde54a522f5e?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        cta: "খেজুর দেখুন",
        color: "bg-amber-50"
    },
    {
        title: "কর্পোরেট গিফটিং সমাধান",
        subtitle: "মার্জিত, স্বাস্থ্যকর ও পেশাদার",
        description: "আপনার ক্লায়েন্ট ও কর্মীদের জন্য চমৎকার ফলের ঝুড়ি ও বক্স উপহার দিন।",
        image: "https://images.unsplash.com/photo-1606498679463-30a0eb8824e1?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        cta: "অনুসন্ধান করুন",
        color: "bg-green-50"
    }
];

const HeroCarousel = () => {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay()]);

    const scrollPrev = React.useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = React.useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    return (
        <div className="relative overflow-hidden group">
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex">
                    {slides.map((slide, index) => (
                        <div key={index} className="flex-[0_0_100%] min-w-0 relative h-[500px] md:h-[600px]">
                            <div className={`absolute inset-0 ${slide.color}`}>
                                <div className="container mx-auto px-4 md:px-6 h-full flex flex-col md:flex-row items-center gap-8 py-12">
                                    <div className="flex-1 text-center md:text-left z-10">
                                        <h3 className="text-primary font-semibold tracking-wider uppercase text-sm mb-2">{slide.subtitle}</h3>
                                        <h1 className="text-4xl md:text-6xl font-bold text-organic-green mb-4 leading-tight">
                                            {slide.title}
                                        </h1>
                                        <p className="text-gray-600 text-lg mb-8 max-w-lg mx-auto md:mx-0">
                                            {slide.description}
                                        </p>
                                        <button className="bg-primary text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-primary-dark transition-all transform hover:scale-105 shadow-lg shadow-primary/20">
                                            {slide.cta}
                                        </button>
                                    </div>
                                    <div className="flex-1 relative w-full h-64 md:h-full">
                                        <Image
                                            src={slide.image}
                                            alt={slide.title}
                                            fill
                                            className="object-contain"
                                            priority={index === 0}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <button
                onClick={scrollPrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full glassmorphism flex items-center justify-center text-organic-green hover:bg-primary hover:text-white transition-all opacity-0 group-hover:opacity-100 hidden md:flex"
            >
                <ChevronLeft size={24} />
            </button>
            <button
                onClick={scrollNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full glassmorphism flex items-center justify-center text-organic-green hover:bg-primary hover:text-white transition-all opacity-0 group-hover:opacity-100 hidden md:flex"
            >
                <ChevronRight size={24} />
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {slides.map((_, index) => (
                    <div key={index} className="w-2 h-2 rounded-full bg-primary/20" />
                ))}
            </div>
        </div>
    );
};

export default HeroCarousel;
