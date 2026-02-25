import React, { Suspense } from "react";
import ProductGrid from "@/components/ProductGrid";
import prisma from "@/lib/prisma";

const ShopContent = async ({ searchParams }: { searchParams: Promise<{ q?: string }> }) => {
    const { q: query } = await searchParams;
    const products = await prisma.product.findMany({ include: { variants: true } });

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
            <ProductGrid products={products} />
        </div>
    );
};

const ShopPage = ({ searchParams }: { searchParams: Promise<{ q?: string }> }) => {
    return (
        <Suspense fallback={<div className="container mx-auto px-4 py-20 text-center">Loading Shop...</div>}>
            <ShopContent searchParams={searchParams} />
        </Suspense>
    );
};

export default ShopPage;
