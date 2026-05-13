import React, { Suspense } from "react";
import ShopClient from "./ShopClient";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Shop Organic Fruits",
    description: "Browse our wide selection of fresh, seasonal, and organic fruits. Delivered straight from the garden to your doorstep.",
};
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
