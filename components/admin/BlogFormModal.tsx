"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface BlogFormData {
    title: string;
    excerpt: string;
    content: string;
    image: string;
    tag: string;
    readTime: string;
    published: boolean;
}

interface BlogFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: BlogFormData) => Promise<void>;
    post?: any;
}

const emptyForm: BlogFormData = {
    title: "",
    excerpt: "",
    content: "",
    image: "",
    tag: "",
    readTime: "",
    published: true,
};

const BlogFormModal = ({ isOpen, onClose, onSave, post }: BlogFormModalProps) => {
    const [form, setForm] = useState<BlogFormData>(emptyForm);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (post) {
            setForm({
                title: post.title || "",
                excerpt: post.excerpt || "",
                content: post.content || "",
                image: post.image || "",
                tag: post.tag || "",
                readTime: post.readTime || "",
                published: post.published !== undefined ? post.published : true,
            });
        } else {
            setForm(emptyForm);
        }
    }, [post, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await onSave(form);
            onClose();
        } catch (err) {
            console.error(err);
        }
        setSaving(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 rounded-t-2xl flex items-center justify-between z-10">
                    <h2 className="text-lg font-bold text-gray-900">{post ? "Edit Post" : "New Post"}</h2>
                    <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                        <X size={20} className="text-gray-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Title */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Title *</label>
                        <input
                            type="text"
                            required
                            value={form.title}
                            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                            placeholder="Blog post title"
                        />
                    </div>

                    {/* Tag + Read Time */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Tag *</label>
                            <input
                                type="text"
                                required
                                value={form.tag}
                                onChange={(e) => setForm((p) => ({ ...p, tag: e.target.value }))}
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                placeholder="e.g. Health, Nutrition"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Read Time</label>
                            <input
                                type="text"
                                value={form.readTime}
                                onChange={(e) => setForm((p) => ({ ...p, readTime: e.target.value }))}
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                placeholder="5 min read"
                            />
                        </div>
                    </div>

                    {/* Image URL */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Cover Image URL *</label>
                        <input
                            type="url"
                            required
                            value={form.image}
                            onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))}
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                            placeholder="https://images.unsplash.com/..."
                        />
                        {form.image && (
                            <img src={form.image} alt="Preview" className="mt-2 h-32 w-full object-cover rounded-xl border border-gray-200" />
                        )}
                    </div>

                    {/* Excerpt */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Excerpt *</label>
                        <textarea
                            required
                            rows={2}
                            value={form.excerpt}
                            onChange={(e) => setForm((p) => ({ ...p, excerpt: e.target.value }))}
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none"
                            placeholder="Short summary of the post..."
                        />
                    </div>

                    {/* Content */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Content *</label>
                        <textarea
                            required
                            rows={8}
                            value={form.content}
                            onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none font-mono"
                            placeholder="Full blog post content (supports markdown-like formatting)..."
                        />
                    </div>

                    {/* Published Toggle */}
                    <label className="flex items-center gap-3 cursor-pointer">
                        <div className="relative">
                            <input
                                type="checkbox"
                                checked={form.published}
                                onChange={(e) => setForm((p) => ({ ...p, published: e.target.checked }))}
                                className="sr-only"
                            />
                            <div className={cn("w-10 h-5 rounded-full transition-colors", form.published ? "bg-emerald-500" : "bg-gray-200")} />
                            <div className={cn("absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform", form.published && "translate-x-5")} />
                        </div>
                        <span className="text-sm font-medium text-gray-700">Published</span>
                    </label>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t border-gray-100">
                        <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 px-4 py-2.5 bg-emerald-500 text-white rounded-xl text-sm font-bold hover:bg-emerald-600 disabled:opacity-50 transition-colors"
                        >
                            {saving ? "Saving..." : post ? "Update Post" : "Create Post"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BlogFormModal;
