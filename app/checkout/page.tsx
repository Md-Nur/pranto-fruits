"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { ArrowLeft, CheckCircle2, ChevronRight, CreditCard, Truck, Loader2, AlertCircle } from "lucide-react";

export default function CheckoutPage() {
    const { cart, cartTotal } = useCart();
    const router = useRouter();
    const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Success
    const [isLoading, setIsLoading] = useState(false);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [error, setError] = useState("");

    const shippingCost = 60; // Standard shipping inside Dhaka
    const total = cartTotal + (cartTotal > 0 ? shippingCost : 0);

    const [paymentMethod, setPaymentMethod] = useState("cod");
    const [shippingInfo, setShippingInfo] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        address: "",
        city: "dhaka",
        zipCode: "",
    });

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch("/api/auth/check");
                const data = await res.json();
                if (data.authenticated) {
                    setUser(data.user);
                    const nameParts = (data.user.name || "").split(" ");
                    setShippingInfo(prev => ({
                        ...prev,
                        firstName: nameParts[0] || "",
                        lastName: nameParts.slice(1).join(" ") || "",
                        phone: data.user.phone || prev.phone,
                        address: data.user.address || prev.address,
                        city: data.user.city || prev.city,
                        zipCode: data.user.zipCode || prev.zipCode,
                    }));
                }
            } catch (err) {
                console.error("Auth check failed", err);
            } finally {
                setIsCheckingAuth(false);
            }
        };
        checkAuth();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
    };

    const handlePlaceOrder = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            router.push("/login?redirect=/checkout");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    totalAmount: total,
                    paymentMethod,
                    shippingInfo,
                    orderItems: cart,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to place order");
            }

            // Save address fields to user profile for next time
            try {
                await fetch("/api/user/profile", {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        address: shippingInfo.address,
                        city: shippingInfo.city,
                        zipCode: shippingInfo.zipCode,
                    }),
                });
            } catch {
                // Non-critical: ignore profile save errors
            }

            setStep(3);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (isCheckingAuth) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader2 size={40} className="animate-spin text-primary" />
            </div>
        );
    }

    if (cart.length === 0 && step !== 3) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 size={48} className="text-gray-200" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
                <p className="text-gray-500 mb-8 text-center max-w-md">
                    Looks like you haven't added any fresh fruits to your cart yet. Let's find something delicious!
                </p>
                <Link
                    href="/shop"
                    className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-primary-dark transition-colors"
                >
                    Start Shopping
                </Link>
            </div>
        );
    }

    if (step === 3) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-500">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600">
                    <CheckCircle2 size={40} />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center font-hind-siliguri">অর্ডার সফল হয়েছে!</h1>
                <p className="text-gray-500 mb-8 text-center max-w-md">
                    Thank you for your order. We've received your request and will begin processing it shortly.
                </p>
                <div className="bg-gray-50 rounded-2xl p-6 w-full max-w-sm mb-8 text-center">
                    <p className="text-sm text-gray-500 mb-1">Order Number</p>
                    <p className="text-xl font-bold text-gray-900">#ORD-{Math.floor(1000 + Math.random() * 9000)}</p>
                </div>
                <Link
                    href="/"
                    className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-primary-dark transition-colors"
                >
                    Return Home
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
            {/* Header / Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
                <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
                    <ArrowLeft size={16} /> Back to Shopping
                </Link>
                <ChevronRight size={14} className="text-gray-300" />
                <span className={step >= 1 ? "text-primary font-medium" : ""}>Shipping</span>
                <ChevronRight size={14} className="text-gray-300" />
                <span className={step >= 2 ? "text-primary font-medium" : ""}>Payment</span>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl flex items-center gap-3 text-sm animate-in fade-in slide-in-from-top-2">
                    <AlertCircle size={18} />
                    <span>{error}</span>
                </div>
            )}

            {!user && step < 3 && (
                <div className="mb-8 p-6 bg-amber-50 border border-amber-100 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4 text-amber-800">
                        <div className="p-3 bg-white rounded-2xl shadow-sm">
                            <AlertCircle size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold">You are not logged in</h4>
                            <p className="text-sm opacity-80">Login to your account to save your order history and get faster checkout.</p>
                        </div>
                    </div>
                    <Link href="/login?redirect=/checkout" className="bg-amber-600 text-white px-6 py-2 rounded-full font-bold hover:bg-amber-700 transition-colors shrink-0">
                        Login Now
                    </Link>
                </div>
            )}

            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                {/* Left Column: Forms */}
                <div className="flex-1">
                    {step === 1 && (
                        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-4">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                <span className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm">1</span>
                                Shipping Details
                            </h2>
                            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">First Name</label>
                                        <input type="text" name="firstName" value={shippingInfo.firstName} onChange={handleInputChange} required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" placeholder="e.g. Rakib" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Last Name</label>
                                        <input type="text" name="lastName" value={shippingInfo.lastName} onChange={handleInputChange} required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" placeholder="e.g. Hasan" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Phone Number</label>
                                    <input type="tel" name="phone" value={shippingInfo.phone} onChange={handleInputChange} required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" placeholder="01XXX-XXXXXX" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Delivery Address</label>
                                    <textarea name="address" value={shippingInfo.address} onChange={handleInputChange} required rows={3} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" placeholder="House no, Road no, Area..."></textarea>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">City</label>
                                        <select name="city" value={shippingInfo.city} onChange={handleInputChange} required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors">
                                            <option value="dhaka">Dhaka</option>
                                            <option value="chattogram">Chattogram</option>
                                            <option value="sylhet">Sylhet</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Zip Code (Optional)</label>
                                        <input type="text" name="zipCode" value={shippingInfo.zipCode} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" placeholder="e.g. 1205" />
                                    </div>
                                </div>

                                <div className="pt-6">
                                    <button type="submit" className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-primary-dark transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
                                        Continue to Payment <ChevronRight size={20} />
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 animate-in fade-in slide-in-from-right-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                <span className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm">2</span>
                                Payment Method
                            </h2>
                            <form className="space-y-6" onSubmit={handlePlaceOrder}>

                                <div className="space-y-3">
                                    <label className={`block cursor-pointer rounded-2xl border-2 p-4 transition-all ${paymentMethod === 'cod' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50'}`}>
                                        <div className="flex items-center gap-4">
                                            <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center border-primary">
                                                {paymentMethod === 'cod' && <div className="w-3 h-3 rounded-full bg-primary" />}
                                            </div>
                                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600">
                                                <Truck size={20} />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-gray-900">Cash on Delivery</h4>
                                                <p className="text-sm text-gray-500">Pay when you receive the products</p>
                                            </div>
                                        </div>
                                        <input type="radio" className="hidden" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
                                    </label>

                                    <label className={`block cursor-pointer rounded-2xl border-2 p-4 transition-all ${paymentMethod === 'bkash' ? 'border-[#e2136e] bg-[#e2136e]/5' : 'border-gray-200 hover:border-[#e2136e]/50'}`}>
                                        <div className="flex items-center gap-4">
                                            <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center border-gray-300">
                                                {paymentMethod === 'bkash' && <div className="w-3 h-3 rounded-full bg-[#e2136e]" />}
                                            </div>
                                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                                                <span className="font-bold text-[#e2136e] text-xs">bKash</span>
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-gray-900">bKash Online</h4>
                                                <p className="text-sm text-gray-500">Fast and secure mobile payment</p>
                                            </div>
                                        </div>
                                        <input type="radio" className="hidden" name="payment" value="bkash" checked={paymentMethod === 'bkash'} onChange={() => setPaymentMethod('bkash')} />
                                    </label>

                                    <label className={`block cursor-pointer rounded-2xl border-2 p-4 transition-all ${paymentMethod === 'card' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}>
                                        <div className="flex items-center gap-4">
                                            <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center border-gray-300">
                                                {paymentMethod === 'card' && <div className="w-3 h-3 rounded-full bg-blue-600" />}
                                            </div>
                                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600">
                                                <CreditCard size={20} />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-gray-900">Credit / Debit Card</h4>
                                                <p className="text-sm text-gray-500">Visa, Mastercard, Amex</p>
                                            </div>
                                        </div>
                                        <input type="radio" className="hidden" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} />
                                    </label>
                                </div>

                                <div className="pt-6 flex gap-4">
                                    <button type="button" onClick={() => setStep(1)} className="px-6 py-4 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">
                                        Back
                                    </button>
                                    <button type="submit" disabled={isLoading} className="flex-1 bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-70">
                                        {isLoading ? <Loader2 className="animate-spin" size={24} /> : `Confirm Order - ৳${total}`}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>

                {/* Right Column: Order Summary */}
                <div className="lg:w-[400px]">
                    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 sticky top-24">
                        <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>

                        <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            {cart.map((item) => (
                                <div key={`${item.id}-${item.variant}`} className="flex gap-4">
                                    <div className="relative w-16 h-16 bg-gray-50 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                                        {/* Optional image rendering if the URL is valid, fallback handled if not */}
                                        {item.image ? (
                                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-gray-200" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-sm text-gray-900 line-clamp-1">{item.name}</h4>
                                        {item.variant && <p className="text-xs text-gray-500">{item.variant}</p>}
                                        <div className="flex items-center justify-between mt-1">
                                            <span className="text-xs text-gray-500">Qty: {item.quantity}</span>
                                            <span className="font-bold text-sm text-organic-green">৳{item.price * item.quantity}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-gray-100 pt-6 space-y-3">
                            <div className="flex justify-between text-gray-500">
                                <span>Subtotal</span>
                                <span>৳{cartTotal}</span>
                            </div>
                            <div className="flex justify-between text-gray-500">
                                <span>Shipping</span>
                                <span>৳{shippingCost}</span>
                            </div>
                            <div className="flex justify-between text-gray-500 border-t border-dashed pt-2 mt-2 font-bold text-gray-900">
                                <span>Total</span>
                                <span className="text-primary text-xl">৳{total}</span>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-100">
                            <div className="flex items-center justify-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
                                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M2.166 4.9L10 1.083 17.833 4.9v10.2L10 19 2.166 15.1V4.9zM10 3.3L4 6.208v7.584l6 2.909 6-2.909V6.208L10 3.3zM10 8a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <p className="text-xs text-gray-500 font-medium font-hind-siliguri">নিরাপদ পেমেন্ট গ্যারান্টি</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
