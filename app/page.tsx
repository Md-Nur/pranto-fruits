import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star, ShieldCheck, Truck, Leaf, Play, MapPin } from "lucide-react";
import ProductGrid from "@/components/ProductGrid";
import CategoryBar from "@/components/CategoryBar";
import CustomerReviews from "@/components/CustomerReviews";
import prisma from "@/lib/prisma";

export default async function Home() {
    const products = await prisma.product.findMany({
        include: { 
            variants: true,
            categoryRef: true
        },
        take: 8,
    });

    return (
        <div className="flex flex-col gap-0 overflow-hidden">
            {/* New Premium Hero Section */}
            <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/premium_garden_hero_bg_1778617597667.png"
                        alt="Fruit Orchard"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-black/40" />
                </div>

                {/* Hero Content */}
                <div className="w-full px-4 md:px-12 lg:px-20 relative z-10 text-center">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                            Village Organic Fruits Ltd.
                        </h1>
                        <p className="text-xl md:text-2xl text-white/90 mb-10 leading-relaxed font-medium">
                            A fruit-only agri initiative delivering safer fruits directly from gardens to your doorstep.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href="/gardens"
                                className="w-full sm:w-auto px-10 py-4 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-all shadow-xl text-lg flex items-center justify-center gap-2"
                            >
                                Our Contracted Gardens
                            </Link>
                            <Link
                                href="/shop"
                                className="w-full sm:w-auto px-10 py-4 bg-white/20 backdrop-blur-md text-white border border-white/40 font-bold rounded-lg hover:bg-white hover:text-primary transition-all text-lg flex items-center justify-center gap-2"
                            >
                                <Play size={20} className="fill-current" />
                                Try our fruits
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Bottom decorative wave or fade */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent z-[1]" />
            </section>

            {/* Overlapping Category Bar */}
            <CategoryBar />

            {/* Featured Products */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="flex flex-col items-center mb-16 text-center">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="h-1 w-8 bg-primary rounded-full"></div>
                            <span className="text-primary font-bold uppercase tracking-widest text-sm">Best Sellers</span>
                            <div className="h-1 w-8 bg-primary rounded-full"></div>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">ALL PRODUCTS</h2>
                        <div className="w-24 h-1.5 bg-gray-100 rounded-full relative overflow-hidden">
                            <div className="absolute inset-0 bg-primary w-1/2 animate-pulse"></div>
                        </div>
                    </div>

                    <ProductGrid products={products} />

                    <div className="mt-16 text-center">
                        <Link
                            href="/shop"
                            className="inline-flex items-center gap-3 px-12 py-4 bg-gray-900 text-white font-bold rounded-full hover:bg-primary transition-all shadow-xl group text-lg"
                        >
                            Shop Now
                            <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Customer Reviews Section */}
            <CustomerReviews />

            {/* Trust Indicators Section (New) */}
            <section className="py-20 bg-surface border-y border-gray-100">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-20 h-20 bg-white rounded-2xl shadow-md flex items-center justify-center mb-6 text-primary group hover:bg-primary hover:text-white transition-all duration-300">
                                <ShieldCheck size={36} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Safe Garden</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                Experience how we collect fresh fruits directly from our registered gardens.
                            </p>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <div className="w-20 h-20 bg-white rounded-2xl shadow-md flex items-center justify-center mb-6 text-primary group hover:bg-primary hover:text-white transition-all duration-300">
                                <Leaf size={36} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Premium Quality</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                We ensure every fruit is packed with care to maintain its premium quality.
                            </p>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <div className="w-20 h-20 bg-white rounded-2xl shadow-md flex items-center justify-center mb-6 text-primary group hover:bg-primary hover:text-white transition-all duration-300">
                                <Truck size={36} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Garden to Door</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                Fast and reliable delivery service ensuring freshness right to your doorstep.
                            </p>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <div className="w-20 h-20 bg-white rounded-2xl shadow-md flex items-center justify-center mb-6 text-primary group hover:bg-primary hover:text-white transition-all duration-300">
                                <Star size={36} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">50K+ Customers</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                Trusted by thousands of happy families across Bangladesh.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
