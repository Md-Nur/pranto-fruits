import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import prisma from "@/lib/prisma";

const FruitWisdom = async () => {
    const articles = await prisma.blogPost.findMany({
        where: { published: true },
        orderBy: { createdAt: "desc" },
        take: 3,
    });

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
                    {articles.map((article) => (
                        <article key={article.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 group">
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
                                    <span className="flex items-center gap-1">
                                        <Clock size={14} />
                                        {new Date(article.createdAt).toLocaleDateString("bn-BD", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                        })}
                                    </span>
                                    <span>{article.readTime}</span>
                                </div>
                                <h3 className="text-xl font-bold text-organic-green mb-3 line-clamp-2 leading-tight">
                                    {article.title}
                                </h3>
                                <p className="text-gray-600 text-sm line-clamp-3 mb-6">
                                    {article.excerpt}
                                </p>
                                <Link
                                    href={`/wisdom/${article.id}`}
                                    className="text-primary font-bold inline-flex items-center gap-2 group/btn"
                                >
                                    আরও পড়ুন <ArrowRight size={16} className="transition-transform group-hover/btn:translate-x-1" />
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FruitWisdom;
