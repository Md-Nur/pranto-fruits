"use client";

import React from "react";
import { UserPlus, FileCheck, CheckCircle2, ChevronRight, Sprout, TrendingUp } from "lucide-react";
import Image from "next/image";

const steps = [
    {
        title: "Registration & Profile",
        description: "Submit your orchard details, location, and fruit types through our digital portal.",
        icon: <UserPlus className="text-white" size={24} />,
        color: "bg-primary"
    },
    {
        title: "Quality Verification",
        description: "Our garden experts will visit for a soil and health assessment of your fruits.",
        icon: <FileCheck className="text-white" size={24} />,
        color: "bg-accent"
    },
    {
        title: "Official Partnership",
        description: "Receive your 'Premium Certified' badge and start reaching thousands of happy customers.",
        icon: <CheckCircle2 className="text-white" size={24} />,
        color: "bg-organic-green"
    }
];

const FarmerOnboarding = () => {
    return (
        <div className="flex flex-col">
            <section className="py-20 bg-emerald-50/50">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="lg:w-1/2">
                            <h1 className="text-4xl md:text-5xl font-bold text-organic-green mb-6 leading-tight">
                                Empowering Farmers, <br /> Protecting Nature.
                            </h1>
                            <p className="text-gray-600 text-lg mb-12">
                                Join our network of 500+ premium farmers and get fair prices for your high-quality, chemical-free harvests. We provide the technology; you provide the fresh fruits.
                            </p>

                            <div className="space-y-12 relative">
                                {/* Vertical Line */}
                                <div className="absolute left-[23px] top-6 bottom-6 w-[2px] bg-gray-200 z-0" />

                                {steps.map((step, index) => (
                                    <div key={index} className="flex gap-6 relative z-10 group">
                                        <div className={`w-12 h-12 rounded-full ${step.color} shrink-0 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                                            {step.icon}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-organic-green mb-2">{step.title}</h3>
                                            <p className="text-gray-500 max-w-md">{step.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button className="mt-12 bg-primary text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 flex items-center gap-2">
                                Register as a Farmer <ChevronRight size={20} />
                            </button>
                        </div>

                        <div className="lg:w-1/2 relative">
                            <div className="relative rounded-[3rem] overflow-hidden aspect-[4/5] shadow-2xl">
                                <Image
                                    src="https://images.unsplash.com/photo-1614157606535-2f3990b919a6?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                    alt="Farmer working"
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            {/* Stats Card */}
                            <div className="absolute -bottom-10 -left-10 bg-white p-8 rounded-3xl shadow-2xl max-w-xs border border-gray-100 hidden md:block">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 bg-lime-100 rounded-2xl flex items-center justify-center text-lime-600">
                                        <TrendingUp size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-2xl font-black text-organic-green">৳2.5M+</h4>
                                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Paid to Farmers</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
                                        <Sprout size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-2xl font-black text-organic-green">50k+</h4>
                                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Trees Protected</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust Section */}
            <section className="py-20 bg-white border-t border-emerald-100">
                <div className="container mx-auto px-4 md:px-6 text-center">
                    <h2 className="text-3xl font-bold text-organic-green mb-12">Our Contract Tiers</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        <div className="p-8 rounded-[2rem] border-2 border-dashed border-gray-200 hover:border-primary transition-colors text-left bg-surface group">
                            <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full mb-4 inline-block">Tier 1</span>
                            <h3 className="text-2xl font-bold text-organic-green mb-4">Seasonal Agreement</h3>
                            <p className="text-gray-500 mb-6">Perfect for orchard owners with specific seasonal fruits like Mango or Litchi.</p>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center gap-2 text-sm text-gray-600"><CheckCircle2 size={16} className="text-primary" /> Guaranteed Off-take</li>
                                <li className="flex items-center gap-2 text-sm text-gray-600"><CheckCircle2 size={16} className="text-primary" /> Logistics Support</li>
                                <li className="flex items-center gap-2 text-sm text-gray-600"><CheckCircle2 size={16} className="text-primary" /> Market Price Protection</li>
                            </ul>
                        </div>
                        <div className="p-8 rounded-[2rem] border-2 border-dashed border-gray-200 hover:border-primary transition-colors text-left bg-surface group">
                            <span className="bg-accent/10 text-accent text-xs font-bold px-3 py-1 rounded-full mb-4 inline-block">Tier 2</span>
                            <h3 className="text-2xl font-bold text-organic-green mb-4">Year-round Partner</h3>
                            <p className="text-gray-500 mb-6">For mixed orchards providing dates, honey, and jaggery throughout the year.</p>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center gap-2 text-sm text-gray-600"><CheckCircle2 size={16} className="text-accent" /> Priority Sorting</li>
                                <li className="flex items-center gap-2 text-sm text-gray-600"><CheckCircle2 size={16} className="text-accent" /> Agri-Tech Training</li>
                                <li className="flex items-center gap-2 text-sm text-gray-600"><CheckCircle2 size={16} className="text-accent" /> Brand Ambassador Status</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default FarmerOnboarding;
