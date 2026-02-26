"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Heart, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import QuickViewModal from "./QuickViewModal";

const categories = ["All", "Mango", "Dates", "Jaggery", "Baskets", "Honey"];

export interface ProductWithVariants {
    id: number;
    name: string;
    category: string;
    basePrice: number;
    priceRange: string;
    description: string;
    image: string;
    details: string[];
    isNew: boolean;
    variants: { label: string; price: number; id: number; productId: number }[];
}

const ProductGrid = ({ products }: { products: ProductWithVariants[] }) => {
    const [activeCategory, setActiveCategory] = useState("All");
    const [selectedProduct, setSelectedProduct] = useState<ProductWithVariants | null>(null);
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();

    const filteredProducts = activeCategory === "All"
        ? products
        : products.filter(p => p.category === activeCategory);

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

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                    <h2 className="text-3xl font-bold text-organic-green">Our Fresh Harvest</h2>

                    <div className="flex flex-wrap gap-2 justify-center">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={cn(
                                    "px-6 py-2 rounded-full text-sm font-semibold transition-all border",
                                    activeCategory === cat
                                        ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                                        : "bg-white text-gray-500 border-gray-100 hover:border-primary hover:text-primary"
                                )}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredProducts.map((product) => (
                        <div key={product.id} className="group flex flex-col">
                            <div className="relative aspect-square rounded-3xl overflow-hidden bg-surface mb-4">
                                <Link href={`/product/${product.id}`}>
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                </Link>

                                {product.isNew && (
                                    <div className="absolute top-4 left-4 bg-accent text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
                                        New
                                    </div>
                                )}

                                {/* Overlay with action icons – always visible on mobile, hover-only on sm+ */}
                                <div className="absolute inset-0 bg-black/5 sm:opacity-0 opacity-100 group-hover:opacity-100 transition-opacity" />

                                {/* Eye & Wishlist icons: top-right corner, always accessible on mobile */}
                                <div className="absolute top-3 right-3 flex flex-col gap-2">
                                    <button
                                        onClick={() => setSelectedProduct(product)}
                                        className="w-9 h-9 rounded-full bg-white text-organic-green flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-md sm:opacity-0 sm:scale-75 sm:translate-x-2 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0 duration-200"
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
                                                : "bg-white text-organic-green hover:bg-primary hover:text-white"
                                        )}
                                        aria-label={isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}
                                    >
                                        <Heart size={18} className={cn(isInWishlist(product.id) && "fill-current")} />
                                    </button>
                                </div>

                                {/* Add to Cart: always at bottom on mobile, slides up on desktop hover */}
                                <div className="absolute bottom-4 left-4 right-4 sm:translate-y-14 sm:opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                    <button
                                        onClick={() => handleAddToCart(product)}
                                        className="w-full bg-white text-organic-green font-bold py-3 rounded-2xl shadow-xl hover:bg-primary hover:text-white transition-colors flex items-center justify-center gap-2"
                                    >
                                        <ShoppingCart size={18} /> Add to Cart
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-col gap-1 px-2">
                                <span className="text-primary text-xs font-bold uppercase tracking-widest">{product.category}</span>
                                <h3 className="font-bold text-lg text-organic-green group-hover:text-primary transition-colors line-clamp-1">
                                    <Link href={`/product/${product.id}`}>{product.name}</Link>
                                </h3>
                                <div className="flex items-center justify-between mt-2">
                                    <div className="flex flex-col">
                                        <span className="text-gray-400 text-[10px] uppercase font-bold tracking-tighter">Starting from</span>
                                        <span className="text-lg font-black text-organic-green font-inter">৳{product.priceRange}</span>
                                    </div>
                                    <button
                                        onClick={() => handleAddToCart(product)}
                                        className="text-primary text-sm font-bold border-b-2 border-primary/20 hover:border-primary transition-all"
                                    >
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
