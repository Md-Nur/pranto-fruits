"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    ArrowLeft,
    CheckCircle2,
    Truck,
    Minus,
    Plus,
    ShieldCheck,
    Leaf,
    Star,
    Package,
    Phone,
    MapPin,
    Loader2,
    ChevronDown,
} from "lucide-react";

/* ─────────────── Product Data ─────────────── */
const PRODUCTS = [
    {
        id: "11kg",
        label: "হিমসাগর আম ১১ কেজি",
        weight: "11kg",
        originalPrice: 1749,
        price: 1590,
        image: "/himsagar-mango-product.png",
    },
    {
        id: "22kg",
        label: "হিমসাগর আম ২২ কেজি",
        weight: "22kg",
        originalPrice: 3500,
        price: 3150,
        image: "/himsagar-mango-product.png",
    },
];

const FEATURES = [
    "এটি অত্যন্ত মিষ্টি ও রসালো হয়ে থাকে।",
    "পাকার পর এই আম থেকে একটি বিশেষ ও তীব্র মিষ্টি সুগন্ধ বের হয়।",
    "প্রতিটি আমের গড় ওজন ২৫০-৩০০ গ্রাম হয়।",
    "এই হিমসাগর আম ৩-৪ টিতে ১ কেজি হয়।",
    "আত্মীয় বা পরিবারকে মৌসুমী উপহার হিসেবে পাঠানোর জন্য দারুণ।",
    "অনন্য স্বাদের জন্য এটি বাংলাদেশের (GI) পণ্য হিসেবে স্বীকৃত।",
];

const TRUST_BADGES = [
    { icon: ShieldCheck, title: "১০০% আসল", desc: "চাঁপাইনবাবগঞ্জ থেকে সরাসরি" },
    { icon: Leaf, title: "ক্যামিকেলমুক্ত", desc: "প্রাকৃতিকভাবে পাকানো" },
    { icon: Truck, title: "হোম ডেলিভারি", desc: "সারা বাংলাদেশে" },
    { icon: Star, title: "GI স্বীকৃত", desc: "বাংলাদেশের তৃতীয় GI পণ্য" },
];

