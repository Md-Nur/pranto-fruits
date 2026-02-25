"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

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
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: number, variant?: string) => void;
    updateQuantity: (id: number, variant: string | undefined, delta: number) => void;
    isCartOpen: boolean;
    setIsCartOpen: (isOpen: boolean) => void;
    cartTotal: number;
    cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const addToCart = (newItem: CartItem) => {
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
        setIsCartOpen(true);
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

    const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                updateQuantity,
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
