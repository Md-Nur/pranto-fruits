import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";

const articles = [
    {
        title: "The Incredible Health Benefits of Green Mango",
        excerpt: "Green mangoes are not just tasty; they are packed with vitamins and antioxidants that boost immunity.",
        image: "https://images.unsplash.com/photo-1655168339415-fc5a98a7184f?q=80&w=522&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        date: "May 12, 2024",
        readTime: "5 min read",
        tag: "Health"
    },
    {
        title: "Why Maryam Dates are the Perfect Superfood",
        excerpt: "Rich in fiber and natural sugars, dates provide sustained energy for your busy lifestyle.",
        image: "https://plus.unsplash.com/premium_photo-1676208753932-6e8bc83a0b0d?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        date: "April 28, 2024",
        readTime: "4 min read",
        tag: "Nutrition"
    },
    {
        title: "Sustainable Farming: Our 2-Step Process",
        excerpt: "Learn how we ensure our fruits remain 100% chemical-free from harvest to your home.",
        image: "https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?q=80&w=2070&auto=format&fit=crop",
        date: "April 15, 2024",
        readTime: "6 min read",
        tag: "Farming"
    }
];

const FruitWisdom = () => {
    return (
        <section className="py-20 bg-surface">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div className="max-w-xl">
                        <h2 className="text-3xl md:text-4xl font-bold text-organic-green mb-4 font-hind-siliguri">ফল বিজ্ঞান: Fruit Wisdom</h2>
                        <p className="text-gray-600">Discover tips, recipes, and health secrets about the fruits you love.</p>
                    </div>
                    <Link href="/wisdom" className="flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all">
                        View All Articles <ArrowRight size={20} />
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
                                    Read More <ArrowRight size={16} className="transition-transform group-hover/btn:translate-x-1" />
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
