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
    const [user, setUser] = useState<any>(null);
    const { cartCount, setIsCartOpen } = useCart();
    const router = useRouter();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);

        const checkAuth = async () => {
            try {
                const res = await fetch("/api/auth/check");
                const data = await res.json();
                if (data.authenticated) {
                    setUser(data.user);
                }
            } catch (err) {
                console.error("Auth check failed", err);
            }
        };
        checkAuth();

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLogout = async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
            setUser(null);
            router.push("/");
            router.refresh();
        } catch (err) {
            console.error("Logout failed", err);
        }
    };

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
                    <div className="flex items-center gap-2 md:gap-5">
                        <button className="p-2 text-gray-600 hover:text-primary transition-colors md:hidden">
                            <Search size={22} />
                        </button>

                        {/* User Profile */}
                        {user ? (
                            <div className="hidden md:flex items-center gap-3 bg-gray-50 rounded-full pl-2 pr-4 py-1.5 border border-gray-100">
                                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                                    {(user.name || user.phone || "U").charAt(0)}
                                </div>
                                <span className="text-sm font-medium text-gray-700">{user.name ? user.name.split(" ")[0] : user.phone}</span>
                                <button
                                    onClick={handleLogout}
                                    className="text-xs text-gray-400 hover:text-red-500 transition-colors ml-2"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="p-2.5 rounded-full text-gray-600 hover:bg-gray-100 hover:text-primary transition-all duration-300"
                            >
                                <User size={22} />
                            </Link>
                        )}

                        {/* Cart Trigger */}
                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="p-2.5 rounded-full text-gray-600 hover:bg-gray-100 hover:text-primary transition-all duration-300 relative group"
                        >
                            <ShoppingCart size={22} />
                            {cartCount > 0 && (
                                <span className="absolute top-1.5 right-1.5 bg-primary text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-white group-hover:scale-110 transition-transform">
                                    {cartCount}
                                </span>
                            )}
                        </button>
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
