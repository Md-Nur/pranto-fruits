"use client";

import React, { useEffect, useState } from "react";
import ProductGrid, { ProductWithVariants } from "@/components/ProductGrid";

export default function ShopClient({ query }: { query?: string }) {
    const [products, setProducts] = useState<ProductWithVariants[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/search?q=${encodeURIComponent(query || "")}`);
                if (!res.ok) throw new Error("Failed to fetch products");
                const data = await res.json();
                setProducts(data);
            } catch (error) {
                console.error("Search error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [query]);

    return (
        <div className="container mx-auto px-4 md:px-6 py-12">
            <div className="mb-12">
                <h1 className="text-4xl font-bold text-organic-green mb-4">
                    {query ? `"${query}" এর জন্য সার্চ ফলাফল` : "প্রান্তের ফ্রুট শপ"}
                </h1>
                <p className="text-gray-500">
                    আমাদের তাজা, ক্ষতিকারক রাসায়নিক মুক্ত ফলের সংগ্রহ দেখুন।
                </p>
            </div>
            {loading ? (
                <div className="text-center py-20 text-gray-500">শপ লোড হচ্ছে...</div>
            ) : products.length > 0 ? (
                <ProductGrid products={products} />
            ) : (
                <div className="text-center py-20 text-gray-500">
                    কোনো প্রোডাক্ট পাওয়া যায়নি।
                </div>
            )}
        </div>
    );
}
