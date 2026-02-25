import React from "react";
import { ShieldCheck, Package, Leaf, Award } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
    {
        title: "Safe Garden",
        description: "Completely chemical and formalin-free fruits harvested with natural methods.",
        icon: <ShieldCheck size={40} />,
        className: "md:col-span-2 md:row-span-2 bg-emerald-50 text-emerald-900",
        illustration: "https://images.unsplash.com/photo-1592150621344-78439b734823?q=80&w=1778&auto=format&fit=crop"
    },
    {
        title: "Premium Packaging",
        description: "Specialized export-quality boxes to ensure zero damage during transit.",
        icon: <Package size={30} />,
        className: "bg-orange-50 text-orange-900",
    },
    {
        title: "Garden Fresh",
        description: "Delivered within 24-48 hours of harvest for maximum nutrition.",
        icon: <Leaf size={30} />,
        className: "bg-lime-50 text-lime-900",
    },
    {
        title: "Quality Assured",
        description: "Multi-step sorting process to ensure only the best reaches you.",
        icon: <Award size={30} />,
        className: "md:col-span-2 bg-stone-50 text-stone-900 py-12",
    }
];

const BentoGrid = () => {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-organic-green mb-4">Why Pranto Fruits?</h2>
                    <p className="text-gray-600">We bridge the gap between rural orchards and your dining table with transparency and excellence.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-auto md:grid-rows-3 gap-6 auto-rows-[200px]">
                    {items.map((item, index) => (
                        <div
                            key={index}
                            className={cn(
                                "rounded-3xl p-8 flex flex-col justify-between transition-all hover:shadow-xl hover:-translate-y-1 overflow-hidden relative group",
                                item.className
                            )}
                        >
                            <div className="z-10">
                                <div className="mb-4 inline-block">{item.icon}</div>
                                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                                <p className="text-sm opacity-80 max-w-xs">{item.description}</p>
                            </div>

                            {item.illustration && (
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-20 group-hover:opacity-10 transition-opacity">
                                    <img src={item.illustration} alt="" className="w-full h-full object-cover" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BentoGrid;
