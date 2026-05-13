"use client";

import React, { useEffect, useState } from "react";
import ProductGrid, { ProductWithVariants } from "@/components/ProductGrid";
import FruitLoading from "@/components/FruitLoading";

export default function ShopClient({ query, category }: { query?: string; category?: string }) {
    const [products, setProducts] = useState<ProductWithVariants[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                if (query) params.set("q", query);
                if (category) params.set("category", category);
                
                const res = await fetch(`/api/search?${params.toString()}`);
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
    }, [query, category]);

    return (
        <div className="container mx-auto px-4 md:px-6 pt-28 pb-12">
            <div className="mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4 capitalize">
                    {query 
                        ? `Search: "${query}"` 
                        : category && category !== "all" 
                            ? `${category} Collection` 
                            : "Our Fruit Shop"}
                </h1>
                <p className="text-gray-500">
                    Explore our collection of fresh, chemical-free fruits delivered from garden to doorstep.
                </p>
            </div>
            {loading ? (
                <FruitLoading />
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
