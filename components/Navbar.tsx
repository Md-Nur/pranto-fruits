"use client"
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ShoppingCart, User, Menu, X, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const { cartCount, setIsCartOpen } = useCart();
    const router = useRouter();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/shop?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <nav
            className={cn(
                "sticky top-0 z-50 transition-all duration-300",
                isScrolled ? "glassmorphism py-2 shadow-sm" : "bg-transparent py-4"
            )}
        >
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-xl">P</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-lg leading-none text-organic-green">Pranto Fruits</span>
                            <span className="text-[10px] text-primary-dark font-medium tracking-widest uppercase">Ltd. Since 2012</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-8">
                        <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">Home</Link>
                        <Link href="/shop" className="text-sm font-medium hover:text-primary transition-colors">Shop</Link>
                        <Link href="/gifts" className="text-sm font-medium hover:text-primary transition-colors">Gifting</Link>
                        <Link href="/wisdom" className="text-sm font-medium hover:text-primary transition-colors">Wisdom</Link>
                        <Link href="/track" className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1">
                            <MapPin size={14} /> Track Order
                        </Link>
                    </div>

                    {/* Search Bar - Desktop */}
                    <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
                        <form onSubmit={handleSearch} className="relative w-full">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search fruits, dates, jaggery..."
                                className="w-full bg-white/50 border border-gray-200 rounded-full py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                            />
                            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary">
                                <Search size={18} />
                            </button>
                        </form>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        <button className="p-2 text-gray-600 hover:text-primary transition-colors md:hidden">
                            <Search size={22} />
                        </button>
                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="relative p-2 text-gray-600 hover:text-primary transition-colors"
                        >
                            <ShoppingCart size={22} />
                            {cartCount > 0 && (
                                <span className="absolute top-0 right-0 w-4 h-4 bg-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </button>
                        <Link href="/login" className="hidden sm:flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-primary-dark transition-colors">
                            <User size={18} />
                            <span>Login</span>
                        </Link>
                        <button
                            className="lg:hidden p-2 text-gray-600"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-xl p-4 animate-in slide-in-from-top duration-300">
                    <div className="flex flex-col gap-4">
                        <Link href="/" className="text-lg font-medium py-2 border-b border-gray-50">Home</Link>
                        <Link href="/shop" className="text-lg font-medium py-2 border-b border-gray-50">Shop</Link>
                        <Link href="/gifts" className="text-lg font-medium py-2 border-b border-gray-50">Gifting</Link>
                        <Link href="/wisdom" className="text-lg font-medium py-2 border-b border-gray-50">Wisdom</Link>
                        <Link href="/track" className="text-lg font-medium py-2 border-b border-gray-50">Track Order</Link>
                        <Link href="/login" className="bg-primary text-white p-3 rounded-xl text-center font-bold">Login / Account</Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
