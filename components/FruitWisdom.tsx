import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";

const articles = [
    {
        title: "কাঁচা আমের অবিশ্বাস্য স্বাস্থ্য উপকারিতা",
        excerpt: "কাঁচা আম শুধু সুস্বাদুই নয়, এতে রয়েছে প্রচুর ভিটামিন ও অ্যান্টিঅক্সিডেন্ট যা রোগ প্রতিরোধ ক্ষমতা বাড়ায়।",
        image: "https://images.unsplash.com/photo-1655168339415-fc5a98a7184f?q=80&w=522&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        date: "১২ মে, ২০২৪",
        readTime: "৫ মিনিট পড়া",
        tag: "স্বাস্থ্য"
    },
    {
        title: "কেন মরিয়ম খেজুর একটি আদর্শ সুপারফুড",
        excerpt: "ফাইবার ও প্রাকৃতিক চিনিতে ভরপুর খেজুর আপনার ব্যস্ত জীবনে দীর্ঘস্থায়ী শক্তি জোগায়।",
        image: "https://plus.unsplash.com/premium_photo-1676208753932-6e8bc83a0b0d?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        date: "২৮ এপ্রিল, ২০২৪",
        readTime: "৪ মিনিট পড়া",
        tag: "পুষ্টি"
    },
    {
        title: "টেকসই চাষাবাদ: আমাদের ২-ধাপ প্রক্রিয়া",
        excerpt: "জানুন কীভাবে আমরা ফসল সংগ্রহ থেকে আপনার ঘর পর্যন্ত ১০০% রাসায়নিকমুক্ত রাখি।",
        image: "https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?q=80&w=2070&auto=format&fit=crop",
        date: "১৫ এপ্রিল, ২০২৪",
        readTime: "৬ মিনিট পড়া",
        tag: "কৃষি"
    }
];

const FruitWisdom = () => {
    return (
        <section className="py-20 bg-surface">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div className="max-w-xl">
                        <h2 className="text-3xl md:text-4xl font-bold text-organic-green mb-4">ফল জ্ঞান ও টিপস</h2>
                        <p className="text-gray-600">আপনার প্রিয় ফল সম্পর্কে টিপস, রেসিপি এবং স্বাস্থ্যের রহস্য আবিষ্কার করুন।</p>
                    </div>
                    <Link href="/wisdom" className="flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all">
                        সব নিবন্ধ দেখুন <ArrowRight size={20} />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {articles.map((article, index) => (
                        <article key={index} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 group">
                            <div className="relative h-56 overflow-hidden">
                                <Image
                                    src={article.image}
                                    alt={article.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                    {article.tag}
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                                    <span className="flex items-center gap-1"><Clock size={14} /> {article.date}</span>
                                    <span>{article.readTime}</span>
                                </div>
                                <h3 className="text-xl font-bold text-organic-green mb-3 line-clamp-2 leading-tight">
                                    {article.title}
                                </h3>
                                <p className="text-gray-600 text-sm line-clamp-3 mb-6">
                                    {article.excerpt}
                                </p>
                                <button className="text-primary font-bold inline-flex items-center gap-2 group/btn">
                                    আরও পড়ুন <ArrowRight size={16} className="transition-transform group-hover/btn:translate-x-1" />
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FruitWisdom;
