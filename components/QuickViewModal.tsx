"use client";

import React from "react";
import Image from "next/image";
import { X, ShoppingCart, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ProductWithVariants } from "./ProductGrid";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { cn } from "@/lib/utils";

interface QuickViewModalProps {
    product: ProductWithVariants | null;
    onClose: () => void;
}

const QuickViewModal = ({ product, onClose }: QuickViewModalProps) => {
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();

    if (!product) return null;

    const handleAddToCart = () => {
        addToCart({
            id: product.id,
            name: product.name,
            price: product.basePrice,
            image: product.image,
            quantity: 1,
            variant: product.variants[0]?.label
        });
        onClose();
    };

    return (
        <AnimatePresence>
            {product && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="bg-white rounded-[2.5rem] overflow-hidden max-w-4xl w-full shadow-2xl relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 z-10 p-2 bg-white/80 backdrop-blur-md rounded-full text-gray-500 hover:text-red-500 transition-colors shadow-lg"
                        >
                            <X size={24} />
                        </button>

                        <div className="flex flex-col md:flex-row">
                            {/* Product Image */}
                            <div className="md:w-1/2 relative aspect-square">
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                />
                                {product.isNew && (
                                    <div className="absolute top-6 left-6 bg-accent text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                                        New Arrival
                                    </div>
                                )}
                            </div>

                            {/* Product Info */}
                            <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                                <span className="text-primary font-bold uppercase tracking-widest text-xs mb-2">
                                    {product.category}
                                </span>
                                <h2 className="text-3xl md:text-4xl font-black text-organic-green mb-4">
                                    {product.name}
                                </h2>

                                <div className="flex items-baseline gap-2 mb-6">
                                    <span className="text-2xl font-black text-primary font-inter">৳{product.priceRange}</span>
                                    <span className="text-gray-400 text-sm font-medium">Starting from</span>
                                </div>

                                <p className="text-gray-600 mb-8 leading-relaxed">
                                    {product.description}
                                </p>

                                <div className="flex flex-col gap-4">
                                    <button
                                        onClick={handleAddToCart}
                                        className="w-full bg-organic-green text-white font-bold py-4 rounded-2xl shadow-xl hover:bg-primary transition-colors flex items-center justify-center gap-3 active:scale-[0.98]"
                                    >
                                        <ShoppingCart size={20} /> Add to Cart
                                    </button>

                                    <button
                                        onClick={() => toggleWishlist(product.id)}
                                        className={cn(
                                            "w-full py-4 rounded-2xl border-2 font-bold transition-all flex items-center justify-center gap-3",
                                            isInWishlist(product.id)
                                                ? "bg-red-50 border-red-100 text-red-500"
                                                : "bg-white border-gray-100 text-gray-500 hover:border-primary hover:text-primary"
                                        )}
                                    >
                                        <Heart
                                            size={20}
                                            className={isInWishlist(product.id) ? "fill-red-500" : ""}
                                        />
                                        {isInWishlist(product.id) ? "In Wishlist" : "Add to Favorites"}
                                    </button>
                                </div>

                                <div className="mt-8 pt-8 border-t border-gray-50 grid grid-cols-2 gap-4">
                                    {product.details.slice(0, 2).map((detail, idx) => (
                                        <div key={idx} className="flex flex-col gap-1">
                                            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-tighter">Feature</span>
                                            <span className="text-sm font-bold text-organic-green">{detail}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default QuickViewModal;
