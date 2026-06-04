"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

import { fbEvents } from "@/components/FacebookPixel";

export interface CartItem {
    id: number;
    name: string;
    price: number;
    image: string;
    quantity: number;
    variant?: string;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (item: CartItem, openCart?: boolean) => void;
    removeFromCart: (id: number, variant?: string) => void;
    updateQuantity: (id: number, variant: string | undefined, delta: number) => void;
    clearCart: () => void;
    isCartOpen: boolean;
    setIsCartOpen: (isOpen: boolean) => void;
    cartTotal: number;
    cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    // Initialize from localStorage
    useEffect(() => {
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
            try {
                setCart(JSON.parse(savedCart));
            } catch (e) {
                console.error("Failed to parse cart from localStorage", e);
            }
        }
        setIsInitialized(true);
    }, []);

    // Save to localStorage whenever cart changes
    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem("cart", JSON.stringify(cart));
        }
    }, [cart, isInitialized]);

    const addToCart = (newItem: CartItem, openCart: boolean = true) => {
        setCart((prevCart) => {
            const existingItemIndex = prevCart.findIndex(
                (item) => item.id === newItem.id && item.variant === newItem.variant
            );

            if (existingItemIndex > -1) {
                const updatedCart = [...prevCart];
                updatedCart[existingItemIndex].quantity += newItem.quantity;
                return updatedCart;
            }

            return [...prevCart, newItem];
        });

        // Trigger Facebook Pixel AddToCart Event
        try {
            fbEvents.addToCart({
                content_name: newItem.name,
                content_ids: [String(newItem.id)],
                value: newItem.price * newItem.quantity,
                currency: "BDT"
            });
        } catch (error) {
            console.error("Failed to trigger AddToCart event:", error);
        }

        if (openCart) {
            setIsCartOpen(true);
        }
    };

    const removeFromCart = (id: number, variant?: string) => {
        setCart((prevCart) => prevCart.filter((item) => !(item.id === id && item.variant === variant)));
    };

    const updateQuantity = (id: number, variant: string | undefined, delta: number) => {
        setCart((prevCart) =>
            prevCart.map((item) => {
                if (item.id === id && item.variant === variant) {
                    const newQuantity = Math.max(1, item.quantity + delta);
                    return { ...item, quantity: newQuantity };
                }
                return item;
            })
        );
    };

    const clearCart = () => {
        setCart([]);
        localStorage.removeItem("cart");
    };

    const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                isCartOpen,
                setIsCartOpen,
                cartTotal,
                cartCount,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};
