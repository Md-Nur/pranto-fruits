"use client"
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, ShoppingCart, User, Menu, X, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";

const Navbar = () => {
    const router = useRouter();
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [user, setUser] = useState<any>(null);
    const { cartCount, setIsCartOpen } = useCart();
    const pathname = usePathname();
    const isHome = pathname === "/";

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch("/api/auth/check");
                const data = await res.json();
                if (data.authenticated) {
                    setUser(data.user);
                } else {
                    setUser(null);
                }
            } catch (err) {
                console.error("Auth check failed", err);
                setUser(null);
            }
        };
        checkAuth();
    }, [pathname]);

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

    // Determine colors based on scroll and page type
    const showTransparent = isHome && !isScrolled;
    const textColor = showTransparent ? "text-white" : "text-gray-700";
    const brandColor = showTransparent ? "text-white" : "text-primary";
    const actionColor = showTransparent ? "text-white" : "text-gray-600";

    return (
        <nav
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
                !showTransparent 
                    ? "bg-white/95 backdrop-blur-md py-3 shadow-md border-b border-gray-100" 
                    : "bg-transparent py-5"
            )}
        >
            <div className="w-full px-3 md:px-12 lg:px-20">
                <div className="flex items-center justify-between gap-2">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 sm:gap-3 group shrink min-w-0">
                        <div className="relative w-9 h-9 sm:w-12 sm:h-12 shrink-0 transition-transform duration-300 group-hover:scale-105">
                            <Image
                                src="/logo.png"
                                alt="Village Organic Fruits"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                        <div className="flex flex-col min-w-0 shrink">
                            <span className={cn(
                                "font-bold text-sm sm:text-xl leading-tight sm:leading-none transition-colors duration-300 truncate",
                                brandColor
                            )}>Village Organic Fruits</span>
                            <span className={cn(
                                "text-[9px] sm:text-[10px] font-bold tracking-widest sm:tracking-[0.2em] uppercase transition-colors duration-300 truncate hidden sm:block",
                                showTransparent ? "text-white/70" : "text-primary/60"
                            )}>Pure & Healthy</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className={cn(
                        "hidden lg:flex items-center gap-10 transition-colors duration-300",
                        textColor
                    )}>
                        <Link href="/" className="text-sm font-bold hover:text-accent transition-colors">Home</Link>
                        <Link href="/shop" className="text-sm font-bold hover:text-accent transition-colors">Shop</Link>
                        <Link href="/gifts" className="text-sm font-bold hover:text-accent transition-colors">Gifts</Link>
                        <Link href="/wisdom" className="text-sm font-bold hover:text-accent transition-colors">Wisdom</Link>
                        <Link href="/about" className="text-sm font-bold hover:text-accent transition-colors">About</Link>
                        <Link href="/farmers" className="text-sm font-bold hover:text-accent transition-colors">Farmers</Link>
                        <Link href="/contact" className="text-sm font-bold hover:text-accent transition-colors">Contact</Link>
                        <Link href="/track" className="text-sm font-bold hover:text-accent transition-colors flex items-center gap-1.5">
                            <MapPin size={16} /> Track Order
                        </Link>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 sm:gap-3 md:gap-6 shrink-0">
                        <button
                            className={cn(
                                "p-2 transition-colors md:hidden",
                                actionColor
                            )}
                            onClick={() => { setMobileSearchOpen(!mobileSearchOpen); setMobileMenuOpen(false); }}
                            aria-label="Toggle search"
                        >
                            {mobileSearchOpen ? <X size={24} /> : <Search size={24} />}
                        </button>

                        {/* User Profile / Login */}
                        {user ? (
                            <div className="flex items-center gap-2 md:gap-4">
                                {user.role === "ADMIN" && (
                                    <Link
                                        href="/admin"
                                        className={cn(
                                            "hidden sm:flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all border",
                                            showTransparent
                                                ? "bg-white/10 border-white/20 text-white hover:bg-white hover:text-primary"
                                                : "bg-primary/10 border-primary/20 text-primary hover:bg-primary hover:text-white"
                                        )}
                                    >
                                        <User size={14} /> Dashboard
                                    </Link>
                                )}
                                <div className={cn(
                                    "hidden md:flex items-center gap-3 rounded-full pl-2 pr-4 py-1.5 border transition-all duration-300",
                                    showTransparent
                                        ? "bg-white/10 border-white/20 text-white"
                                        : "bg-gray-50 border-gray-100 text-gray-700"
                                )}>
                                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                                        {(user.name || user.phone || "U").charAt(0)}
                                    </div>
                                    <span className="text-sm font-bold">{user.name ? user.name.split(" ")[0] : user.phone}</span>
                                    <button
                                        onClick={handleLogout}
                                        className="text-xs opacity-50 hover:opacity-100 transition-opacity ml-2"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className={cn(
                                    "hidden md:flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 border",
                                    !showTransparent
                                        ? "bg-primary text-white border-primary hover:bg-primary-dark shadow-md"
                                        : "bg-white/10 text-white border-white/30 hover:bg-white hover:text-primary"
                                )}
                            >
                                <User size={18} />
                                Login
                            </Link>
                        )}

                        {/* Cart Trigger */}
                        <button
                            onClick={() => setIsCartOpen(true)}
                            className={cn(
                                "p-2.5 rounded-full transition-all duration-300 relative group",
                                !showTransparent 
                                    ? "text-gray-600 hover:bg-gray-100" 
                                    : "text-white hover:bg-white/10"
                            )}
                        >
                            <ShoppingCart size={24} />
                            {cartCount > 0 && (
                                <span className="absolute top-1.5 right-1.5 bg-accent text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white group-hover:scale-110 transition-transform">
                                    {cartCount}
                                </span>
                            )}
                        </button>

                        <button
                            className={cn(
                                "lg:hidden p-2 transition-colors",
                                actionColor
                            )}
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Search Bar */}
            {mobileSearchOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-lg px-4 py-3 animate-in slide-in-from-top duration-200">
                    <form onSubmit={(e) => { handleSearch(e); setMobileSearchOpen(false); }} className="relative w-full">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search fruits, dates, jaggery..."
                            autoFocus
                            className="w-full bg-gray-50 border border-gray-200 rounded-full py-2.5 pl-5 pr-12 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                        />
                        <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 bg-primary text-white rounded-full p-1.5 hover:bg-primary/90 transition-colors">
                            <Search size={16} />
                        </button>
                    </form>
                </div>
            )}

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-xl p-4 animate-in slide-in-from-top duration-300">
                    <div className="flex flex-col gap-4">
                        {/* Search in mobile menu */}
                        <form onSubmit={(e) => { handleSearch(e); setMobileMenuOpen(false); }} className="relative w-full">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search fruits, dates, jaggery..."
                                className="w-full bg-gray-50 border border-gray-200 rounded-full py-2.5 pl-5 pr-12 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                            />
                            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 bg-primary text-white rounded-full p-1.5 hover:bg-primary/90 transition-colors">
                                <Search size={16} />
                            </button>
                        </form>
                        <Link href="/" className="text-lg font-medium py-2 border-b border-gray-50" onClick={() => setMobileMenuOpen(false)}>Home</Link>
                        <Link href="/shop" className="text-lg font-medium py-2 border-b border-gray-50" onClick={() => setMobileMenuOpen(false)}>Shop</Link>
                        <Link href="/gifts" className="text-lg font-medium py-2 border-b border-gray-50" onClick={() => setMobileMenuOpen(false)}>Gifts</Link>
                        <Link href="/wisdom" className="text-lg font-medium py-2 border-b border-gray-50" onClick={() => setMobileMenuOpen(false)}>Wisdom</Link>
                        <Link href="/about" className="text-lg font-medium py-2 border-b border-gray-50" onClick={() => setMobileMenuOpen(false)}>About</Link>
                        <Link href="/farmers" className="text-lg font-medium py-2 border-b border-gray-50" onClick={() => setMobileMenuOpen(false)}>Farmers</Link>
                        <Link href="/contact" className="text-lg font-medium py-2 border-b border-gray-50" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
                        <Link href="/track" className="text-lg font-medium py-2 border-b border-gray-50" onClick={() => setMobileMenuOpen(false)}>Track Order</Link>
                        {user?.role === "ADMIN" && (
                            <Link href="/admin" className="bg-emerald-500 text-white p-3 rounded-xl text-center font-bold" onClick={() => setMobileMenuOpen(false)}>Admin Dashboard</Link>
                        )}
                        <Link href="/login" className="bg-primary text-white p-3 rounded-xl text-center font-bold" onClick={() => setMobileMenuOpen(false)}>{user ? "My Account" : "Login / Account"}</Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
