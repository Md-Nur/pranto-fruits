"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    ShoppingCart,
    Check,
    Minus,
    Plus,
    Banknote,
    Lock,
    Package,
    ArrowRight,
    X,
    CheckCircle,
    Loader2,
} from "lucide-react";
import { ProductWithVariants } from "@/components/ProductGrid";

const ProductDetailClient = ({ product }: { product: ProductWithVariants }) => {
    const variants = product.variants || [];
    const mainVariant = variants[0] || { label: "Standard", price: product.basePrice };

    // Primary product checkbox state & quantity
    const [mainIncluded, setMainIncluded] = useState(true);
    const [quantity, setQuantity] = useState(1);

    // Supporting items (secondary variants) checkboxes & quantities maps
    const [addonsChecked, setAddonsChecked] = useState<Record<string, boolean>>({});
    const [addonsQty, setAddonsQty] = useState<Record<string, number>>({});

    const [shippingType, setShippingType] = useState<"dhaka" | "urgent">("dhaka");

    // Form state
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");

    // UI state
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [orderId, setOrderId] = useState<number | null>(null);

    // Dynamic checkout item definitions
    const MAIN_PRODUCT = {
        id: `${product.id}-${mainVariant.label}`,
        name: `${product.name}-${mainVariant.label}`,
        weight: mainVariant.label,
        originalPrice: Math.round(mainVariant.price * 1.15),
        price: mainVariant.price,
        image: product.image,
    };

    // Cart Count auto-syncs to item quantities
    const activeAddonsCount = variants.slice(1).reduce((sum, v) => {
        if (addonsChecked[v.label]) {
            return sum + (addonsQty[v.label] || 1);
        }
        return sum;
    }, 0);
    const cartCount = (mainIncluded ? quantity : 0) + activeAddonsCount;

    const scrollToOrder = () => {
        document.getElementById("product-checkout")?.scrollIntoView({ behavior: "smooth" });
    };

    /* ─── Weight Parsing (same as main checkout page) ─── */
    const parseWeight = (label: string): number => {
        const match = label.toLowerCase().match(/(\d+(\.\d+)?)\s*(kg|g|gm)/);
        if (!match) return 0;
        let value = parseFloat(match[1]);
        const unit = match[3];
        if (unit === 'g' || unit === 'gm') value = value / 1000;
        return value;
    };

    /* ─── Totals ─── */
    const mainSubtotal = mainIncluded ? MAIN_PRODUCT.price * quantity : 0;
    const addonSubtotal = variants.slice(1).reduce((sum, v) => {
        if (addonsChecked[v.label]) {
            return sum + v.price * (addonsQty[v.label] || 1);
        }
        return sum;
    }, 0);
    const subtotal = mainSubtotal + addonSubtotal;

    /* ─── Shipping Cost (same rules as main checkout page) ─── */
    const totalWeight = (() => {
        let w = 0;
        if (mainIncluded) w += parseWeight(mainVariant.label) * quantity;
        variants.slice(1).forEach(v => {
            if (addonsChecked[v.label]) {
                w += parseWeight(v.label) * (addonsQty[v.label] || 1);
            }
        });
        return w;
    })();

    const calculateShipping = (type: "dhaka" | "urgent"): number => {
        const hasItems = mainIncluded || Object.values(addonsChecked).some(Boolean);
        if (!hasItems) return 0;
        // Home delivery base charges: Dhaka ৳170, Outside Dhaka ৳220
        const baseCharge = type === "dhaka" ? 170 : 220;
        const weightFactor = Math.max(1, Math.ceil(totalWeight / 10));
        return baseCharge * weightFactor;
    };

    const deliveryCharge = calculateShipping(shippingType);
    const total = subtotal + deliveryCharge;

    // Auto-redirect to home page on success
    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                window.location.href = "/";
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [success]);

    /* ─── Place Order ─── */
    const handlePlaceOrder = async () => {
        if (!name.trim()) { setError("নাম লিখুন"); return; }
        if (!phone.trim() || !/^(\+88)?01[3-9]\d{8}$/.test(phone)) { setError("সঠিক মোবাইল নম্বর দিন"); return; }
        if (!address.trim() || address.trim().length < 5) { setError("সঠিক ঠিকানা লিখুন"); return; }
        if (!mainIncluded && Object.values(addonsChecked).filter(Boolean).length === 0) {
            setError("কমপক্ষে একটি পণ্য নির্বাচন করুন");
            return;
        }

        setIsLoading(true);
        setError("");

        const orderItems = [
            ...(mainIncluded ? [{
                id: MAIN_PRODUCT.id,
                name: MAIN_PRODUCT.name,
                variant: MAIN_PRODUCT.weight,
                price: MAIN_PRODUCT.price,
                quantity,
                image: MAIN_PRODUCT.image
            }] : []),
            ...variants.slice(1).filter(v => addonsChecked[v.label]).map((v, index) => ({
                id: `${product.id}-${v.label}`,
                name: `${product.name} ${v.label}`,
                variant: v.label,
                price: v.price,
                quantity: addonsQty[v.label] || 1,
                image: product.images?.[index + 1] || product.image
            }))
        ];

        const nameParts = name.trim().split(" ");
        try {
            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    shippingInfo: {
                        firstName: nameParts[0] || name,
                        lastName: nameParts.slice(1).join(" ") || ".",
                        phone,
                        address,
                        city: shippingType === "dhaka" ? "dhaka" : "other",
                        zipCode: "",
                        deliveryType: "home",
                    },
                    paymentMethod: "cod",
                    paymentDetails: null,
                    totalAmount: total,
                    orderItems,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "অর্ডার ব্যর্থ হয়েছে");
            setOrderId(data.orderId);
            setSuccess(true);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Images from database with fallback values
    const hero1Image = product.images?.[0] || product.image || "/images/placeholder.jpg";
    const specialtiesImage = product.images?.[1] || product.image || "/images/placeholder.jpg";
    const hero2Image = product.images?.[2] || product.image || "/images/placeholder.jpg";

    return (
        <>
            <style>{`
                body { margin: 0; padding: 0; }
                .landing-page { min-height: 100vh; background: #f8fafc; }
                .landing-page-wrapper { max-width: 1280px; margin: 0 auto; background: white; box-shadow: 0 0 20px rgba(0,0,0,0.1); min-height: 100vh; position: relative; }
                @media (max-width: 1280px) { .landing-page-wrapper { margin: 0; box-shadow: none; } }
                
                .landing-section { padding: 4rem 0; }
                
                .hero-section { position: relative; display: flex; align-items: center; justify-content: center; }
                .hero-content { position: relative; z-index: 10; height: 100%; display: flex; align-items: center; justify-content: center; }
                
                .cta-button { display: inline-flex; align-items: center; padding: 0.75rem 2rem; border-radius: 0.5rem; font-weight: 600; text-decoration: none; transition: all 0.2s; border: none; cursor: pointer; font-size: 1rem; }
                .cta-button.primary { background: #10b981; color: white; }
                .cta-button.primary:hover { background: #059669; }
                
                .landing-nav { position: fixed; top: 20px; left: 20px; z-index: 1000; }
                .landing-nav-btn { background: rgba(255,255,255,0.95); backdrop-filter: blur(10px); border: 1px solid rgba(0,0,0,0.1); border-radius: 50px; padding: 12px 20px; display: flex; align-items: center; gap: 8px; text-decoration: none; color: #374151; font-weight: 600; font-size: 14px; transition: all 0.3s ease; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
                .landing-nav-btn:hover { background: white; transform: translateY(-2px); color: #10b981; box-shadow: 0 8px 25px rgba(0,0,0,0.15); }
                
                .landing-cart { position: fixed; top: 20px; right: 20px; z-index: 1000; }
                .landing-cart-btn { background: linear-gradient(135deg, #10b981, #059669); color: white; border: none; border-radius: 50px; padding: 12px 20px; display: flex; align-items: center; gap: 8px; font-weight: 600; font-size: 14px; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 20px rgba(16,185,129,0.3); }
                .landing-cart-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(16,185,129,0.4); }
                .landing-cart-badge { background: #ef4444; color: white; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; margin-left: 4px; }
                
                .landing-shipping-card { cursor: pointer; transition: all 0.2s; }
                .landing-shipping-card:hover { border-color: #9ca3af !important; background-color: #f9fafb !important; }
                .landing-shipping-card.selected { border-color: #16a34a !important; background-color: #dcfce7 !important; }
                
                .specialties-section { background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); position: relative; overflow: hidden; }
                .specialties-section::before { content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="%23059669" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="%23059669" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>') repeat; opacity: 0.3; z-index: 0; }
                .specialties-section > .container { position: relative; z-index: 1; }
                .specialties-section .container { max-width: 1100px; }
                .specialties-section h2 { line-height: 1.2; }
                .specialties-section .grid { align-items: center; }
                
                .product-checkout-section { background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%); padding: 4rem 0; }
                
                .hero-text-box { backdrop-filter: blur(10px); animation: fadeInUp 1s ease-out; }
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
                .hero-image-responsive { background-size: cover; background-position: center; background-repeat: no-repeat; }
                
                @media (max-width: 768px) {
                    .hero-section.hero-image-responsive::before { display: none; }
                    .hero-section.hero-image-responsive { min-height: min(72vw, 300px) !important; height: auto !important; padding-top: 10px !important; padding-bottom: 10px !important; background-size: contain !important; background-position: center top !important; background-color: #ecfdf5; align-items: flex-start; }
                    .hero-section.hero-image-responsive .hero-content { padding-top: 0; width: 100%; }
                    .landing-section { padding: 2rem 0; }
                    .landing-nav { top: 10px; left: 10px; }
                    .landing-cart { top: 10px; right: 10px; }
                    .specialties-section { padding: 2rem 0; }
                    .specialties-section .container { padding-left: 1rem; padding-right: 1rem; }
                    .specialties-section .grid { gap: 10px; row-gap: 10px; column-gap: 10px; }
                    .specialties-section .specialties-image-wrap > div.rounded-xl { display: block !important; line-height: 0; }
                    .specialties-section .specialties-image-wrap .landing-fit-img { display: block; margin: 0; vertical-align: bottom; }
                    .specialties-section h2 { font-size: 1.5rem; margin-bottom: 1rem; }
                    .specialties-section .space-y-3 > * + * { margin-top: 0.75rem; }
                }
                
                .landing-fit-img { max-width: 100%; width: 100%; height: auto; object-fit: contain; vertical-align: middle; }
                input[type="checkbox"] { accent-color: #16a34a; width: 1.25rem; height: 1.25rem; }
                
                .supporting-item-card { transition: all 0.2s ease; }
                .supporting-item-card.selected { border-color: #16a34a !important; box-shadow: 0 4px 6px -1px rgba(22,163,74,0.3); }
                @media (min-width: 768px) {
                    .supporting-item-card.selected { transform: translateY(-2px); }
                }
                @media (max-width: 767px) {
                    .supporting-item-card.selected { background-color: #f0fdf4; }
                }
                
                @keyframes slideDown { from { opacity: 0; max-height: 0; transform: translateY(-10px); } to { opacity: 1; max-height: 100px; transform: translateY(0); } }
                .supporting-item-quantity { animation: slideDown 0.2s ease-out; }
                .main-qty-btn { transition: all 0.2s; }
                .main-qty-btn:active { transform: scale(0.95); }
                
                @keyframes bounce-in {
                    0% { transform: scale(0.3); opacity: 0; }
                    50% { transform: scale(1.05); }
                    70% { transform: scale(0.9); }
                    100% { transform: scale(1); opacity: 1; }
                }
                .animate-bounce-in { animation: bounce-in 0.5s ease-out forwards; }
            `}</style>

            {/* ── Fixed Nav ── */}
            <div className="landing-nav">
                <Link href="/" className="landing-nav-btn">
                    <ArrowLeft style={{ width: 16, height: 16 }} />
                    <span>Back to Shop</span>
                </Link>
            </div>

            {/* ── Fixed Cart ── */}
            <div className="landing-cart">
                <button onClick={scrollToOrder} className="landing-cart-btn">
                    <ShoppingCart style={{ width: 16, height: 16 }} />
                    <span>Cart</span>
                    <span className="landing-cart-badge">{cartCount}</span>
                </button>
            </div>

            {/* ── Landing Page Content ── */}
            <div className="landing-page">
                <div className="landing-page-wrapper">

                    {/* SECTION 1 — Hero */}
                    <section
                        id="section-249"
                        className="hero-section overflow-hidden hero-image-responsive"
                        style={{
                            backgroundImage: `url('${hero1Image}')`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat",
                            height: 600,
                        }}
                    >
                        <div className="hero-content w-full">
                            <div className="container mx-auto px-4 max-w-5xl text-center"></div>
                        </div>
                    </section>

                    {/* SECTION 2 — Bengali Text Section */}
                    <section
                        id="section-251"
                        className="landing-section"
                        style={{ backgroundColor: "#e0ffef" }}
                    >
                        <div className="container mx-auto px-4 max-w-5xl">
                            <div className="text-center mb-8">
                                <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                                    {product.name}
                                </h1>
                            </div>
                            <div className="prose prose-lg mx-auto text-gray-800 leading-relaxed text-center whitespace-pre-line">
                                {product.description}
                            </div>
                        </div>
                    </section>

                    {/* SECTION 3 — Specialties (only if details are defined) */}
                    {product.details && product.details.length > 0 && (
                        <section
                            id="section-250"
                            className="landing-section specialties-section py-12 md:py-16"
                        >
                            <div className="container mx-auto px-4 max-w-5xl">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-center">

                                    {/* Content Column */}
                                    <div className="order-2 lg:order-1">
                                        <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-gray-900 leading-tight">
                                            {product.name} এর বৈশিষ্ট্য
                                        </h2>
                                        <div className="space-y-3 mb-6">
                                            {product.details.map((feat, i) => (
                                                <div key={i} className="flex items-start space-x-3">
                                                    <div className="flex-shrink-0 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mt-0.5">
                                                        <Check style={{ width: 12, height: 12, color: "white" }} />
                                                    </div>
                                                    <p className="text-base md:text-lg text-gray-700 leading-relaxed">{feat}</p>
                                                </div>
                                            ))}
                                        </div>
                                        <div>
                                            <button
                                                onClick={scrollToOrder}
                                                className="cta-button primary px-6 py-3 text-base font-semibold rounded-lg transition-all duration-200 hover:scale-105"
                                            >
                                                এখনই অর্ডার করুন
                                            </button>
                                        </div>
                                    </div>

                                    {/* Image Column */}
                                    <div className="order-1 lg:order-2">
                                        <div className="relative w-full max-w-full sm:max-w-md mx-auto lg:mx-0 specialties-image-wrap">
                                            <div className="rounded-xl overflow-hidden shadow-lg bg-gray-100 flex items-center justify-center">
                                                <img
                                                    src={specialtiesImage}
                                                    alt={product.name}
                                                    className="landing-fit-img block max-h-[85vh] sm:max-h-none"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* SECTION 4 — Second Hero */}
                    <section
                        id="section-252"
                        className="hero-section overflow-hidden hero-image-responsive"
                        style={{
                            backgroundImage: `url('${hero2Image}')`,
                            backgroundSize: "cover",
                            backgroundPosition: "center top",
                            backgroundRepeat: "no-repeat",
                            height: "100vh",
                        }}
                    >
                        <div className="hero-content w-full">
                            <div className="container mx-auto px-4 max-w-5xl text-center"></div>
                        </div>
                    </section>

                    {/* SECTION 5 — CTA banner */}
                    <section
                        id="section-254"
                        className="landing-section"
                        style={{ backgroundColor: "#e0ffee" }}
                    >
                        <div className="container mx-auto px-4 max-w-5xl text-center">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 leading-tight">
                                অগ্রিম টাকা ছাড়াই অর্ডার করুন প্রিমিয়াম {product.name}।
                            </h2>
                            <div className="flex flex-wrap justify-center gap-4 mt-6">
                                <button
                                    onClick={scrollToOrder}
                                    className="inline-flex items-center rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 bg-green-600 text-white hover:bg-green-700 px-6 py-3 text-base"
                                >
                                    অর্ডার করতে ক্লিক করুন
                                    <ArrowRight style={{ width: 16, height: 16, marginLeft: 8 }} />
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* SECTION 6 — Product Checkout */}
                    <section
                        id="product-checkout"
                        className="landing-section product-checkout-section"
                    >
                        <div className="container mx-auto px-4 max-w-4xl">
                            {error && (
                                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-center gap-2">
                                    <X style={{ width: 16, height: 16 }} />
                                    {error}
                                </div>
                            )}

                            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
                                {/* আপনার পণ্য */}
                                <div className="bg-gradient-to-r from-green-50 to-green-100 p-4">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2.5 sm:mb-3 text-center">আপনার পণ্য</h3>
                                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                        <div className="divide-y divide-gray-100">
                                            {/* Main product row */}
                                            <div className="flex items-center gap-3 p-3 sm:p-4 bg-white hover:bg-gray-50/80 transition-colors">
                                                <div className="flex-shrink-0 self-center w-5 flex justify-center">
                                                    <input
                                                        type="checkbox"
                                                        id="mainProductCheckbox"
                                                        checked={mainIncluded}
                                                        onChange={() => setMainIncluded(!mainIncluded)}
                                                    />
                                                </div>
                                                <div className="w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-100">
                                                    <img src={MAIN_PRODUCT.image} alt={MAIN_PRODUCT.name} className="w-full h-full object-contain" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-semibold text-gray-900 text-sm sm:text-base leading-snug">{product.name}</h4>
                                                    <p className="text-xs text-gray-500 mt-0.5">{MAIN_PRODUCT.weight}</p>
                                                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                                                        <span className="text-xs line-through text-gray-400">৳{MAIN_PRODUCT.originalPrice.toLocaleString()}</span>
                                                        <span className="text-base sm:text-lg font-bold text-green-600">৳{MAIN_PRODUCT.price.toLocaleString()}</span>
                                                    </div>
                                                </div>
                                                <div
                                                    id="mainProductQuantityWrap"
                                                    className={`flex items-center gap-1 flex-shrink-0 transition-opacity ${mainIncluded ? "" : "opacity-40 pointer-events-none"}`}
                                                >
                                                    <button
                                                        type="button"
                                                        disabled={!mainIncluded}
                                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                        className="main-qty-btn w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors active:scale-95 disabled:opacity-50"
                                                    >
                                                        <Minus style={{ width: 14, height: 14 }} />
                                                    </button>
                                                    <span className="text-sm font-semibold px-2 min-w-[2.25rem] text-center bg-gray-50 rounded py-1 border border-gray-200">
                                                        {quantity}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        disabled={!mainIncluded}
                                                        onClick={() => setQuantity(quantity + 1)}
                                                        className="main-qty-btn w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors active:scale-95 disabled:opacity-50"
                                                    >
                                                        <Plus style={{ width: 14, height: 14 }} />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Addon products rows (for each variant starting from index 1) */}
                                            {variants.slice(1).map((v, index) => {
                                                const addonChecked = !!addonsChecked[v.label];
                                                const addonQtyValue = addonsQty[v.label] || 1;
                                                const addonImage = product.images?.[index + 1] || product.image || "/images/placeholder.jpg";

                                                return (
                                                    <div
                                                        key={v.label}
                                                        className={`supporting-item-card flex items-center gap-3 p-3 sm:p-4 bg-white border border-transparent hover:border-green-300 transition-all ${addonChecked ? "selected" : ""}`}
                                                    >
                                                        <div className="flex-shrink-0 self-center w-5 flex justify-center">
                                                            <input
                                                                type="checkbox"
                                                                className="supporting-item-checkbox w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500 focus:ring-offset-0"
                                                                checked={addonChecked}
                                                                onChange={() => {
                                                                    setAddonsChecked(prev => ({
                                                                        ...prev,
                                                                        [v.label]: !prev[v.label]
                                                                    }));
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-100">
                                                            <img src={addonImage} alt={v.label} className="w-full h-full object-contain" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h5 className="font-semibold text-gray-900 text-sm sm:text-base leading-snug">{product.name}</h5>
                                                            <p className="text-xs text-gray-500 mt-0.5">{v.label} · ৳{v.price.toLocaleString()}</p>
                                                        </div>
                                                        <div className={`supporting-item-quantity flex items-center gap-1 flex-shrink-0 ${addonChecked ? "" : "hidden"}`}>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setAddonsQty(prev => ({
                                                                        ...prev,
                                                                        [v.label]: Math.max(1, (prev[v.label] || 1) - 1)
                                                                    }));
                                                                }}
                                                                className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors active:scale-95"
                                                            >
                                                                <Minus style={{ width: 14, height: 14 }} />
                                                            </button>
                                                            <span className="text-sm font-semibold min-w-[2rem] text-center px-1.5 py-1 bg-gray-50 rounded border border-gray-200">
                                                                {addonQtyValue}
                                                            </span>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setAddonsQty(prev => ({
                                                                        ...prev,
                                                                        [v.label]: (prev[v.label] || 1) + 1
                                                                    }));
                                                                }}
                                                                className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors active:scale-95"
                                                            >
                                                                <Plus style={{ width: 14, height: 14 }} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    <p className="text-xs text-center text-gray-600 mt-2 px-1">
                                        মূল পণ্য আনচেক করলে শুধু নির্বাচিত অতিরিক্ত আইটেম অর্ডার হবে।
                                    </p>
                                </div>

                                {/* Checkout Form */}
                                <div className="p-6">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        {/* Customer Information */}
                                        <div>
                                            <h4 className="text-xl font-semibold mb-4 text-gray-900">আপনার তথ্য দিন</h4>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">আপনার নাম *</label>
                                                    <input
                                                        type="text"
                                                        value={name}
                                                        onChange={e => setName(e.target.value)}
                                                        required
                                                        placeholder="সম্পূর্ণ নাম লিখুন"
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">মোবাইল নাম্বার *</label>
                                                    <input
                                                        type="tel"
                                                        value={phone}
                                                        onChange={e => setPhone(e.target.value)}
                                                        required
                                                        placeholder="সঠিক ১১ ডিজিটের মোবাইল নাম্বার"
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">সম্পূর্ণ ঠিকানা *</label>
                                                    <textarea
                                                        value={address}
                                                        onChange={e => setAddress(e.target.value)}
                                                        required
                                                        rows={3}
                                                        placeholder="বাড়ি/রোড নং, রোড বা উপজেলা, জেলা"
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none resize-none"
                                                    />
                                                </div>
                                                {/* Delivery Method */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">ডেলিভারি পদ্ধতি</label>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <div
                                                            className={`landing-shipping-card rounded-lg p-3 border-2 ${shippingType === "dhaka" ? "selected" : "border-gray-200"}`}
                                                            id="landing-shipping-dhaka"
                                                            onClick={() => setShippingType("dhaka")}
                                                        >
                                                            <div className="flex items-center justify-between">
                                                                <div>
                                                                    <div className="font-semibold text-sm">ঢাকায়</div>
                                                                    <div className="text-xs text-gray-600">২-৩ দিন</div>
                                                                </div>
                                                                <div className="font-bold text-green-600">৳{calculateShipping("dhaka")}</div>
                                                            </div>
                                                        </div>
                                                        <div
                                                            className={`landing-shipping-card rounded-lg p-3 border-2 ${shippingType === "urgent" ? "selected" : "border-gray-200"}`}
                                                            id="landing-shipping-urgent"
                                                            onClick={() => setShippingType("urgent")}
                                                        >
                                                            <div className="flex items-center justify-between">
                                                                <div>
                                                                    <div className="font-semibold text-sm">ঢাকার বাইরে</div>
                                                                    <div className="text-xs text-gray-600">৩-৫ দিন</div>
                                                                </div>
                                                                <div className="font-bold text-orange-600">৳{calculateShipping("urgent")}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Order Summary */}
                                        <div>
                                            <h4 className="text-xl font-semibold mb-4 text-gray-900">আপনার অর্ডার</h4>
                                            <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                                {/* Primary Product Summary */}
                                                <div
                                                    id="mainProductSummaryBlock"
                                                    className={`mb-2 transition-opacity ${mainIncluded ? "" : "opacity-50"}`}
                                                >
                                                    <div className="flex items-center justify-between mb-1">
                                                        <div className="flex items-center space-x-2 min-w-0">
                                                            <div className="w-8 h-8 bg-green-600 rounded flex-shrink-0 flex items-center justify-center">
                                                                <Package style={{ width: 16, height: 16, color: "white" }} />
                                                            </div>
                                                            <span className="font-medium truncate">{MAIN_PRODUCT.name}</span>
                                                        </div>
                                                        <span className="font-semibold flex-shrink-0 ml-2">
                                                            ৳{mainSubtotal.toLocaleString()}
                                                        </span>
                                                    </div>
                                                    {mainIncluded && (
                                                        <div id="mainQuantitySummaryRow" className="text-sm text-gray-600 pl-10">
                                                            পরিমাণ: {quantity}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Addon Summary */}
                                                {variants.slice(1).some(v => addonsChecked[v.label]) && (
                                                    <div className="mt-2 space-y-1" id="selectedSupportingItemsList">
                                                        <div className="border-t pt-2">
                                                            <div className="text-xs font-semibold text-gray-600 mb-1">অতিরিক্ত আইটেম:</div>
                                                            {variants.slice(1).filter(v => addonsChecked[v.label]).map((v) => {
                                                                const qty = addonsQty[v.label] || 1;
                                                                return (
                                                                    <div key={v.label} className="flex items-center justify-between text-sm text-gray-700 mt-1">
                                                                        <span className="truncate">{product.name} ({v.label}) × {qty}</span>
                                                                        <span className="font-medium ml-2">৳{(v.price * qty).toLocaleString()}</span>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="border-t pt-3 mt-3">
                                                    <div className="flex justify-between text-sm">
                                                        <span>পণ্যের মূল্য</span>
                                                        <span>৳{subtotal.toLocaleString()}</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm mt-1">
                                                        <span>ডেলিভারি চার্জ</span>
                                                        <span>৳{deliveryCharge}</span>
                                                    </div>
                                                    <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                                                        <span>সর্বমোট</span>
                                                        <span>৳{total.toLocaleString()}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* COD Badge */}
                                            <div className="flex items-center gap-2 py-2 px-3 bg-green-50 border border-green-200 rounded-lg text-sm mb-6">
                                                <Banknote style={{ width: 16, height: 16, color: "#16a34a", flexShrink: 0 }} />
                                                <span className="font-medium text-green-900">ক্যাশ অন ডেলিভারি (COD)</span>
                                                <span className="text-green-600">— পণ্য হাতে পেয়ে টাকা দিন</span>
                                            </div>

                                            <button
                                                onClick={handlePlaceOrder}
                                                disabled={isLoading || total === 0}
                                                className="w-full bg-green-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                                            >
                                                {isLoading ? (
                                                    <>
                                                        <Loader2 style={{ width: 20, height: 20 }} className="animate-spin" />
                                                        প্রসেস হচ্ছে...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Lock style={{ width: 20, height: 20 }} />
                                                        PLACE ORDER - ৳{total.toLocaleString()}
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                </div>
            </div>

            {/* Success Modal Overlay */}
            {success && (
                <div id="successPopup" className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform animate-bounce-in">
                        <div className="p-6 text-center">
                            {/* Success Icon */}
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-8 h-8 text-green-600" />
                            </div>
                            
                            {/* Success Message */}
                            <h3 className="text-xl font-bold text-gray-900 mb-2">অর্ডার সফল হয়েছে!</h3>
                            <p className="text-gray-600 mb-4">আপনার অর্ডার সফলভাবে সম্পন্ন হয়েছে।</p>
                            
                            {/* Order Number */}
                            <div className="bg-green-50 rounded-lg p-3 mb-6">
                                <p className="text-sm text-gray-600">অর্ডার নাম্বার</p>
                                <p className="text-lg font-bold text-green-600">#ORD-{orderId}</p>
                            </div>
                            
                            {/* Additional Info */}
                            <p className="text-sm text-gray-500 mb-6">আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব। ধন্যবাদ!</p>
                            <p className="text-xs text-gray-400 mb-4">Redirecting to home page in 5 seconds...</p>
                            
                            {/* Close Button */}
                            <button
                                onClick={() => window.location.href = "/"}
                                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProductDetailClient;
