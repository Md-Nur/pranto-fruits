"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ShoppingCart, Heart, Share2, CheckCircle2, ShieldCheck, Truck, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";
import { ProductWithVariants } from "@/components/ProductGrid";

const ProductDetailClient = ({ product }: { product: ProductWithVariants }) => {
    const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
    const [quantity, setQuantity] = useState(1);
    const productImages = (product as any).images?.length > 0 ? (product as any).images : [product.image];
    const [activeImage, setActiveImage] = useState(productImages[0]);
    const [activeTab, setActiveTab] = useState("wisdom");
    const { addToCart } = useCart();
    const router = useRouter();

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

    const handleBuyNow = () => {
        addToCart({
            id: product.id,
            name: product.name,
            price: selectedVariant.price,
            image: product.image,
            quantity: quantity,
            variant: selectedVariant.label
        });
        router.push("/checkout");
    };

    return (
        <div className="container mx-auto px-4 md:px-6 py-12">
            <Link href="/shop" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary mb-8 transition-colors">
                <ArrowLeft size={20} /> Back to Shop
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Gallery */}
                <div className="space-y-4">
                    <div className="relative aspect-square rounded-[3rem] overflow-hidden bg-surface border border-gray-100 shadow-lg group">
                        <Image
                            src={activeImage}
                            alt={product.name}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            priority
                        />
                    </div>
                    {productImages.length > 1 && (
                        <div className="grid grid-cols-4 gap-4">
                            {productImages.map((img: string, i: number) => (
                                <div 
                                    key={i} 
                                    onClick={() => setActiveImage(img)}
                                    className={cn(
                                        "relative aspect-square rounded-2xl overflow-hidden border-2 cursor-pointer transition-all",
                                        activeImage === img ? "border-primary shadow-md" : "border-transparent hover:border-primary/50"
                                    )}
                                >
                                    <Image 
                                        src={img} 
                                        alt={`Gallery ${i}`} 
                                        fill 
                                        sizes="(max-width: 768px) 25vw, 15vw"
                                        className={cn("object-cover transition-opacity", activeImage === img ? "opacity-100" : "opacity-50 hover:opacity-100")} 
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="flex flex-col">
                    <span className="text-primary font-bold uppercase tracking-widest text-sm mb-2">{product.categoryRef?.name || product.category}</span>
                    <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">{product.name}</h1>

                    <div className="flex items-center gap-4 mb-6">
                        <span className="text-3xl font-black text-gray-900">৳{selectedVariant.price}</span>
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
                            onClick={handleBuyNow}
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
                    <div className="flex gap-12 border-b border-gray-200 mb-12 overflow-x-auto whitespace-nowrap hide-scrollbar">
                        <button 
                            onClick={() => setActiveTab("wisdom")}
                            className={cn("pb-4 transition-colors", activeTab === "wisdom" ? "border-b-2 border-primary font-bold text-gray-900" : "text-gray-400 hover:text-gray-900")}
                        >
                            Product Wisdom
                        </button>
                        <button 
                            onClick={() => setActiveTab("specifications")}
                            className={cn("pb-4 transition-colors", activeTab === "specifications" ? "border-b-2 border-primary font-bold text-gray-900" : "text-gray-400 hover:text-gray-900")}
                        >
                            Specifications
                        </button>
                        <button 
                            onClick={() => setActiveTab("reviews")}
                            className={cn("pb-4 transition-colors", activeTab === "reviews" ? "border-b-2 border-primary font-bold text-gray-900" : "text-gray-400 hover:text-gray-900")}
                        >
                            Reviews (12)
                        </button>
                    </div>

                    {activeTab === "wisdom" && (
                        <div className="prose prose-emerald max-w-none">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">Why Choose Our {product.name}?</h3>
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
                    )}

                    {activeTab === "specifications" && (
                        <div className="prose prose-emerald max-w-none">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">Product Specifications</h3>
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-50 overflow-hidden">
                                <table className="w-full text-left border-collapse m-0">
                                    <tbody>
                                        <tr className="border-b border-gray-50">
                                            <th className="py-4 px-6 font-semibold text-gray-900 bg-gray-50/50 w-1/3 m-0">Category</th>
                                            <td className="py-4 px-6 text-gray-600 m-0">{product.categoryRef?.name || product.category || "Fresh Produce"}</td>
                                        </tr>
                                        <tr className="border-b border-gray-50">
                                            <th className="py-4 px-6 font-semibold text-gray-900 bg-gray-50/50 w-1/3 m-0">Weight/Pack Options</th>
                                            <td className="py-4 px-6 text-gray-600 m-0">{product.variants.map(v => v.label).join(", ")}</td>
                                        </tr>
                                        <tr className="border-b border-gray-50">
                                            <th className="py-4 px-6 font-semibold text-gray-900 bg-gray-50/50 w-1/3 m-0">Origin</th>
                                            <td className="py-4 px-6 text-gray-600 m-0">Local Farms, Bangladesh</td>
                                        </tr>
                                        <tr>
                                            <th className="py-4 px-6 font-semibold text-gray-900 bg-gray-50/50 w-1/3 m-0">Storage Info</th>
                                            <td className="py-4 px-6 text-gray-600 m-0">Keep in a cool, dry place. Refrigerate after opening.</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === "reviews" && (
                        <div className="prose prose-emerald max-w-none">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                                <h3 className="text-2xl font-bold text-gray-900 m-0">Customer Reviews</h3>
                                <div className="flex items-center gap-2">
                                    <span className="text-xl font-bold text-gray-900">4.8</span>
                                    <div className="flex text-amber-400">
                                        {"★★★★★".split("").map((star, i) => (
                                            <span key={i} className={i === 4 ? "text-gray-300" : ""}>{star}</span>
                                        ))}
                                    </div>
                                    <span className="text-sm text-gray-500">(12 reviews)</span>
                                </div>
                            </div>
                            
                            <div className="space-y-6">
                                {[
                                    { name: "Rahim U.", date: "Oct 12, 2023", text: "Absolutely fresh and delicious! Delivery was very fast and the packaging was excellent. Will definitely order again.", rating: 5 },
                                    { name: "Salma K.", date: "Sep 28, 2023", text: "Great quality fruits. The size was a bit smaller than expected but the taste made up for it. Highly recommended.", rating: 4 },
                                    { name: "Anisur R.", date: "Sep 15, 2023", text: "Best online grocery experience. The produce is top-notch and completely chemical-free as promised.", rating: 5 },
                                ].map((review, i) => (
                                    <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h4 className="font-bold text-gray-900 m-0">{review.name}</h4>
                                                <span className="text-xs text-gray-500">{review.date}</span>
                                            </div>
                                            <div className="flex text-amber-400 text-sm">
                                                {"★★★★★".split("").map((star, j) => (
                                                    <span key={j} className={j >= review.rating ? "text-gray-300" : ""}>{star}</span>
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-gray-600 m-0 text-sm leading-relaxed">{review.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default ProductDetailClient;
