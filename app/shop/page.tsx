import React, { Suspense } from "react";
import ProductGrid from "@/components/ProductGrid";
import prisma from "@/lib/prisma";

const ShopContent = async ({ query }: { query?: string }) => {
    const products = await prisma.product.findMany({ include: { variants: true } });

    return (
        <div className="container mx-auto px-4 md:px-6 py-12">
            <div className="mb-12">
                <h1 className="text-4xl font-bold text-organic-green mb-4">
                    {query ? `"${query}" এর জন্য সার্চ ফলাফল` : "প্রিমিয়াম ফ্রুট শপ"}
                </h1>
                <p className="text-gray-500">
                    আমাদের তাজা, ক্ষতিকারক রাসায়নিক মুক্ত ফলের সংগ্রহ দেখুন।
                </p>
            </div>
            <ProductGrid products={products} />
        </div>
    );
};

const ShopPage = async ({ searchParams }: { searchParams: Promise<{ q?: string }> }) => {
    const { q: query } = await searchParams;
    return (
        <Suspense fallback={<div className="container mx-auto px-4 py-20 text-center text-gray-500">শপ লোড হচ্ছে...</div>}>
            <ShopContent query={query} />
        </Suspense>
    );
};

export default ShopPage;
