"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit3, Trash2, FileText, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import FruitLoading from "@/components/FruitLoading";
import BlogFormModal from "@/components/admin/BlogFormModal";

export default function AdminBlogPage() {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingPost, setEditingPost] = useState<any>(null);

    const fetchPosts = async () => {
        try {
            const res = await fetch("/api/admin/blog");
            const data = await res.json();
            setPosts(data.posts || []);
        } catch (err) {
            console.error("Failed to fetch posts", err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleSave = async (formData: any) => {
        const url = editingPost
            ? `/api/admin/blog/${editingPost.id}`
            : "/api/admin/blog";
        const method = editingPost ? "PUT" : "POST";

        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        if (!res.ok) throw new Error("Failed to save");
        setEditingPost(null);
        await fetchPosts();
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Delete this blog post?")) return;
        try {
            await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
            await fetchPosts();
        } catch (err) {
            console.error("Failed to delete post", err);
        }
    };

    const togglePublished = async (post: any) => {
        try {
            await fetch(`/api/admin/blog/${post.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...post, published: !post.published }),
            });
            await fetchPosts();
        } catch (err) {
            console.error("Failed to toggle published", err);
        }
    };

    if (loading) return <FruitLoading />;

    return (
        <div className="space-y-6">
            {/* Actions Bar */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-gray-400 font-medium">{posts.length} posts</p>
                <button
                    onClick={() => { setEditingPost(null); setModalOpen(true); }}
                    className="flex items-center gap-2 bg-emerald-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-600 transition-colors shadow-sm shadow-emerald-200"
                >
                    <Plus size={18} /> New Post
                </button>
            </div>

            {/* Blog Posts Grid */}
            {posts.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 text-center py-16">
                    <FileText size={48} className="mx-auto text-gray-200 mb-4" />
                    <p className="text-gray-400 font-medium">No blog posts yet</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {posts.map((post) => (
                        <div key={post.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
                            {/* Image */}
                            <div className="relative h-40 overflow-hidden">
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-3 left-3 flex gap-2">
                                    <span className="text-[10px] font-bold bg-white/90 backdrop-blur-sm text-gray-700 px-2.5 py-1 rounded-full">
                                        {post.tag}
                                    </span>
                                </div>
                                <div className="absolute top-3 right-3">
                                    <span className={cn(
                                        "text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-sm",
                                        post.published
                                            ? "bg-emerald-500/90 text-white"
                                            : "bg-gray-500/90 text-white"
                                    )}>
                                        {post.published ? "Published" : "Draft"}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-5">
                                <h3 className="font-bold text-gray-900 line-clamp-2 mb-2 leading-snug">{post.title}</h3>
                                <p className="text-xs text-gray-400 line-clamp-2 mb-4">{post.excerpt}</p>

                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] text-gray-400 font-medium">
                                        {post.readTime} · {new Date(post.createdAt).toLocaleDateString("en-GB", {
                                            day: "2-digit", month: "short", year: "numeric",
                                        })}
                                    </span>
                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => togglePublished(post)}
                                            className={cn(
                                                "p-1.5 rounded-lg transition-colors",
                                                post.published
                                                    ? "text-gray-400 hover:text-amber-600 hover:bg-amber-50"
                                                    : "text-gray-400 hover:text-emerald-600 hover:bg-emerald-50"
                                            )}
                                            title={post.published ? "Unpublish" : "Publish"}
                                        >
                                            {post.published ? <EyeOff size={14} /> : <Eye size={14} />}
                                        </button>
                                        <button
                                            onClick={() => { setEditingPost(post); setModalOpen(true); }}
                                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="Edit"
                                        >
                                            <Edit3 size={14} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(post.id)}
                                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Blog Form Modal */}
            <BlogFormModal
                isOpen={modalOpen}
                onClose={() => { setModalOpen(false); setEditingPost(null); }}
                onSave={handleSave}
                post={editingPost}
            />
        </div>
    );
}
