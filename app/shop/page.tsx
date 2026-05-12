import React, { Suspense } from "react";
import ShopClient from "./ShopClient";
import FruitLoading from "@/components/FruitLoading";

const ShopPage = async ({ searchParams }: { searchParams: Promise<{ q?: string; category?: string }> }) => {
    const { q: query, category } = await searchParams;
    return (
        <Suspense fallback={<FruitLoading />}>
            <ShopClient query={query} category={category} />
        </Suspense>
    );
};

export default ShopPage;
