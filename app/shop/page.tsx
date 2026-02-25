"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProductGrid from "@/components/ProductGrid";

const ShopContent = () => {
    const searchParams = useSearchParams();
    const query = searchParams.get("q");

    return (
        <div className="container mx-auto px-4 md:px-6 py-12">
            <div className="mb-12">
                <h1 className="text-4xl font-bold text-organic-green mb-4">
                    {query ? `Search results for "${query}"` : "Premium Harvest Shop"}
                </h1>
                <p className="text-gray-500">
                    Showing our freshest collection of organic and chemical-free fruits.
                </p>
            </div>
            <ProductGrid />
        </div>
    );
};

const ShopPage = () => {
    return (
        <Suspense fallback={<div className="container mx-auto px-4 py-20 text-center">Loading Shop...</div>}>
            <ShopContent />
        </Suspense>
    );
};

export default ShopPage;
