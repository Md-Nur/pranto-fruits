"use client";

import React, { useState, useEffect } from "react";
import { Plus, Search, Edit3, Trash2, Tags, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import FruitLoading from "@/components/FruitLoading";

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<any>(null);

    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [image, setImage] = useState("");
    const [description, setDescription] = useState("");

    const fetchCategories = async () => {
        try {
            const res = await fetch("/api/categories");
            const data = await res.json();
            setCategories(data);
        } catch (err) {
            console.error("Failed to fetch categories", err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        if (editingCategory) {
            setName(editingCategory.name);
            setSlug(editingCategory.slug);
            setImage(editingCategory.image || "");
            setDescription(editingCategory.description || "");
        } else {
            setName("");
            setSlug("");
            setImage("");
            setDescription("");
        }
    }, [editingCategory]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const method = editingCategory ? "PUT" : "POST";
            const url = editingCategory ? `/api/categories/${editingCategory.id}` : "/api/categories";
            
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, slug, image, description }),
            });

            if (res.ok) {
                setModalOpen(false);
                setEditingCategory(null);
                fetchCategories();
            }
        } catch (err) {
            console.error("Save failed", err);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure? This may affect products in this category.")) return;
        try {
            await fetch(`/api/categories/${id}`, { method: "DELETE" });
            fetchCategories();
        } catch (err) {
            console.error("Delete failed", err);
        }
    };

    const filteredCategories = categories.filter(c => 
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return <FruitLoading />;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="relative flex-1 max-w-sm">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search categories..."
                        className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    />
                </div>

                <button
                    onClick={() => { setEditingCategory(null); setModalOpen(true); }}
                    className="flex items-center gap-2 bg-emerald-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-600 transition-colors shadow-sm shadow-emerald-200"
                >
                    <Plus size={18} /> Add Category
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCategories.map((category) => (
                    <div key={category.id} className="bg-white rounded-2xl border border-gray-100 p-5 group hover:shadow-lg transition-all duration-300">
                        <div className="flex items-start justify-between mb-4">
                            <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
                                {category.image ? (
                                    <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                        <Tags size={24} />
                                    </div>
                                )}
                            </div>
                            <div className="flex gap-1">
                                <button
                                    onClick={() => { setEditingCategory(category); setModalOpen(true); }}
                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                >
                                    <Edit3 size={16} />
                                </button>
                                <button
                                    onClick={() => handleDelete(category.id)}
                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                        <h3 className="font-bold text-gray-900 mb-1">{category.name}</h3>
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-2">/{category.slug}</p>
                        <p className="text-sm text-gray-500 line-clamp-2">{category.description || "No description provided."}</p>
                    </div>
                ))}
            </div>

            {/* Simple Modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
                        <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900">{editingCategory ? "Edit Category" : "Add New Category"}</h2>
                            <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">×</button>
                        </div>
                        <form onSubmit={handleSave} className="p-8 space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">Category Name</label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">Slug (Optional)</label>
                                <input
                                    type="text"
                                    value={slug}
                                    onChange={(e) => setSlug(e.target.value)}
                                    placeholder="mango-dates"
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">Image URL</label>
                                <input
                                    type="text"
                                    value={image}
                                    onChange={(e) => setImage(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">Description</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={3}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none resize-none"
                                />
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
                                    Save Category
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
