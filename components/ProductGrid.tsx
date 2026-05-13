"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ShoppingCart, Heart, Eye, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import QuickViewModal from "./QuickViewModal";

export interface ProductWithVariants {
    id: number;
    name: string;
    category: string | null;
    categoryId: number | null;
    categoryRef?: any;
    basePrice: number;
    priceRange: string;
    description: string;
    image: string;
    images: string[];
    details: string[];
    isNew: boolean;
    variants: { label: string; price: number; id: number; productId: number }[];
}

const ProductGrid = ({ products }: { products: ProductWithVariants[] }) => {
    const [activeCategory, setActiveCategory] = useState("all");
    const [selectedProduct, setSelectedProduct] = useState<ProductWithVariants | null>(null);
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const router = useRouter();

    // Derive dynamic categories from products
    const uniqueCategories = [
        { name: "All", slug: "all" },
        ...Array.from(new Set(products.map(p => p.categoryRef?.slug).filter(Boolean))).map(slug => {
            const cat = products.find(p => p.categoryRef?.slug === slug)?.categoryRef;
            return { name: cat?.name || slug, slug: slug || "" };
        })
    ];

    const filteredProducts = activeCategory === "all"
        ? products
        : products.filter(p => p.categoryRef?.slug === activeCategory);

    const handleAddToCart = (product: ProductWithVariants) => {
        addToCart({
            id: product.id,
            name: product.name,
            price: product.basePrice,
            image: product.image,
            quantity: 1,
            variant: product.variants[0]?.label
        });
    };

    const handleBuyNow = (product: ProductWithVariants) => {
        addToCart({
            id: product.id,
            name: product.name,
            price: product.basePrice,
            image: product.image,
            quantity: 1,
            variant: product.variants[0]?.label
        });
        router.push("/checkout");
    };

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                    <h2 className="text-3xl font-bold text-primary uppercase tracking-tight">Our Fresh Harvest</h2>

                    <div className="flex flex-wrap gap-2 justify-center">
                        {uniqueCategories.map((cat) => (
                            <button
                                key={cat.slug}
                                onClick={() => setActiveCategory(cat.slug)}
                                className={cn(
                                    "px-6 py-2 rounded-full text-sm font-bold transition-all border",
                                    activeCategory === cat.slug
                                        ? "bg-primary text-white border-primary shadow-lg"
                                        : "bg-white text-gray-500 border-gray-100 hover:border-primary hover:text-primary"
                                )}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                    {filteredProducts.map((product, index) => (
                        <div key={product.id} className="group flex flex-col bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden p-3">
                            <div className="relative aspect-square rounded-2xl overflow-hidden bg-surface mb-4">
                                <Link href={`/product/${product.id}`}>
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        fill
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        priority={index < 4}
                                    />
                                </Link>

                                {product.isNew && (
                                    <div className="absolute top-4 left-4 bg-accent text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
                                        New
                                    </div>
                                )}

                                <div className="absolute inset-0 bg-black/5 sm:opacity-0 opacity-100 group-hover:opacity-100 transition-opacity" />

                                <div className="absolute top-3 right-3 flex flex-col gap-2">
                                    <button
                                        onClick={() => setSelectedProduct(product)}
                                        className="w-9 h-9 rounded-full bg-white text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-md sm:opacity-0 sm:scale-75 sm:translate-x-2 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0 duration-200"
                                        aria-label="Quick view"
                                    >
                                        <Eye size={18} />
                                    </button>
                                    <button
                                        onClick={() => toggleWishlist(product.id)}
                                        className={cn(
                                            "w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-md duration-200 sm:opacity-0 sm:scale-75 sm:translate-x-2 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0 delay-75",
                                            isInWishlist(product.id)
                                                ? "bg-red-500 text-white"
                                                : "bg-white text-primary hover:bg-primary hover:text-white"
                                        )}
                                        aria-label={isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}
                                    >
                                        <Heart size={18} className={cn(isInWishlist(product.id) && "fill-current")} />
                                    </button>
                                </div>

                                <div className="hidden sm:block absolute bottom-4 left-4 right-4 translate-y-14 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                    <button
                                        onClick={() => handleAddToCart(product)}
                                        className="w-full bg-white text-primary font-bold py-3 rounded-2xl shadow-xl hover:bg-primary hover:text-white transition-colors flex items-center justify-center gap-2"
                                    >
                                        <ShoppingCart size={18} /> Add to Cart
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-col gap-1.5 px-3 pb-3 pt-1">
                                <span className="text-primary text-[10px] font-bold uppercase tracking-widest">{product.categoryRef?.name || product.category}</span>
                                <h3 className="font-bold text-base sm:text-lg text-gray-900 group-hover:text-primary transition-colors line-clamp-1 leading-snug">
                                    <Link href={`/product/${product.id}`}>{product.name}</Link>
                                </h3>
                                <div className="flex items-center justify-between mt-2 gap-2">
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-gray-400 text-[10px] uppercase font-bold tracking-tighter truncate">Starting from</span>
                                        <span className="text-sm sm:text-xl font-black text-primary font-inter truncate">৳{product.priceRange}</span>
                                    </div>
                                    <button
                                        onClick={() => handleBuyNow(product)}
                                        className="shrink-0 bg-primary text-white text-[10px] sm:text-xs font-bold px-4 sm:px-5 py-2.5 rounded-xl hover:bg-primary-dark transition-all flex items-center gap-1.5 shadow-md"
                                    >
                                        <Zap size={14} className="fill-current" />
                                        Buy Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <QuickViewModal
                product={selectedProduct}
                onClose={() => setSelectedProduct(null)}
            />
        </section>
    );
};

export default ProductGrid;
