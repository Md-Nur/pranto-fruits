import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star, ShieldCheck, Truck, Leaf, Play, ShoppingCart, Zap, Flame, Sparkles } from "lucide-react";
import ProductGrid from "@/components/ProductGrid";
import CustomerReviews from "@/components/CustomerReviews";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export default async function Home() {
    // Fetch categories and products from the database
    const dbCategories = await prisma.category.findMany({
        orderBy: { name: "asc" }
    });

    const products = await prisma.product.findMany({
        include: { 
            variants: true,
            categoryRef: true
        },
        take: 8,
    });

    // Fallback categories if database is empty
    const defaultCategories = [
        { id: 1, name: "Mango (আম)", slug: "mango", image: "https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=300&auto=format&fit=crop" },
        { id: 2, name: "Dates (খেজুর)", slug: "dates", image: "https://images.unsplash.com/photo-1614061811858-dde54a522f5e?q=80&w=300&auto=format&fit=crop" },
        { id: 3, name: "Gur (গুড়)", slug: "jaggery", image: "https://images.unsplash.com/photo-1671871695722-b91911e9c072?q=80&w=300&auto=format&fit=crop" },
        { id: 4, name: "Honey (মধু)", slug: "honey", image: "https://plus.unsplash.com/premium_photo-1726880614839-faa6caa3b3d4?q=80&w=300&auto=format&fit=crop" },
        { id: 5, name: "Baskets (ঝুড়ি)", slug: "baskets", image: "https://images.unsplash.com/photo-1629905707362-03cf1a9f6e2d?q=80&w=300&auto=format&fit=crop" }
    ];

    const displayCategories = dbCategories.length > 0 
        ? dbCategories.map(cat => ({
            id: cat.id,
            name: cat.name,
            slug: cat.slug,
            image: cat.image || "https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=300&auto=format&fit=crop"
        }))
        : defaultCategories;

    // Filter popular products (either new items or the first 4 items)
    const popularProducts = products.filter(p => p.isNew).length > 0
        ? products.filter(p => p.isNew).slice(0, 4)
        : products.slice(0, 4);

    return (
        <div className="flex flex-col gap-0 overflow-hidden bg-gray-50/50">
            {/* Hero Banner Section */}
            <section className="relative h-[280px] sm:h-[350px] md:h-[480px] lg:h-[520px] w-full flex items-center overflow-hidden">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/premium_garden_hero_bg_1778617597667.png"
                        alt="Fresh Fruit Gardens"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-black/45" />
                </div>

                {/* Hero Banner Content */}
                <div className="max-w-7xl mx-auto w-full px-4 md:px-8 relative z-10 text-white">
                    <div className="max-w-xl md:max-w-2xl flex flex-col items-start">
                        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-accent/90 backdrop-blur-sm text-[10px] md:text-xs font-black uppercase tracking-wider text-gray-950 mb-4 animate-bounce-subtle">
                            <Sparkles size={12} className="fill-current" />
                            100% Organic & Safe Fruit Initiative
                        </span>
                        <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-3 md:mb-5 font-hind-siliguri">
                            Village Organic Fruits
                        </h1>
                        <p className="text-xs sm:text-sm md:text-base lg:text-lg text-white/90 mb-6 md:mb-8 font-medium leading-relaxed max-w-lg md:max-w-xl">
                            Delivering handpicked, chemical-free seasonal fruits straight from our contracted gardens to your home. Pure taste, guaranteed freshness, and safer nutrition.
                        </p>
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <Link
                                href="/shop"
                                className="px-5 sm:px-8 py-3 bg-primary text-white font-extrabold rounded-full hover:bg-primary-dark transition-all shadow-lg text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 group border border-primary/20"
                            >
                                Shop Fresh Fruits
                                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                href="/farmers"
                                className="px-5 sm:px-8 py-3 bg-white/10 backdrop-blur-md text-white border border-white/20 font-extrabold rounded-full hover:bg-white hover:text-primary transition-all text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-1.5"
                            >
                                <Play size={13} className="fill-current text-accent" />
                                Our Gardens
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Shop by Category Section */}
            <section className="py-12 bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl md:text-3.5xl font-black text-gray-900 font-hind-siliguri tracking-tight">
                            Shop by Category
                        </h2>
                        <p className="text-xs md:text-sm text-gray-400 mt-2 font-medium">
                            Explore our curated collections of organic garden harvests
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 max-w-5xl mx-auto">
                        {displayCategories.map((category) => (
                            <Link
                                key={category.id}
                                href={`/shop?category=${category.slug}`}
                                className="flex flex-col items-center gap-3 group text-center select-none"
                            >
                                <div className="relative w-18 h-18 sm:w-22 sm:h-22 md:w-28 md:h-28 rounded-full overflow-hidden border border-gray-100 shadow-md bg-white p-1 group-hover:scale-105 group-hover:shadow-lg transition-all duration-300">
                                    <div className="relative w-full h-full rounded-full overflow-hidden">
                                        <Image
                                            src={category.image}
                                            alt={category.name}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-115"
                                        />
                                    </div>
                                </div>
                                <span className="text-xs md:text-sm font-extrabold text-gray-800 group-hover:text-primary transition-colors font-hind-siliguri tracking-tight">
                                    {category.name}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Popular Now Section */}
            <section className="py-16 bg-gradient-to-b from-gray-50/50 to-white">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="flex flex-col items-center text-center mb-12">
                        <div className="inline-flex items-center gap-1 px-3 py-1 bg-accent/15 rounded-full text-accent font-black text-[10px] md:text-xs uppercase tracking-widest mb-3">
                            <Flame size={12} className="fill-current text-accent" />
                            Popular Now
                        </div>
                        <h2 className="text-2xl md:text-4.5xl font-black text-gray-900 font-hind-siliguri tracking-tight">
                            TRENDING PRODUCTS
                        </h2>
                        <p className="text-xs md:text-sm text-gray-400 mt-2 font-medium">
                            Highly rated seasonal harvests loved by our community
                        </p>
                    </div>

                    {/* Popular products list */}
                    <div className="mb-10">
                        <ProductGrid products={popularProducts} />
                    </div>
                </div>
            </section>

            {/* Featured / All Harvest Section */}
            <section className="py-16 bg-white border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="flex flex-col items-center mb-12 text-center">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="h-1 w-6 bg-primary rounded-full"></div>
                            <span className="text-primary font-black uppercase tracking-wider text-xs">Fresh Harvests</span>
                            <div className="h-1 w-6 bg-primary rounded-full"></div>
                        </div>
                        <h2 className="text-2xl md:text-4.5xl font-black text-gray-900 mb-4 font-hind-siliguri tracking-tight">
                            ALL FRESH PRODUCTS
                        </h2>
                        <div className="w-16 h-1 bg-gray-100 rounded-full relative overflow-hidden">
                            <div className="absolute inset-y-0 left-0 bg-primary w-1/2 rounded-full"></div>
                        </div>
                    </div>

                    <ProductGrid products={products} />

                    <div className="mt-14 text-center">
                        <Link
                            href="/shop"
                            className="inline-flex items-center gap-2.5 px-10 py-3.5 bg-gray-900 text-white font-extrabold rounded-full hover:bg-primary transition-all shadow-lg group text-sm uppercase tracking-wider"
                        >
                            Explore Full Shop
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Customer Reviews Section */}
            <CustomerReviews />

            {/* Trust Indicators Section */}
            <section className="py-16 bg-surface border-y border-gray-100">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-gray-100/80 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                                <ShieldCheck size={26} />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-gray-900 mb-1 font-hind-siliguri">Safe Gardens</h3>
                                <p className="text-gray-400 text-xs leading-relaxed font-medium">
                                    Fruits are sourced exclusively from our verified, chemical-free gardens.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-gray-100/80 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                                <Leaf size={26} />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-gray-900 mb-1 font-hind-siliguri">Premium Quality</h3>
                                <p className="text-gray-400 text-xs leading-relaxed font-medium">
                                    Handpicked sorting ensures only the sweetest, healthiest fruits reach you.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-gray-100/80 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                                <Truck size={26} />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-gray-900 mb-1 font-hind-siliguri">Garden to Door</h3>
                                <p className="text-gray-400 text-xs leading-relaxed font-medium">
                                    Fast logistics chain to preserve nutritional value and natural taste.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-gray-100/80 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                                <Star size={26} />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-gray-900 mb-1 font-hind-siliguri">50K+ Customers</h3>
                                <p className="text-gray-400 text-xs leading-relaxed font-medium">
                                    Trusted by thousands of happy families across the country for safe food.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
