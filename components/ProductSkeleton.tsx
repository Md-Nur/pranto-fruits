"use client";

import React from "react";

export const ProductCardSkeleton = () => {
    return (
        <div className="flex flex-col bg-white rounded-3xl border border-gray-100 p-3 shadow-sm animate-pulse">
            {/* Image Skeleton */}
            <div className="relative aspect-square rounded-2xl bg-gray-100 overflow-hidden mb-4" />

            <div className="flex flex-col gap-1.5 px-3 pb-3 pt-1">
                {/* Category tag skeleton */}
                <div className="w-16 h-3 bg-gray-100 rounded-md mb-1" />
                {/* Title skeleton */}
                <div className="w-3/4 h-5 bg-gray-100 rounded-md mb-2" />
                
                {/* Price and Button skeleton */}
                <div className="flex items-center justify-between mt-2 gap-2">
                    <div className="flex flex-col gap-1">
                        <div className="w-12 h-2.5 bg-gray-100 rounded-md" />
                        <div className="w-16 h-5 bg-gray-100 rounded-md" />
                    </div>
                    <div className="w-20 h-9 bg-gray-100 rounded-xl" />
                </div>
            </div>
        </div>
    );
};

export const ProductGridSkeleton = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
            ))}
        </div>
    );
};
