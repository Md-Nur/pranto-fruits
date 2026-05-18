"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

const CategoryBar = () => {
    const [categories, setCategories] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const searchParams = useSearchParams();
    const selectedCategory = searchParams?.get("category") ?? "all";
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch("/api/categories");
                if (!res.ok) {
                    console.warn(`Categories API returned status: ${res.status}`);
                    setCategories([]);
                    return;
                }
                
                const contentType = res.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    const data = await res.json();
                    setCategories(Array.isArray(data) ? data : []);
                } else {
                    console.warn("Categories API did not return JSON");
                    setCategories([]);
                }
            } catch (err) {
                console.error("Failed to fetch categories:", err);
                setCategories([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCategories();
    }, []);

    if (isLoading) return null;

    const categoryList = [
        { 
            id: "all", 
            slug: "all",
            name: "All Products", 
            image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=200&auto=format&fit=crop" 
        },
        ...categories.map(cat => ({
            id: cat.id,
            slug: cat.slug,
            name: cat.name,
            image: cat.image || "https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=300&auto=format&fit=crop"
        }))
    ];

    return (
        <div className="sticky top-[72px] md:top-[80px] z-30 -mt-16 md:-mt-20 px-4 transition-all duration-300">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4 md:p-6">
                    <div className="flex items-center justify-between overflow-x-auto no-scrollbar gap-4 md:gap-8">
                        {categoryList.map((category) => (
                            <Link
                                key={category.id}
                                href={category.slug === "all" ? "/shop" : `/shop?category=${category.slug}`}
                                className="flex flex-col items-center gap-3 min-w-[100px] group"
                            >
                                <div className={cn(
                            "relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2",
                            selectedCategory === category.slug ? "border-primary" : "border-gray-100"
                        )}>
                                    <Image
                                        src={category.image}
                                        alt={category.name}
                                        fill
                                        sizes="(max-width: 768px) 64px, 80px"
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                </div>
                                <span className={cn(
                            "text-xs md:text-sm font-bold group-hover:text-primary transition-colors text-center whitespace-nowrap",
                            selectedCategory === category.slug && "text-primary"
                        )}>
                                    {category.name}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryBar;
