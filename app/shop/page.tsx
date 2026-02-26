import React, { Suspense } from "react";
import ShopClient from "./ShopClient";

const ShopPage = async ({ searchParams }: { searchParams: Promise<{ q?: string }> }) => {
    const { q: query } = await searchParams;
    return (
        <Suspense fallback={<div className="container mx-auto px-4 py-20 text-center text-gray-500">শপ লোড হচ্ছে...</div>}>
            <ShopClient query={query} />
        </Suspense>
    );
};

export default ShopPage;
