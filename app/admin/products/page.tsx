"use client";

import React, { useState, useEffect } from "react";
import { Plus, Search, Edit3, Trash2, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import FruitLoading from "@/components/FruitLoading";
import ProductFormModal from "@/components/admin/ProductFormModal";

export default function AdminProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);

    const fetchData = async () => {
        try {
            // Fetch Products
            const params = new URLSearchParams();
            if (search) params.set("search", search);
            if (categoryFilter) params.set("category", categoryFilter);
            const prodRes = await fetch(`/api/admin/products?${params}`);
            const prodData = await prodRes.json();
            setProducts(prodData.products || []);

            // Fetch Categories
            const catRes = await fetch("/api/categories");
            const catData = await catRes.json();
            setCategories(Array.isArray(catData) ? catData : []);
        } catch (err) {
            console.error("Failed to fetch data", err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [search, categoryFilter]);

    const handleSave = async (formData: any) => {
        const url = editingProduct
            ? `/api/admin/products/${editingProduct.id}`
            : "/api/admin/products";
        const method = editingProduct ? "PUT" : "POST";

        // Ensure categoryId is a number
        const data = {
            ...formData,
            categoryId: parseInt(formData.categoryId.toString())
        };

        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (!res.ok) throw new Error("Failed to save");
        setEditingProduct(null);
        await fetchData();
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this product?")) return;
        try {
            await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
            await fetchData();
        } catch (err) {
            console.error("Failed to delete product", err);
        }
    };

    if (loading) return <FruitLoading />;

    return (
        <div className="space-y-6">
            {/* Actions Bar */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full sm:w-auto">
                    <div className="relative flex-1 max-w-sm">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search products..."
                            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                        />
                    </div>
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    >
                        <option value="">All Categories</option>
                        {categories.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </div>

                <button
                    onClick={() => { setEditingProduct(null); setModalOpen(true); }}
                    className="flex items-center gap-2 bg-emerald-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-600 transition-colors shadow-sm shadow-emerald-200"
                >
                    <Plus size={18} /> Add Product
                </button>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                {products.length === 0 ? (
                    <div className="text-center py-16">
                        <Package size={48} className="mx-auto text-gray-200 mb-4" />
                        <p className="text-gray-400 font-medium">No products found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-xs text-gray-400 uppercase tracking-wider border-b border-gray-100 bg-gray-50/50">
                                    <th className="px-6 py-3 font-semibold">Product</th>
                                    <th className="px-4 py-3 font-semibold">Category</th>
                                    <th className="px-4 py-3 font-semibold">Base Price</th>
                                    <th className="px-4 py-3 font-semibold">Variants</th>
                                    <th className="px-4 py-3 font-semibold">Status</th>
                                    <th className="px-6 py-3 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="w-12 h-12 rounded-xl object-cover border border-gray-100"
                                                />
                                                <div>
                                                    <p className="font-bold text-gray-900 line-clamp-1">{product.name}</p>
                                                    <p className="text-xs text-gray-400 line-clamp-1 max-w-[200px]">{product.description}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                                                {product.categoryRef?.name || "Uncategorized"}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 font-bold text-gray-900">৳{product.basePrice}</td>
                                        <td className="px-4 py-4 text-gray-500">{product.variants?.length || 0} variants</td>
                                        <td className="px-4 py-4">
                                            {product.isNew && (
                                                <span className="text-xs font-bold bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full border border-emerald-100">
                                                    NEW
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    onClick={() => { setEditingProduct(product); setModalOpen(true); }}
                                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit3 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Product Form Modal */}
            <ProductFormModal
                isOpen={modalOpen}
                onClose={() => { setModalOpen(false); setEditingProduct(null); }}
                onSave={handleSave}
                product={editingProduct}
                categories={categories}
            />
        </div>
    );
}
