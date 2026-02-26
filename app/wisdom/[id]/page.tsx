import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock, Tag } from "lucide-react";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

const TAG_COLORS: Record<string, string> = {
    স্বাস্থ্য: "bg-emerald-100 text-emerald-700",
    পুষ্টি: "bg-amber-100 text-amber-700",
    কৃষি: "bg-lime-100 text-lime-700",
    রেসিপি: "bg-rose-100 text-rose-700",
};

export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const post = await prisma.blogPost.findUnique({ where: { id: parseInt(id, 10) } });
    if (!post) return { title: "নিবন্ধ পাওয়া যায়নি" };
    return {
        title: `${post.title} | ফল জ্ঞান`,
        description: post.excerpt,
    };
}

export default async function WisdomPostPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const postId = parseInt(id, 10);

    if (isNaN(postId)) notFound();

    const post = await prisma.blogPost.findUnique({ where: { id: postId } });

    if (!post || !post.published) notFound();

    // Render content: convert **bold** markdown to <strong> and newlines to <br>
    const renderContent = (text: string) => {
        return text.split("\n").map((line, i) => {
            const parts = line.split(/\*\*(.*?)\*\*/g);
            return (
                <span key={i}>
                    {parts.map((part, j) =>
                        j % 2 === 1 ? (
                            <strong key={j} className="font-bold text-organic-green">
                                {part}
                            </strong>
                        ) : (
                            part
                        )
                    )}
                    <br />
                </span>
            );
        });
    };

    return (
        <main className="min-h-screen bg-white">
            {/* Hero Image */}
            <div className="relative h-72 md:h-[480px] w-full">
                <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    priority
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
                    <div className="container mx-auto max-w-4xl">
                        <span
                            className={`inline-block text-xs font-bold px-3 py-1 rounded-full mb-4 ${TAG_COLORS[post.tag] ?? "bg-white/90 text-primary"}`}
                        >
                            {post.tag}
                        </span>
                        <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">
                            {post.title}
                        </h1>
                    </div>
                </div>
            </div>

            {/* Article Body */}
            <div className="container mx-auto max-w-4xl px-4 md:px-6 py-12">
                {/* Meta */}
                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400 mb-10 pb-8 border-b border-gray-100">
                    <span className="flex items-center gap-2">
                        <Clock size={15} />
                        {new Date(post.createdAt).toLocaleDateString("bn-BD", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                        })}
                    </span>
                    <span className="flex items-center gap-2">
                        <Tag size={15} />
                        {post.readTime}
                    </span>
                </div>

                {/* Excerpt */}
                <p className="text-lg md:text-xl text-gray-600 italic mb-10 leading-relaxed border-l-4 border-primary pl-6">
                    {post.excerpt}
                </p>

                {/* Full content */}
                <div className="prose prose-lg max-w-none text-gray-700 leading-loose text-base md:text-lg">
                    {renderContent(post.content)}
                </div>

                {/* Back link */}
                <div className="mt-16 pt-8 border-t border-gray-100">
                    <Link
                        href="/wisdom"
                        className="inline-flex items-center gap-2 text-primary font-bold hover:-translate-x-1 transition-transform"
                    >
                        <ArrowLeft size={18} /> সব নিবন্ধে ফিরে যান
                    </Link>
                </div>
            </div>
        </main>
    );
}
