"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit3, Trash2, Youtube, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import FruitLoading from "@/components/FruitLoading";

const getVideoId = (videoUrl: string) => {
    return videoUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|shorts\/|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
};

const getYoutubeThumbnail = (videoUrl: string) => {
    const videoId = getVideoId(videoUrl);
    return videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : "";
};

export default function AdminStoriesPage() {
    const [stories, setStories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingStory, setEditingStory] = useState<any>(null);

    // Form fields
    const [title, setTitle] = useState("");
    const [videoUrl, setVideoUrl] = useState("");
    const [published, setPublished] = useState(true);

    const fetchStories = async () => {
        try {
            const res = await fetch("/api/admin/stories");
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            setStories(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Failed to fetch stories", err);
            setStories([]);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchStories();
    }, []);

    useEffect(() => {
        if (editingStory) {
            setTitle(editingStory.title);
            setVideoUrl(editingStory.videoUrl);
            setPublished(editingStory.published);
        } else {
            setTitle("");
            setVideoUrl("");
            setPublished(true);
        }
    }, [editingStory]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const method = editingStory ? "PUT" : "POST";
            const url_api = editingStory ? `/api/stories/${editingStory.id}` : "/api/stories";
            
            const res = await fetch(url_api, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, videoUrl, published }),
            });

            if (res.ok) {
                setModalOpen(false);
                setEditingStory(null);
                fetchStories();
            }
        } catch (err) {
            console.error("Save failed", err);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure?")) return;
        try {
            await fetch(`/api/stories/${id}`, { method: "DELETE" });
            fetchStories();
        } catch (err) {
            console.error("Delete failed", err);
        }
    };

    if (loading) return <FruitLoading />;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Manage Garden Stories</h1>
                <button
                    onClick={() => { setEditingStory(null); setModalOpen(true); }}
                    className="flex items-center gap-2 bg-emerald-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-600 transition-colors shadow-sm shadow-emerald-200"
                >
                    <Plus size={18} /> Add Story
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stories.map((story) => (
                    <div key={story.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden group hover:shadow-lg transition-all duration-300">
                        <div className="aspect-[9/16] relative bg-slate-100 flex items-center justify-center overflow-hidden">
                            {story.videoUrl ? (
                                <img 
                                    src={getYoutubeThumbnail(story.videoUrl)} 
                                    alt={story.title} 
                                    className="w-full h-full object-cover" 
                                />
                            ) : (
                                <Video size={48} className="text-gray-300" />
                            )}
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => { setEditingStory(story); setModalOpen(true); }}
                                        className="p-3 bg-white text-blue-600 rounded-full hover:bg-blue-50 shadow-lg"
                                    >
                                        <Edit3 size={20} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(story.id)}
                                        className="p-3 bg-white text-red-600 rounded-full hover:bg-red-50 shadow-lg"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                            {!story.published && (
                                <div className="absolute top-4 left-4 bg-gray-900/80 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                                    Draft
                                </div>
                            )}
                            <div className="absolute top-4 right-4 text-white">
                                <Youtube size={24} className="drop-shadow-lg" />
                            </div>
                        </div>
                        <div className="p-4">
                            <h3 className="font-bold text-gray-900 line-clamp-2">{story.title}</h3>
                            <p className="text-xs text-gray-400 mt-1">{new Date(story.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden my-8">
                        <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900">{editingStory ? "Edit Story" : "Add New Story"}</h2>
                            <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">×</button>
                        </div>
                        <form onSubmit={handleSave} className="p-8 space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">Story Title</label>
                                <input
                                    type="text"
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Enter story title"
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">YouTube Shorts URL</label>
                                <input
                                    type="text"
                                    required
                                    value={videoUrl}
                                    onChange={(e) => setVideoUrl(e.target.value)}
                                    placeholder="https://www.youtube.com/shorts/..."
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="published"
                                    checked={published}
                                    onChange={(e) => setPublished(e.target.checked)}
                                    className="w-4 h-4 text-emerald-500 border-gray-300 rounded focus:ring-emerald-500"
                                />
                                <label htmlFor="published" className="text-sm font-medium text-gray-700">Published</label>
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
                                    className="flex-1 py-3 text-sm font-bold text-white bg-emerald-500 rounded-xl hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-200"
                                >
                                    {editingStory ? "Update Story" : "Add Story"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