/* ─────────────── Component ─────────────── */
export default function HimsagarMangoLandingPage() {
    // Cart / product selection
    const [selectedProduct, setSelectedProduct] = useState(PRODUCTS[0]);
    const [quantity, setQuantity] = useState(1);
    const [addOns, setAddOns] = useState<Record<string, boolean>>({});

    // Delivery
    const [deliveryZone, setDeliveryZone] = useState<"dhaka" | "outside">("dhaka");

    // Form
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");

    // UI state
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [orderId, setOrderId] = useState<number | null>(null);
    const [success, setSuccess] = useState(false);

    /* ─── Pricing ─── */
    const addOnTotal = PRODUCTS.filter(
        (p) => addOns[p.id] && p.id !== selectedProduct.id
    ).reduce((sum, p) => sum + p.price, 0);

    const productSubtotal = selectedProduct.price * quantity;
    const subtotal = productSubtotal + addOnTotal;
    const deliveryCharge = 0; // free for both zones in this campaign
    const total = subtotal + deliveryCharge;

    /* ─── Order Submission ─── */
    const handleOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !phone.trim() || !address.trim()) {
            setError("সব তথ্য পূরণ করুন।");
            return;
        }
        if (!/^(\\+88)?01[3-9]\\d{8}$/.test(phone)) {
            setError("সঠিক মোবাইল নম্বর দিন (১১ ডিজিট)।");
            return;
        }

        setIsLoading(true);
        setError("");

        // Build order items
        const orderItems = [
            {
                id: selectedProduct.id,
                name: selectedProduct.label,
                variant: selectedProduct.weight,
                price: selectedProduct.price,
                quantity,
                image: selectedProduct.image,
            },
            ...PRODUCTS.filter((p) => addOns[p.id] && p.id !== selectedProduct.id).map(
                (p) => ({
                    id: p.id,
                    name: p.label,
                    variant: p.weight,
                    price: p.price,
                    quantity: 1,
                    image: p.image,
                })
            ),
        ];

        const nameParts = name.trim().split(" ");
        const payload = {
            shippingInfo: {
                firstName: nameParts[0] || name,
                lastName: nameParts.slice(1).join(" ") || ".",
                phone,
                address,
                city: deliveryZone === "dhaka" ? "dhaka" : "other",
                zipCode: "",
                deliveryType: "home",
            },
            paymentMethod: "cod",
            paymentDetails: null,
            totalAmount: total,
            orderItems,
        };

        try {
            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "অর্ডার দিতে সমস্যা হয়েছে।");
            setOrderId(data.orderId);
            setSuccess(true);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    /* ─────────── Success Screen ─────────── */
    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex flex-col items-center justify-center p-6 text-center">
                <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-12 h-12 text-green-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-3">অর্ডার সফল হয়েছে!</h1>
                    <p className="text-gray-500 mb-6">
                        আপনার অর্ডার গ্রহণ করা হয়েছে। আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।
                    </p>
                    <div className="bg-green-50 rounded-2xl p-5 mb-8">
                        <p className="text-sm text-gray-500 mb-1">অর্ডার নম্বর</p>
                        <p className="text-2xl font-bold text-green-700">#ORD-{orderId}</p>
                    </div>
                    <Link
                        href="/"
                        className="inline-block w-full py-4 bg-green-600 text-white rounded-xl font-bold text-lg hover:bg-green-700 transition-colors"
                    >
                        হোমপেজে ফিরুন
                    </Link>
                </div>
            </div>
        );
    }

    /* ─────────── Main Layout ─────────── */
    return (
        <div className="min-h-screen bg-white font-sans" style={{ fontFamily: "'Hind Siliguri', 'Inter', sans-serif" }}>
            {/* ── Top Nav Bar ── */}
            <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
                <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-gray-700 hover:text-green-700 transition-colors font-medium text-sm">
                        <ArrowLeft className="w-4 h-4" />
                        <span className="hidden sm:inline">দোকানে ফিরুন</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <span className="text-xl">🥭</span>
                        <span className="font-bold text-gray-900 text-sm sm:text-base">হিমসাগর আম — বিশেষ অফার</span>
                    </div>
                    <a href="#order-form" className="px-4 py-2 bg-green-600 text-white rounded-full text-sm font-bold hover:bg-green-700 transition-colors">
                        অর্ডার করুন
                    </a>
                </div>
            </div>

            {/* ── Hero Section ── */}
            <section className="relative min-h-[70vh] flex items-end overflow-hidden pt-16">
                <Image
                    src="/himsagar-mango-hero.png"
                    alt="Himsagar Mango"
                    fill
                    className="object-cover"
                    priority
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                {/* Hero content */}
                <div className="relative z-10 w-full px-6 pb-16 max-w-5xl mx-auto">
                    <div className="inline-flex items-center gap-2 bg-amber-400 text-amber-900 px-4 py-1.5 rounded-full text-xs font-bold mb-4 shadow">
                        <span>🏅</span> বাংলাদেশের GI স্বীকৃত পণ্য
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-4 drop-shadow-lg">
                        চাঁপাইনবাবগঞ্জের<br />
                        <span className="text-amber-400">হিমসাগর আম</span>
                    </h1>
                    <p className="text-white/85 text-lg md:text-xl max-w-2xl mb-8 leading-relaxed">
                        আমের রাজা — অগ্রিম টাকা ছাড়াই ক্যাশ অন ডেলিভারিতে অর্ডার করুন
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <a
                            href="#order-form"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-green-500 hover:bg-green-400 text-white font-bold rounded-xl text-lg transition-all shadow-xl hover:shadow-green-400/30 hover:-translate-y-0.5"
                        >
                            এখনই অর্ডার করুন
                        </a>
                        <a
                            href="#features"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-white/15 backdrop-blur-sm border border-white/30 text-white font-bold rounded-xl text-lg hover:bg-white/25 transition-all"
                        >
                            আরও জানুন <ChevronDown className="w-5 h-5" />
                        </a>
                    </div>
                </div>
            </section>

            {/* ── Trust Badges ── */}
            <section className="bg-amber-50 border-y border-amber-100">
                <div className="max-w-5xl mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {TRUST_BADGES.map((b) => (
                        <div key={b.title} className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                <b.icon className="w-5 h-5 text-green-700" />
                            </div>
                            <div>
                                <p className="font-bold text-gray-900 text-sm">{b.title}</p>
                                <p className="text-xs text-gray-500">{b.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── About Section ── */}
            <section className="py-16 bg-gradient-to-b from-emerald-50 to-white">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <div className="inline-block bg-green-100 text-green-800 px-4 py-1.5 rounded-full text-sm font-bold mb-5">
                        হিমসাগর আম সম্পর্কে জানুন
                    </div>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 leading-tight">
                        চাঁপাইনবাবগঞ্জের বিখ্যাত<br />
                        <span className="text-green-700">হিমসাগর বা ক্ষীরসাপাত আম</span>
                    </h2>
                    <p className="text-gray-600 text-lg leading-relaxed max-w-3xl mx-auto">
                        চাঁপাইনবাবগঞ্জের হিমসাগর আম বাংলাদেশের অন্যতম সেরা এবং সুস্বাদু আম,
                        যা স্থানীয়ভাবে ক্ষীরসাপাত নামে সর্বাধিক পরিচিত। এটি স্বাদে-গন্ধে
                        অতুলনীয় এবং জনপ্রিয়তার কারণে একে <strong>"আমের রাজা"</strong> বলা হয়।
                        ২০১৯ সালে এই আমটি বাংলাদেশের ৩য় ভৌগোলিক নির্দেশক (GI) পণ্য হিসেবে
                        আনুষ্ঠানিক স্বীকৃতি লাভ করে।
                    </p>
                </div>
            </section>

            {/* ── Features Section ── */}
            <section id="features" className="py-16 bg-white">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                        {/* Image */}
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] order-last lg:order-first">
                            <Image
                                src="/himsagar-mango-product.png"
                                alt="Himsagar Mango Features"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                            <div className="absolute bottom-4 left-4 bg-amber-400 text-amber-900 px-3 py-1.5 rounded-full text-sm font-bold">
                                ২৫০-৩০০ গ্রাম প্রতিটি আম
                            </div>
                        </div>
                        {/* Features */}
                        <div>
                            <div className="inline-block bg-green-100 text-green-800 px-4 py-1.5 rounded-full text-sm font-bold mb-5">
                                হিমসাগর আমের বৈশিষ্ট্য
                            </div>
                            <h2 className="text-3xl font-extrabold text-gray-900 mb-8 leading-tight">
                                কেন হিমসাগর আম<br />
                                <span className="text-green-700">এত বিশেষ?</span>
                            </h2>
                            <ul className="space-y-4">
                                {FEATURES.map((f, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-0.5">
                                            <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                                        </div>
                                        <p className="text-gray-700 text-base leading-relaxed">{f}</p>
                                    </li>
                                ))}
                            </ul>
                            <a
                                href="#order-form"
                                className="mt-8 inline-flex items-center gap-2 px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl text-base transition-all shadow-lg hover:shadow-green-600/30"
                            >
                                এখনই অর্ডার করুন
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── CTA Banner ── */}
            <section className="py-14 bg-gradient-to-r from-green-700 via-emerald-600 to-teal-600">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4 leading-tight">
                        অগ্রিম টাকা ছাড়াই অর্ডার করুন<br />
                        <span className="text-amber-300">চাঁপাইনবাবগঞ্জের প্রিমিয়াম হিমসাগর আম!</span>
                    </h2>
                    <p className="text-white/80 mb-8 text-lg">পণ্য হাতে পেলে তারপর টাকা দিন — কোনো ঝুঁকি নেই!</p>
                    <a
                        href="#order-form"
                        className="inline-flex items-center gap-2 px-10 py-4 bg-amber-400 hover:bg-amber-300 text-amber-900 font-bold rounded-xl text-lg transition-all shadow-xl"
                    >
                        অর্ডার করতে ক্লিক করুন →
                    </a>
                </div>
            </section>

            {/* ── Order Section ── */}
            <section id="order-form" className="py-16 bg-gray-50">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="text-center mb-10">
                        <div className="inline-block bg-green-100 text-green-800 px-4 py-1.5 rounded-full text-sm font-bold mb-4">
                            অর্ডার করুন
                        </div>
                        <h2 className="text-3xl font-extrabold text-gray-900">
                            আপনার হিমসাগর আম অর্ডার করুন
                        </h2>
                    </div>

                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                        {/* Product Selection */}
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 border-b border-green-100">
                            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Package className="w-5 h-5 text-green-600" />
                                আপনার পণ্য নির্বাচন করুন
                            </h3>
                            <div className="space-y-3">
                                {PRODUCTS.map((product) => (
                                    <div
                                        key={product.id}
                                        onClick={() => setSelectedProduct(product)}
                                        className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                                            selectedProduct.id === product.id
                                                ? "border-green-500 bg-green-50 shadow-md"
                                                : "border-gray-200 bg-white hover:border-green-300"
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            checked={selectedProduct.id === product.id}
                                            onChange={() => setSelectedProduct(product)}
                                            className="w-5 h-5 text-green-600 accent-green-600"
                                        />
                                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100">
                                            <Image src={product.image} alt={product.label} width={56} height={56} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-gray-900">{product.label}</h4>
                                            <p className="text-xs text-gray-500 mt-0.5">ক্যাশ অন ডেলিভারি</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-sm line-through text-gray-400">৳{product.originalPrice.toLocaleString()}</span>
                                                <span className="text-lg font-extrabold text-green-700">৳{product.price.toLocaleString()}</span>
                                            </div>
                                        </div>
                                        {selectedProduct.id === product.id && (
                                            <div className="flex items-center gap-1 flex-shrink-0">
                                                <button
                                                    type="button"
                                                    onClick={(e) => { e.stopPropagation(); setQuantity(Math.max(1, quantity - 1)); }}
                                                    className="w-9 h-9 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors"
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <span className="w-9 text-center font-bold">{quantity}</span>
                                                <button
                                                    type="button"
                                                    onClick={(e) => { e.stopPropagation(); setQuantity(quantity + 1); }}
                                                    className="w-9 h-9 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {/* Add-on product */}
                                {PRODUCTS.filter((p) => p.id !== selectedProduct.id).map((addon) => (
                                    <div
                                        key={`addon-${addon.id}`}
                                        onClick={() => setAddOns((prev) => ({ ...prev, [addon.id]: !prev[addon.id] }))}
                                        className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                                            addOns[addon.id]
                                                ? "border-amber-400 bg-amber-50 shadow-md"
                                                : "border-gray-200 bg-white hover:border-amber-200"
                                        }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={!!addOns[addon.id]}
                                            onChange={() => setAddOns((prev) => ({ ...prev, [addon.id]: !prev[addon.id] }))}
                                            className="w-5 h-5 accent-amber-500"
                                        />
                                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100">
                                            <Image src={addon.image} alt={addon.label} width={56} height={56} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-gray-900 text-sm">{addon.label}</h4>
                                            <p className="text-xs text-gray-500 mt-0.5">অতিরিক্ত যোগ করুন · ৳{addon.price.toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <p className="text-xs text-center text-gray-500 mt-3">
                                মূল পণ্যের পাশাপাশি অতিরিক্ত আইটেমও যোগ করতে পারেন।
                            </p>
                        </div>

                        {/* Form + Summary Grid */}
                        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Customer Information */}
                            <form onSubmit={handleOrder} id="checkout-form">
                                <h4 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                                    <Phone className="w-5 h-5 text-green-600" />
                                    আপনার তথ্য দিন
                                </h4>

                                {error && (
                                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
                                        {error}
                                    </div>
                                )}

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                            আপনার নাম *
                                        </label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                            placeholder="সম্পূর্ণ নাম লিখুন"
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition-colors text-gray-900"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                            মোবাইল নম্বর *
                                        </label>
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            required
                                            placeholder="01XXXXXXXXX"
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition-colors text-gray-900"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                            সম্পূর্ণ ঠিকানা *
                                        </label>
                                        <textarea
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            required
                                            rows={3}
                                            placeholder="বাড়ি/রোড নং, উপজেলা, জেলা"
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition-colors text-gray-900 resize-none"
                                        />
                                    </div>

                                    {/* Delivery Zone */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            <Truck className="w-4 h-4 inline mr-1 text-green-600" />
                                            ডেলিভারি এলাকা
                                        </label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {[
                                                { key: "dhaka", label: "ঢাকায়", sub: "২-৩ দিন", charge: "৳০" },
                                                { key: "outside", label: "ঢাকার বাইরে", sub: "৩-৫ দিন", charge: "৳০" },
                                            ].map((zone) => (
                                                <div
                                                    key={zone.key}
                                                    onClick={() => setDeliveryZone(zone.key as "dhaka" | "outside")}
                                                    className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                                                        deliveryZone === zone.key
                                                            ? "border-green-500 bg-green-50"
                                                            : "border-gray-200 hover:border-green-300"
                                                    }`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="font-bold text-sm text-gray-900">{zone.label}</p>
                                                            <p className="text-xs text-gray-500">{zone.sub}</p>
                                                        </div>
                                                        <span className="font-bold text-green-600 text-sm">{zone.charge}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </form>

                            {/* Order Summary */}
                            <div>
                                <h4 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-green-600" />
                                    আপনার অর্ডার
                                </h4>

                                <div className="bg-gray-50 rounded-2xl p-5 mb-5 space-y-3">
                                    {/* Main product */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <Package className="w-4 h-4 text-white" />
                                            </div>
                                            <span className="font-medium text-gray-900 text-sm truncate">{selectedProduct.label}</span>
                                        </div>
                                        <span className="font-bold text-gray-900 ml-2 flex-shrink-0">
                                            ৳{(selectedProduct.price * quantity).toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="text-xs text-gray-500 pl-10">পরিমাণ: {quantity}</div>

                                    {/* Add-ons */}
                                    {PRODUCTS.filter((p) => addOns[p.id] && p.id !== selectedProduct.id).map((p) => (
                                        <div key={`summary-${p.id}`} className="flex items-center justify-between">
                                            <span className="text-sm text-gray-700 truncate">{p.label}</span>
                                            <span className="font-medium text-gray-700 flex-shrink-0 ml-2">৳{p.price.toLocaleString()}</span>
                                        </div>
                                    ))}

                                    <div className="border-t border-gray-200 pt-3 space-y-2">
                                        <div className="flex justify-between text-sm text-gray-600">
                                            <span>পণ্যের মূল্য</span>
                                            <span>৳{subtotal.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-sm text-gray-600">
                                            <span>ডেলিভারি চার্জ</span>
                                            <span className="text-green-600 font-bold">বিনামূল্যে</span>
                                        </div>
                                        <div className="flex justify-between font-extrabold text-lg border-t border-gray-200 pt-2 mt-1">
                                            <span>সর্বমোট</span>
                                            <span className="text-green-700">৳{total.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* COD Badge */}
                                <div className="flex items-center gap-3 py-3 px-4 bg-green-50 border-2 border-green-200 rounded-xl mb-5">
                                    <ShieldCheck className="w-5 h-5 text-green-600 flex-shrink-0" />
                                    <div>
                                        <p className="font-bold text-green-900 text-sm">ক্যাশ অন ডেলিভারি (COD)</p>
                                        <p className="text-xs text-green-700">পণ্য হাতে পেয়ে টাকা দিন — কোনো ঝুঁকি নেই!</p>
                                    </div>
                                </div>

                                {/* Place Order */}
                                <button
                                    type="submit"
                                    form="checkout-form"
                                    disabled={isLoading}
                                    className="w-full py-4 bg-green-600 hover:bg-green-700 disabled:opacity-70 text-white font-extrabold text-lg rounded-xl transition-all shadow-lg hover:shadow-green-600/30 flex items-center justify-center gap-2"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            অর্ডার প্রসেস হচ্ছে...
                                        </>
                                    ) : (
                                        <>
                                            <ShieldCheck className="w-5 h-5" />
                                            PLACE ORDER — ৳{total.toLocaleString()}
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="bg-gray-900 text-gray-400 py-10">
                <div className="max-w-5xl mx-auto px-6 text-center">
                    <div className="flex items-center justify-center gap-2 mb-3">
                        <Image src="/logo.png" alt="Logo" width={36} height={36} className="rounded-full" />
                        <span className="font-bold text-white text-lg">Village Organic Fruits Ltd.</span>
                    </div>
                    <p className="text-sm mb-4">সরাসরি বাগান থেকে আপনার দরজায়</p>
                    <div className="flex justify-center gap-6 text-sm mb-6">
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
                        <Link href="/refund" className="hover:text-white transition-colors">Refund</Link>
                        <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
                    </div>
                    <p className="text-xs text-gray-600">© 2025 Village Organic Fruits Ltd. All rights reserved.</p>
                </div>
            </footer>

            {/* ── Sticky Bottom CTA (mobile) ── */}
            <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white border-t border-gray-200 p-3 shadow-2xl">
                <a
                    href="#order-form"
                    className="block w-full py-4 bg-green-600 hover:bg-green-700 text-white font-extrabold text-center rounded-xl transition-colors text-lg"
                >
                    🥭 এখনই অর্ডার করুন — ৳{PRODUCTS[0].price.toLocaleString()}
                </a>
            </div>
        </div>
    );
}
