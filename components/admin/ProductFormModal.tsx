"use client";

import React, { useState, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Variant {
    label: string;
    price: number | string;
}

interface ProductFormData {
    name: string;
    categoryId: number | string;
    basePrice: number | string;
    priceRange: string;
    description: string;
    image: string;
    images: string[];
    details: string[];
    isNew: boolean;
    variants: Variant[];
}

interface ProductFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: ProductFormData) => Promise<void>;
    product?: any;
    categories: any[];
}

const emptyForm: ProductFormData = {
    name: "",
    categoryId: "",
    basePrice: "",
    priceRange: "",
    description: "",
    image: "",
    images: [],
    details: [],
    isNew: false,
    variants: [{ label: "", price: "" }],
};

const ProductFormModal = ({ isOpen, onClose, onSave, product, categories }: ProductFormModalProps) => {
    const [form, setForm] = useState<ProductFormData>(emptyForm);
    const [detailInput, setDetailInput] = useState("");
    const [saving, setSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        if (product) {
            setForm({
                name: product.name || "",
                categoryId: product.categoryId || "",
                basePrice: product.basePrice || "",
                priceRange: product.priceRange || "",
                description: product.description || "",
                image: product.image || "",
                images: product.images?.length > 0 ? product.images : (product.image ? [product.image] : []),
                details: product.details || [],
                isNew: product.isNew || false,
                variants: product.variants?.length > 0
                    ? product.variants.map((v: any) => ({ label: v.label, price: v.price }))
                    : [{ label: "", price: "" }],
            });
        } else {
            setForm(emptyForm);
        }
    }, [product, isOpen]);

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

    const addVariant = () => {
        setForm((prev) => ({ ...prev, variants: [...prev.variants, { label: "", price: "" }] }));
    };

    const removeVariant = (idx: number) => {
        setForm((prev) => ({ ...prev, variants: prev.variants.filter((_, i) => i !== idx) }));
    };

    const updateVariant = (idx: number, field: keyof Variant, value: string) => {
        setForm((prev) => ({
            ...prev,
            variants: prev.variants.map((v, i) => (i === idx ? { ...v, [field]: value } : v)),
        }));
    };

    const addDetail = () => {
        if (detailInput.trim()) {
            setForm((prev) => ({ ...prev, details: [...prev.details, detailInput.trim()] }));
            setDetailInput("");
        }
    };

    const removeDetail = (idx: number) => {
        setForm((prev) => ({ ...prev, details: prev.details.filter((_, i) => i !== idx) }));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 rounded-t-2xl flex items-center justify-between z-10">
                    <h2 className="text-lg font-bold text-gray-900">{product ? "Edit Product" : "Add Product"}</h2>
                    <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                        <X size={20} className="text-gray-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Name + Category */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Name *</label>
                            <input
                                type="text"
                                required
                                value={form.name}
                                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                placeholder="Rajshahi Himsagar Mango"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Category *</label>
                            <select
                                required
                                value={form.categoryId}
                                onChange={(e) => setForm((p) => ({ ...p, categoryId: e.target.value }))}
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all bg-white"
                            >
                                <option value="">Select category</option>
                                {(Array.isArray(categories) ? categories : []).map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Price + Range */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Base Price (৳) *</label>
                            <input
                                type="number"
                                required
                                value={form.basePrice}
                                onChange={(e) => setForm((p) => ({ ...p, basePrice: e.target.value }))}
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                placeholder="180"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Price Range</label>
                            <input
                                type="text"
                                value={form.priceRange}
                                onChange={(e) => setForm((p) => ({ ...p, priceRange: e.target.value }))}
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                placeholder="180 - 850"
                            />
                        </div>
                    </div>

                    {/* Image Gallery Upload */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Product Images *</label>
                        <div className="flex flex-wrap gap-4 mb-2">
                            {form.images.map((imgUrl, idx) => (
                                <div key={idx} className="relative w-24 h-24 rounded-xl border border-gray-200 overflow-hidden group">
                                    <img src={imgUrl} alt={`Product ${idx}`} className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => setForm(p => ({ ...p, images: p.images.filter((_, i) => i !== idx) }))}
                                        className="absolute top-1 right-1 bg-white/80 hover:bg-red-50 hover:text-red-500 text-gray-500 p-1 rounded-md backdrop-blur-sm transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                            <label className="w-24 h-24 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl hover:bg-gray-100 cursor-pointer transition-colors flex flex-col items-center justify-center gap-1 group">
                                {isUploading ? (
                                    <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent animate-spin rounded-full" />
                                ) : (
                                    <>
                                        <Plus size={24} className="text-gray-400 group-hover:text-emerald-500 transition-colors" />
                                        <span className="text-[10px] font-medium text-gray-400 uppercase">Upload</span>
                                    </>
                                )}
                                <input 
                                    type="file" 
                                    className="hidden" 
                                    accept="image/*" 
                                    multiple
                                    onChange={async (e) => {
                                        const files = Array.from(e.target.files || []);
                                        if (files.length === 0) return;
                                        
                                        setIsUploading(true);
                                        const uploadedUrls: string[] = [];
                                        
                                        for (const file of files) {
                                            const formData = new FormData();
                                            formData.append("image", file);
                                            try {
                                                const configRes = await fetch("/api/config");
                                                const { imgbbKey } = await configRes.json();
                                                
                                                const res = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbKey}`, { method: "POST", body: formData });
                                                const data = await res.json();
                                                if (data.data?.url) uploadedUrls.push(data.data.url);
                                            } catch (err) {
                                                console.error("Direct upload failed", err);
                                            }
                                        }
                                        
                                        if (uploadedUrls.length > 0) {
                                            setForm(p => ({ 
                                                ...p, 
                                                images: [...p.images, ...uploadedUrls],
                                                image: p.image || uploadedUrls[0] // Fallback for the primary image
                                            }));
                                        }
                                        setIsUploading(false);
                                    }} 
                                    disabled={isUploading} 
                                />
                            </label>
                        </div>
                        <p className="text-xs text-gray-400">Upload one or more images. The first image will be used as the primary thumbnail.</p>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Description *</label>
                        <textarea
                            required
                            rows={3}
                            value={form.description}
                            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none"
                            placeholder="Product description..."
                        />
                    </div>

                    {/* Details Tags */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Details / Features</label>
                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={detailInput}
                                onChange={(e) => setDetailInput(e.target.value)}
                                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addDetail(); } }}
                                className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                placeholder="e.g. 100% Chemical Free"
                            />
                            <button type="button" onClick={addDetail} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium transition-colors">
                                Add
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {form.details.map((d, i) => (
                                <span key={i} className="flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs font-medium px-3 py-1.5 rounded-full border border-emerald-100">
                                    {d}
                                    <button type="button" onClick={() => removeDetail(i)} className="ml-1 text-emerald-400 hover:text-red-500">
                                        <X size={12} />
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Variants */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Variants</label>
                            <button type="button" onClick={addVariant} className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                                <Plus size={14} /> Add Variant
                            </button>
                        </div>
                        <div className="space-y-2">
                            {form.variants.map((v, i) => (
                                <div key={i} className="flex gap-2 items-center">
                                    <input
                                        type="text"
                                        value={v.label}
                                        onChange={(e) => updateVariant(i, "label", e.target.value)}
                                        className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                        placeholder="1kg"
                                    />
                                    <input
                                        type="number"
                                        value={v.price}
                                        onChange={(e) => updateVariant(i, "price", e.target.value)}
                                        className="w-28 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                        placeholder="৳ Price"
                                    />
                                    {form.variants.length > 1 && (
                                        <button type="button" onClick={() => removeVariant(i)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Is New Toggle */}
                    <label className="flex items-center gap-3 cursor-pointer">
                        <div className="relative">
                            <input
                                type="checkbox"
                                checked={form.isNew}
                                onChange={(e) => setForm((p) => ({ ...p, isNew: e.target.checked }))}
                                className="sr-only"
                            />
                            <div className={cn("w-10 h-5 rounded-full transition-colors", form.isNew ? "bg-emerald-500" : "bg-gray-200")} />
                            <div className={cn("absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform", form.isNew && "translate-x-5")} />
                        </div>
                        <span className="text-sm font-medium text-gray-700">Mark as New Product</span>
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
                            {saving ? "Saving..." : product ? "Update Product" : "Create Product"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductFormModal;
