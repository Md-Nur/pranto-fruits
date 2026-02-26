import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, Tag } from "lucide-react";
import prisma from "@/lib/prisma";

export const metadata = {
    title: "ফল জ্ঞান ও টিপস | Fruits",
    description: "আপনার প্রিয় ফল সম্পর্কে টিপস, রেসিপি এবং স্বাস্থ্যের রহস্য আবিষ্কার করুন।",
};

const TAG_COLORS: Record<string, string> = {
    স্বাস্থ্য: "bg-emerald-100 text-emerald-700",
    পুষ্টি: "bg-amber-100 text-amber-700",
    কৃষি: "bg-lime-100 text-lime-700",
    রেসিপি: "bg-rose-100 text-rose-700",
};

export default async function WisdomPage() {
    const posts = await prisma.blogPost.findMany({
        where: { published: true },
        orderBy: { createdAt: "desc" },
    });

    return (
        <main className="min-h-screen bg-surface">
            {/* Hero */}
            <section className="relative py-24 overflow-hidden bg-organic-green">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-primary blur-3xl" />
                    <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-yellow-400 blur-3xl" />
                </div>
                <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
                    <span className="inline-block bg-white/10 text-white text-sm font-semibold px-4 py-2 rounded-full mb-6 backdrop-blur-sm border border-white/20">
                        📚 জ্ঞান ভান্ডার
                    </span>
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                        ফল জ্ঞান ও টিপস
                    </h1>
                    <p className="text-emerald-100/80 text-lg max-w-2xl mx-auto">
                        আপনার প্রিয় ফল সম্পর্কে টিপস, রেসিপি এবং স্বাস্থ্যের রহস্য আবিষ্কার করুন।
                    </p>
                </div>
            </section>

            {/* Posts Grid */}
            <section className="py-20">
                <div className="container mx-auto px-4 md:px-6">
                    {posts.length === 0 ? (
                        <div className="text-center py-20 text-gray-400 text-lg">
                            কোনো নিবন্ধ পাওয়া যায়নি।
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {posts.map((post) => (
                                <article
                                    key={post.id}
                                    className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group flex flex-col"
                                >
                                    <div className="relative h-56 overflow-hidden flex-shrink-0">
                                        <Image
                                            src={post.image}
                                            alt={post.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                                        <span
                                            className={`absolute top-4 left-4 text-xs font-bold px-3 py-1 rounded-full ${TAG_COLORS[post.tag] ?? "bg-white/90 text-primary"}`}
                                        >
                                            {post.tag}
                                        </span>
                                    </div>

                                    <div className="p-6 flex flex-col flex-1">
                                        <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                                            <span className="flex items-center gap-1">
                                                <Clock size={13} />
                                                {new Date(post.createdAt).toLocaleDateString("bn-BD", {
                                                    day: "numeric",
                                                    month: "long",
                                                    year: "numeric",
                                                })}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Tag size={13} />
                                                {post.readTime}
                                            </span>
                                        </div>

                                        <h2 className="text-xl font-bold text-organic-green mb-3 line-clamp-2 leading-snug">
                                            {post.title}
                                        </h2>
                                        <p className="text-gray-500 text-sm line-clamp-3 mb-6 flex-1">
                                            {post.excerpt}
                                        </p>

                                        <Link
                                            href={`/wisdom/${post.id}`}
                                            className="inline-flex items-center gap-2 text-primary font-bold text-sm group/link mt-auto"
                                        >
                                            সম্পূর্ণ পড়ুন
                                            <ArrowRight
                                                size={15}
                                                className="transition-transform group-hover/link:translate-x-1"
                                            />
                                        </Link>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
