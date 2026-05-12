"use client";

import React, { useState, useEffect } from "react";
import { Plus, Search, Edit3, Trash2, Youtube, Image as ImageIcon, Star, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import FruitLoading from "@/components/FruitLoading";

export default function AdminReviewsPage() {
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingReview, setEditingReview] = useState<any>(null);
    const [isUploading, setIsUploading] = useState(false);

    // Form fields
    const [title, setTitle] = useState("");
    const [type, setType] = useState<"VIDEO" | "IMAGE">("VIDEO");
    const [url, setUrl] = useState("");
    const [authorName, setAuthorName] = useState("");
    const [authorLink, setAuthorLink] = useState("");
    const [rating, setRating] = useState(5);

    const fetchReviews = async () => {
        try {
            const res = await fetch("/api/reviews");
            const data = await res.json();
            setReviews(data);
        } catch (err) {
            console.error("Failed to fetch reviews", err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    useEffect(() => {
        if (editingReview) {
            setTitle(editingReview.title);
            setType(editingReview.type);
            setUrl(editingReview.url);
            setAuthorName(editingReview.authorName || "");
            setAuthorLink(editingReview.authorLink || "");
            setRating(editingReview.rating || 5);
        } else {
            setTitle("");
            setType("VIDEO");
            setUrl("");
            setAuthorName("");
            setAuthorLink("");
            setRating(5);
        }
    }, [editingReview]);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append("image", file);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            if (data.url) {
                setUrl(data.url);
                setType("IMAGE");
            }
        } catch (err) {
            console.error("Upload failed", err);
        } finally {
            setIsUploading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const method = editingReview ? "PUT" : "POST";
            const url_api = editingReview ? `/api/reviews/${editingReview.id}` : "/api/reviews";
            
            const res = await fetch(url_api, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, type, url, authorName, authorLink, rating }),
            });

            if (res.ok) {
                setModalOpen(false);
                setEditingReview(null);
                fetchReviews();
            }
        } catch (err) {
            console.error("Save failed", err);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure?")) return;
        try {
            await fetch(`/api/reviews/${id}`, { method: "DELETE" });
            fetchReviews();
        } catch (err) {
            console.error("Delete failed", err);
        }
    };

    if (loading) return <FruitLoading />;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Manage Reviews</h1>
                <button
                    onClick={() => { setEditingReview(null); setModalOpen(true); }}
                    className="flex items-center gap-2 bg-emerald-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-600 transition-colors shadow-sm shadow-emerald-200"
                >
                    <Plus size={18} /> Add Review
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reviews.map((review) => (
                    <div key={review.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden group hover:shadow-lg transition-all duration-300">
                        <div className="aspect-video relative bg-slate-100 flex items-center justify-center">
                            {review.type === "VIDEO" ? (
                                <div className="text-red-500 flex flex-col items-center gap-2">
                                    <Youtube size={48} />
                                    <span className="text-xs font-bold uppercase tracking-wider">Video Review</span>
                                </div>
                            ) : (
                                <img src={review.url} alt={review.title} className="w-full h-full object-cover" />
                            )}
                            <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => { setEditingReview(review); setModalOpen(true); }}
                                    className="p-2 bg-white/90 backdrop-blur shadow-md text-blue-600 rounded-lg hover:bg-white"
                                >
                                    <Edit3 size={16} />
                                </button>
                                <button
                                    onClick={() => handleDelete(review.id)}
                                    className="p-2 bg-white/90 backdrop-blur shadow-md text-red-600 rounded-lg hover:bg-white"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                        <div className="p-5">
                            <div className="flex items-center gap-1 text-yellow-400 mb-2">
                                {[...Array(review.rating)].map((_, i) => <Star key={i} size={14} className="fill-current" />)}
                            </div>
                            <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">{review.title}</h3>
                            <p className="text-sm text-gray-500 mb-4">{review.authorName || "Anonymous"}</p>
                            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                <span className={cn(
                                    "text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded",
                                    review.type === "VIDEO" ? "bg-red-50 text-red-500" : "bg-blue-50 text-blue-500"
                                )}>
                                    {review.type}
                                </span>
                                <span className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden my-8">
                        <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900">{editingReview ? "Edit Review" : "Add New Review"}</h2>
                            <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">×</button>
                        </div>
                        <form onSubmit={handleSave} className="p-8 space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setType("VIDEO")}
                                    className={cn(
                                        "flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all",
                                        type === "VIDEO" ? "border-emerald-500 bg-emerald-50 text-emerald-600" : "border-gray-100 hover:border-gray-200 text-gray-400"
                                    )}
                                >
                                    <Youtube size={32} />
                                    <span className="font-bold text-xs uppercase">Video</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setType("IMAGE")}
                                    className={cn(
                                        "flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all",
                                        type === "IMAGE" ? "border-emerald-500 bg-emerald-50 text-emerald-600" : "border-gray-100 hover:border-gray-200 text-gray-400"
                                    )}
                                >
                                    <ImageIcon size={32} />
                                    <span className="font-bold text-xs uppercase">Image</span>
                                </button>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">Review Title / Quote</label>
                                <textarea
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    rows={2}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none resize-none"
                                />
                            </div>

                            {type === "VIDEO" ? (
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">YouTube URL</label>
                                    <input
                                        type="text"
                                        required
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                        placeholder="https://www.youtube.com/watch?v=..."
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                                    />
                                </div>
                            ) : (
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Image URL (or upload)</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            required
                                            value={url}
                                            onChange={(e) => setUrl(e.target.value)}
                                            className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                                        />
                                        <label className="shrink-0 bg-white border border-gray-200 p-2.5 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors flex items-center justify-center">
                                            {isUploading ? (
                                                <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent animate-spin rounded-full" />
                                            ) : (
                                                <Upload size={20} className="text-gray-400" />
                                            )}
                                            <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={isUploading} />
                                        </label>
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Author Name</label>
                                    <input
                                        type="text"
                                        value={authorName}
                                        onChange={(e) => setAuthorName(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Rating (1-5)</label>
                                    <select
                                        value={rating}
                                        onChange={(e) => setRating(parseInt(e.target.value))}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                                    >
                                        {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} Stars</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="flex-1 py-3 text-sm font-bold text-gray-500 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isUploading}
                                    className="flex-1 py-3 text-sm font-bold text-white bg-emerald-500 rounded-xl hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-200 disabled:opacity-50"
                                >
                                    Save Review
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
