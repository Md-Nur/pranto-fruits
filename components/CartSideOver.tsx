"use client";

import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useCart, CartItem } from "@/context/CartContext";
import { cn } from "@/lib/utils";

const CartSideOver = () => {
    const { isCartOpen, setIsCartOpen, cart, cartTotal, updateQuantity, removeFromCart } = useCart();

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsCartOpen(false)}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
                    />

                    {/* Cart Panel */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-[101] flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-3 text-organic-green">
                                <ShoppingBag size={24} />
                                <h2 className="text-xl font-bold">Your Shopping Cart</h2>
                            </div>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {cart.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center">
                                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                        <ShoppingBag size={32} className="text-gray-300" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">Cart is empty</h3>
                                    <p className="text-gray-500 mb-8">Looks like you haven't added any fresh fruits yet.</p>
                                    <button
                                        onClick={() => setIsCartOpen(false)}
                                        className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-primary-dark transition-colors"
                                    >
                                        Start Shopping
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {cart.map((item) => (
                                        <div key={`${item.id}-${item.variant}`} className="flex gap-4 group">
                                            <div className="relative w-24 h-24 bg-gray-50 rounded-2xl overflow-hidden shrink-0">
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 flex flex-col pt-1">
                                                <div className="flex justify-between mb-1">
                                                    <h4 className="font-bold text-organic-green line-clamp-1">{item.name}</h4>
                                                    <span className="font-bold text-organic-green">৳{item.price * item.quantity}</span>
                                                </div>
                                                {item.variant && (
                                                    <span className="text-xs text-gray-500 mb-2">Variant: {item.variant}</span>
                                                )}
                                                <div className="flex items-center justify-between mt-auto">
                                                    <div className="flex items-center gap-1 bg-gray-100 rounded-full p-1">
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.variant, -1)}
                                                            className="w-7 h-7 flex items-center justify-center hover:bg-white rounded-full transition-shadow"
                                                        >
                                                            <Minus size={14} />
                                                        </button>
                                                        <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.variant, 1)}
                                                            className="w-7 h-7 flex items-center justify-center hover:bg-white rounded-full transition-shadow"
                                                        >
                                                            <Plus size={14} />
                                                        </button>
                                                    </div>
                                                    <button
                                                        onClick={() => removeFromCart(item.id, item.variant)}
                                                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {cart.length > 0 && (
                            <div className="p-6 border-t border-gray-100 bg-gray-50/50">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-gray-500">Subtotal</span>
                                    <span className="text-lg font-bold text-organic-green">৳{cartTotal}</span>
                                </div>
                                <div className="flex items-center justify-between mb-6">
                                    <span className="text-gray-500">Shipping</span>
                                    <span className="text-sm font-medium text-emerald-600">Calculated at checkout</span>
                                </div>
                                <Link href="/checkout" onClick={() => setIsCartOpen(false)} className="w-full bg-primary text-white py-4 rounded-full font-bold text-lg hover:bg-primary-dark transition-all flex items-center justify-center gap-2 group shadow-xl shadow-primary/20">
                                    Checkout Now <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <div className="mt-4 flex items-center justify-center gap-4 grayscale opacity-50">
                                    <img src="https://premiumfruitbd.com/wp-content/uploads/2022/10/bkash-logo-01.png" alt="bkash" className="h-4" />
                                    <img src="https://premiumfruitbd.com/wp-content/uploads/2022/10/nagad-logo.png" alt="nagad" className="h-4" />
                                </div>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CartSideOver;
