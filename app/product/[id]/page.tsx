"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { ShoppingCart, Heart, Share2, CheckCircle2, ShieldCheck, Truck, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";

import { products } from "@/data/products";

const ProductDetail = () => {
    const params = useParams();
    const product = products.find(p => p.id === Number(params.id)) || products[0];
    const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();

    const handleAddToCart = () => {
        addToCart({
            id: product.id,
            name: product.name,
            price: selectedVariant.price,
            image: product.image,
            quantity: quantity,
            variant: selectedVariant.label
        });
    };

    return (
        <div className="container mx-auto px-4 md:px-6 py-12">
            <Link href="/shop" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary mb-8 transition-colors">
                <ArrowLeft size={20} /> Back to Shop
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Gallery */}
                <div className="space-y-4">
                    <div className="relative aspect-square rounded-[3rem] overflow-hidden bg-surface border border-gray-100 shadow-lg">
                        <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="relative aspect-square rounded-2xl overflow-hidden border-2 border-transparent hover:border-primary cursor-pointer transition-all">
                                <Image src={product.image} alt="Gallery" fill className="object-cover opacity-50 hover:opacity-100" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Info */}
                <div className="flex flex-col">
                    <span className="text-primary font-bold uppercase tracking-widest text-sm mb-2">{product.category}</span>
                    <h1 className="text-3xl md:text-5xl font-bold text-organic-green mb-4 leading-tight">{product.name}</h1>

                    <div className="flex items-center gap-4 mb-6">
                        <span className="text-3xl font-black text-organic-green">৳{selectedVariant.price}</span>
                        <span className="bg-emerald-50 text-emerald-600 text-xs font-bold px-3 py-1 rounded-full border border-emerald-100">
                            In Stock
                        </span>
                    </div>

                    <p className="text-gray-600 leading-relaxed mb-8">
                        {product.description}
                    </p>

                    <div className="space-y-6 mb-10">
                        {/* Variants */}
                        <div>
                            <h4 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">Select Weight / Pack</h4>
                            <div className="flex flex-wrap gap-3">
                                {product.variants.map((v) => (
                                    <button
                                        key={v.label}
                                        onClick={() => setSelectedVariant(v)}
                                        className={cn(
                                            "px-6 py-3 rounded-2xl border-2 transition-all font-bold text-sm",
                                            selectedVariant.label === v.label
                                                ? "border-primary bg-primary/5 text-primary"
                                                : "border-gray-100 text-gray-400 hover:border-gray-200"
                                        )}
                                    >
                                        {v.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Quantity */}
                        <div>
                            <h4 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">Quantity</h4>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center bg-surface rounded-2xl p-1 border border-gray-100">
                                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-xl transition-all font-bold text-xl">-</button>
                                    <span className="w-12 text-center font-black">{quantity}</span>
                                    <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-xl transition-all font-bold text-xl">+</button>
                                </div>
                                <span className="text-sm text-gray-400">Total: ৳{selectedVariant.price * quantity}</span>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-10">
                        <button
                            onClick={handleAddToCart}
                            className="flex-1 bg-white text-organic-green border-2 border-organic-green py-5 rounded-full font-bold text-lg hover:bg-organic-green hover:text-white transition-all flex items-center justify-center gap-3 shadow-xl shadow-organic-green/5"
                        >
                            <ShoppingCart size={22} /> Add to Cart
                        </button>
                        <button
                            onClick={handleAddToCart}
                            className="flex-1 bg-primary text-white py-5 rounded-full font-bold text-lg hover:bg-primary-dark transition-all flex items-center justify-center gap-3 shadow-xl shadow-primary/20"
                        >
                            Buy it Now
                        </button>
                        <button className="w-16 h-16 rounded-full border-2 border-gray-100 flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-100 transition-all">
                            <Heart size={24} />
                        </button>
                    </div>

                    {/* Trust Points */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                                <ShieldCheck size={20} />
                            </div>
                            <span className="text-xs font-bold text-gray-600">Pure & Safe</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
                                <Truck size={20} />
                            </div>
                            <span className="text-xs font-bold text-gray-600">Fast Delivery</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-lime-50 rounded-xl flex items-center justify-center text-lime-600">
                                <CheckCircle2 size={20} />
                            </div>
                            <span className="text-xs font-bold text-gray-600">Quality Verified</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Product Details Section */}
            <section className="py-20 mt-12 bg-surface -mx-4 md:-mx-6 px-4 md:px-6 rounded-[3rem]">
                <div className="max-w-4xl mx-auto">
                    <div className="flex gap-12 border-b border-gray-200 mb-12">
                        <button className="pb-4 border-b-2 border-primary font-bold text-organic-green">Product Wisdom</button>
                        <button className="pb-4 text-gray-400 hover:text-gray-900 transition-colors">Specifications</button>
                        <button className="pb-4 text-gray-400 hover:text-gray-900 transition-colors">Reviews (12)</button>
                    </div>

                    <div className="prose prose-emerald max-w-none">
                        <h3 className="text-2xl font-bold text-organic-green mb-6">Why Choose Our {product.name}?</h3>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none p-0">
                            {product.details.map((detail, idx) => (
                                <li key={idx} className="flex items-center gap-3 bg-white p-4 rounded-2xl shadow-sm border border-gray-50">
                                    <CheckCircle2 className="text-primary" size={20} />
                                    <span className="font-medium text-gray-700">{detail}</span>
                                </li>
                            ))}
                        </ul>
                        <p className="mt-8 text-gray-600 leading-relaxed">
                            We ensure that every single fruit is hand-picked at its peak ripeness. Our logistic network is optimized to maintain the cold chain and natural freshness. No chemicals, No formalin, just pure nature.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ProductDetail;
