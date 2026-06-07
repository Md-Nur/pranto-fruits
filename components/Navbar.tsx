"use client"
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, ShoppingCart, User, Menu, X, MapPin, Phone, Mail, Facebook, Youtube, ChevronDown, LogOut, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { WhatsAppIcon } from "./WhatsAppIcon";

const Navbar = () => {
    const router = useRouter();
    const pathname = usePathname();
    const { cartCount, cartTotal, setIsCartOpen } = useCart();

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);

    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Fetch user authentication status
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch("/api/auth/check");
                if (!res.ok) {
                    setUser(null);
                    return;
                }
                
                const contentType = res.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    const data = await res.json();
                    if (data.authenticated) {
                        setUser(data.user);
                    } else {
                        setUser(null);
                    }
                } else {
                    setUser(null);
                }
            } catch (err) {
                console.error("Auth check failed:", err);
                setUser(null);
            }
        };
        checkAuth();
    }, [pathname]);

    // Live search debounced query
    useEffect(() => {
        if (searchQuery.trim().length < 2) {
            setSearchResults([]);
            setShowDropdown(false);
            return;
        }

        const delayDebounce = setTimeout(async () => {
            setSearchLoading(true);
            try {
                const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
                if (res.ok) {
                    const data = await res.json();
                    setSearchResults(Array.isArray(data) ? data : []);
                    setShowDropdown(true);
                }
            } catch (err) {
                console.error("Live search failed:", err);
            } finally {
                setSearchLoading(false);
            }
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [searchQuery]);

    // Close dropdowns on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
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

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/shop?q=${encodeURIComponent(searchQuery)}`);
            setShowDropdown(false);
            setMobileSearchOpen(false);
        }
    };

    const handleProductClick = (productId: number) => {
        router.push(`/product/${productId}`);
        setShowDropdown(false);
        setSearchQuery("");
        setMobileSearchOpen(false);
    };

    return (
        <header className="sticky top-0 z-50 bg-white w-full border-b border-gray-100 shadow-sm flex flex-col">
            {/* Top Bar (Contact, Delivery Banner & Socials) */}
            <div className="bg-primary text-white py-2 text-xs font-medium w-full">
                <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
                    {/* Contact Details */}
                    <div className="flex items-center gap-6">
                        <a href="tel:01878716088" className="flex items-center gap-1.5 hover:text-accent transition-colors">
                            <Phone size={13} className="fill-current text-white/80" />
                            <span>01878716088</span>
                        </a>
                        <a href="mailto:hello@villageorganicfruits.com" className="hidden sm:flex items-center gap-1.5 hover:text-accent transition-colors">
                            <Mail size={13} className="text-white/80" />
                            <span>hello@villageorganicfruits.com</span>
                        </a>
                    </div>
                    {/* Promotion / Delivery Banner */}
                    <div className="hidden md:block animate-pulse font-semibold">
                        🎉 Free Delivery on Orders Above ৳1000
                    </div>
                    {/* Social Media Links */}
                    <div className="flex items-center gap-4">
                        <a href="https://facebook.com/villageorganicfruits" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors" title="Facebook">
                            <Facebook size={14} className="fill-current" />
                        </a>
                        <a href="https://youtube.com/@villageorganicfruits" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors" title="YouTube">
                            <Youtube size={14} className="fill-current" />
                        </a>
                        <a href="https://wa.me/8801878716088" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors" title="WhatsApp">
                            <WhatsAppIcon size={14} className="fill-current text-white" />
                        </a>
                    </div>
                </div>
            </div>

            {/* Main Header (Logo, Live Search, User, Cart) */}
            <div className="max-w-7xl mx-auto w-full px-4 md:px-8 py-3.5 flex items-center justify-between gap-4 relative">
                {/* Logo and Brand Name */}
                <Link href="/" className="flex items-center gap-3 group shrink-0 select-none">
                    <div className="relative w-10 h-10 md:w-12 md:h-12 shrink-0 transition-transform duration-300 group-hover:scale-105">
                        <Image
                            src="/logo.png"
                            alt="Village Organic Fruits"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-sm md:text-lg lg:text-xl text-primary leading-tight font-hind-siliguri">
                            Village Organic Fruits
                        </span>
                        <span className="text-[9px] font-extrabold tracking-[0.15em] text-accent uppercase leading-none mt-0.5">
                            Pure & Healthy
                        </span>
                    </div>
                </Link>

                {/* Desktop Search Bar with Live Dropdown */}
                <div ref={dropdownRef} className="hidden md:flex flex-1 max-w-xl mx-6 relative">
                    <form onSubmit={handleSearchSubmit} className="relative w-full">
                        <input
                            ref={searchInputRef}
                            type="text"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setShowDropdown(true);
                            }}
                            onFocus={() => setShowDropdown(true)}
                            placeholder="Search fruits, dates, honey..."
                            className="w-full bg-gray-50 border border-gray-200 rounded-full py-2.5 pl-6 pr-12 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm text-gray-800"
                        />
                        <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-white rounded-full p-2 hover:bg-primary-dark transition-colors">
                            {searchLoading ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : (
                                <Search size={16} />
                            )}
                        </button>
                    </form>

                    {/* Search Live Dropdown */}
                    {showDropdown && searchQuery.trim().length >= 2 && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 max-h-96 overflow-y-auto overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                            {searchLoading ? (
                                <div className="p-8 text-center text-gray-400 flex flex-col items-center gap-2">
                                    <Loader2 className="animate-spin text-primary" size={24} />
                                    <span className="text-sm font-medium">Searching products...</span>
                                </div>
                            ) : searchResults.length > 0 ? (
                                <div className="py-2 divide-y divide-gray-50">
                                    <div className="text-[10px] font-bold text-gray-400 px-4 py-1.5 uppercase tracking-wider bg-gray-50/50">
                                        Matches ({searchResults.length})
                                    </div>
                                    {searchResults.map((product) => (
                                        <div
                                            key={product.id}
                                            onClick={() => handleProductClick(product.id)}
                                            className="flex items-center gap-3 p-3 hover:bg-gray-50/80 cursor-pointer transition-colors group"
                                        >
                                            <div className="relative w-12 h-12 rounded-lg bg-surface border border-gray-100 overflow-hidden flex-shrink-0">
                                                <Image
                                                    src={product.image}
                                                    alt={product.name}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-gray-900 text-sm group-hover:text-primary transition-colors truncate">
                                                    {product.name}
                                                </h4>
                                                <p className="text-xs text-gray-400 mt-0.5 capitalize">
                                                    {product.categoryRef?.name || product.category}
                                                </p>
                                            </div>
                                            <div className="text-right flex-shrink-0 pr-1">
                                                <div className="font-bold text-primary text-sm">৳{product.priceRange}</div>
                                                <div className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">View</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-8 text-center text-gray-400">
                                    <p className="text-sm font-semibold text-gray-600">No fruits found</p>
                                    <p className="text-xs text-gray-400 mt-1">Try another search term like "Mango" or "Dates"</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Right Side Buttons (Account & Cart) */}
                <div className="flex items-center gap-1.5 md:gap-3 shrink-0">
                    {/* Search Icon for Mobile */}
                    <button
                        onClick={() => {
                            setMobileSearchOpen(!mobileSearchOpen);
                            setMobileMenuOpen(false);
                        }}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-full md:hidden transition-colors"
                        aria-label="Search"
                    >
                        {mobileSearchOpen ? <X size={20} /> : <Search size={20} />}
                    </button>

                    {/* Account Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                            className="flex items-center gap-1 p-2 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg transition-all"
                        >
                            <User size={20} className="text-primary" />
                            <span className="hidden sm:block text-xs font-bold font-hind-siliguri">
                                {user ? (user.name ? user.name.split(" ")[0] : "Account") : "Account"}
                            </span>
                            <ChevronDown size={14} className="text-gray-400" />
                        </button>

                        {/* Account Menu */}
                        {accountDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg z-50 py-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                                {user ? (
                                    <>
                                        <div className="px-4 py-2 border-b border-gray-50">
                                            <p className="text-xs text-gray-400 font-medium">Logged in as</p>
                                            <p className="text-sm font-bold text-gray-800 truncate">{user.name || user.phone}</p>
                                        </div>
                                        {user.role === "ADMIN" && (
                                            <Link
                                                href="/admin"
                                                onClick={() => setAccountDropdownOpen(false)}
                                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-primary/5 hover:text-primary transition-colors font-semibold"
                                            >
                                                Dashboard
                                            </Link>
                                        )}
                                        <button
                                            onClick={() => {
                                                handleLogout();
                                                setAccountDropdownOpen(false);
                                            }}
                                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left font-semibold"
                                        >
                                            <LogOut size={14} /> Logout
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            href="/login"
                                            onClick={() => setAccountDropdownOpen(false)}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5 hover:text-primary transition-colors font-semibold"
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            href="/register"
                                            onClick={() => setAccountDropdownOpen(false)}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5 hover:text-primary transition-colors font-semibold"
                                        >
                                            Register
                                        </Link>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Cart Trigger Button */}
                    <button
                        onClick={() => setIsCartOpen(true)}
                        className="flex items-center gap-2 p-2 border border-primary/10 rounded-full md:rounded-lg hover:bg-primary/5 hover:border-primary/25 transition-all text-gray-700 relative"
                    >
                        <div className="relative">
                            <ShoppingCart size={20} className="text-primary" />
                            {cartCount > 0 && (
                                <span className="absolute -top-3.5 -right-3 bg-accent text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm animate-pulse">
                                    {cartCount}
                                </span>
                            )}
                        </div>
                        <div className="hidden md:flex flex-col items-start leading-none text-left shrink-0">
                            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">My Cart</span>
                            <span className="text-xs font-extrabold text-primary mt-0.5">৳{cartTotal.toFixed(0)}</span>
                        </div>
                    </button>

                    {/* Mobile Menu Icon */}
                    <button
                        onClick={() => {
                            setMobileMenuOpen(!mobileMenuOpen);
                            setMobileSearchOpen(false);
                        }}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-full lg:hidden transition-colors"
                        aria-label="Menu"
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Live Search Bar */}
            {mobileSearchOpen && (
                <div className="md:hidden w-full bg-white border-t border-gray-100 shadow-md px-4 py-3 relative animate-in slide-in-from-top-1 duration-200">
                    <form onSubmit={handleSearchSubmit} className="relative w-full">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search fruits, dates, honey..."
                            autoFocus
                            className="w-full bg-gray-50 border border-gray-200 rounded-full py-2.5 pl-5 pr-12 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                        />
                        <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-white rounded-full p-2">
                            {searchLoading ? <Loader2 size={15} className="animate-spin" /> : <Search size={15} />}
                        </button>
                    </form>

                    {/* Mobile Live Dropdown */}
                    {searchQuery.trim().length >= 2 && (
                        <div className="absolute top-full left-0 right-0 mx-4 mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 max-h-80 overflow-y-auto divide-y divide-gray-50">
                            {searchLoading ? (
                                <div className="p-6 text-center text-gray-400 text-xs">Loading fruits...</div>
                            ) : searchResults.length > 0 ? (
                                searchResults.map((product) => (
                                    <div
                                        key={product.id}
                                        onClick={() => handleProductClick(product.id)}
                                        className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer"
                                    >
                                        <div className="relative w-10 h-10 rounded bg-surface border overflow-hidden flex-shrink-0">
                                            <Image src={product.image} alt={product.name} fill className="object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-gray-900 text-xs truncate">{product.name}</h4>
                                            <p className="text-[10px] text-gray-400 capitalize">{product.category}</p>
                                        </div>
                                        <div className="text-right flex-shrink-0 font-bold text-primary text-xs">
                                            ৳{product.priceRange}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-6 text-center text-gray-400 text-xs">No fruits found</div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Sub-Navbar (Desktop Category & Page links) */}
            <nav className="bg-gray-50/80 border-t border-gray-100 py-2.5 hidden lg:block w-full">
                <div className="max-w-7xl mx-auto px-8 flex items-center justify-center gap-8 text-sm font-bold text-gray-700">
                    <Link href="/" className={cn("hover:text-primary transition-colors", pathname === "/" && "text-primary")}>Home</Link>
                    <Link href="/shop" className={cn("hover:text-primary transition-colors", pathname === "/shop" && "text-primary")}>Shop</Link>
                    <Link href="/gifts" className={cn("hover:text-primary transition-colors", pathname === "/gifts" && "text-primary")}>Gifts</Link>
                    <Link href="/wisdom" className={cn("hover:text-primary transition-colors", pathname === "/wisdom" && "text-primary")}>Wisdom</Link>
                    <Link href="/about" className={cn("hover:text-primary transition-colors", pathname === "/about" && "text-primary")}>About</Link>
                    <Link href="/farmers" className={cn("hover:text-primary transition-colors", pathname === "/farmers" && "text-primary")}>Farmers</Link>
                    <Link href="/contact" className={cn("hover:text-primary transition-colors", pathname === "/contact" && "text-primary")}>Contact</Link>
                    <Link href="/track" className={cn("hover:text-primary transition-colors flex items-center gap-1.5", pathname === "/track" && "text-primary")}>
                        <MapPin size={15} /> Track Order
                    </Link>
                </div>
            </nav>

            {/* Mobile Full Navigation Menu */}
            {mobileMenuOpen && (
                <div className="lg:hidden w-full bg-white border-t border-gray-100 shadow-xl p-5 flex flex-col gap-4 animate-in slide-in-from-top-1 duration-300">
                    <Link href="/" className="text-base font-bold py-2 border-b border-gray-50 text-gray-800" onClick={() => setMobileMenuOpen(false)}>Home</Link>
                    <Link href="/shop" className="text-base font-bold py-2 border-b border-gray-50 text-gray-800" onClick={() => setMobileMenuOpen(false)}>Shop</Link>
                    <Link href="/gifts" className="text-base font-bold py-2 border-b border-gray-50 text-gray-800" onClick={() => setMobileMenuOpen(false)}>Gifts</Link>
                    <Link href="/wisdom" className="text-base font-bold py-2 border-b border-gray-50 text-gray-800" onClick={() => setMobileMenuOpen(false)}>Wisdom</Link>
                    <Link href="/about" className="text-base font-bold py-2 border-b border-gray-50 text-gray-800" onClick={() => setMobileMenuOpen(false)}>About</Link>
                    <Link href="/farmers" className="text-base font-bold py-2 border-b border-gray-50 text-gray-800" onClick={() => setMobileMenuOpen(false)}>Farmers</Link>
                    <Link href="/contact" className="text-base font-bold py-2 border-b border-gray-50 text-gray-800" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
                    <Link href="/track" className="text-base font-bold py-2 border-b border-gray-50 text-gray-800 flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                        <MapPin size={16} /> Track Order
                    </Link>
                    {user?.role === "ADMIN" && (
                        <Link href="/admin" className="bg-primary/5 text-primary p-3.5 rounded-xl text-center font-bold text-sm" onClick={() => setMobileMenuOpen(false)}>
                            Admin Dashboard
                        </Link>
                    )}
                    <Link href="/login" className="bg-primary text-white p-3.5 rounded-xl text-center font-bold text-sm" onClick={() => setMobileMenuOpen(false)}>
                        {user ? "My Account" : "Login / Register"}
                    </Link>
                </div>
            )}
        </header>
    );
};

export default Navbar;
