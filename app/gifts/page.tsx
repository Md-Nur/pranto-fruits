"use client";

import React from "react";
import Image from "next/image";
import { Gift, Building2, Send, CheckCircle2 } from "lucide-react";

const CorporateGifting = () => {
    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
                <Image
                    src="https://images.unsplash.com/photo-1595123550441-df74130094e9?q=80&w=2000&auto=format&fit=crop"
                    alt="Corporate Gifting"
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-organic-green/60 backdrop-blur-[2px]" />
                <div className="relative z-10 text-center text-white px-4">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">Corporate Gifting</h1>
                    <p className="text-xl text-emerald-50 max-w-2xl mx-auto opacity-90">
                        Show your appreciation with premium, healthy, and natural fruit baskets. Perfectly curated for your clients, partners, and employees.
                    </p>
                </div>
            </section>

            {/* Benefits Bento */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                        <div className="bg-emerald-50 p-8 rounded-3xl border border-emerald-100 italic transition-transform hover:-translate-y-1">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary mb-6 shadow-sm">
                                <Building2 size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-organic-green mb-4">Brand Customization</h3>
                            <p className="text-gray-600 leading-relaxed">Add your company logo, personal message cards, and branded ribbons to every gift box.</p>
                        </div>
                        <div className="bg-orange-50 p-8 rounded-3xl border border-orange-100 italic transition-transform hover:-translate-y-1">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-accent mb-6 shadow-sm">
                                <Gift size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-earth-brown mb-4">Bulk Logistics</h3>
                            <p className="text-gray-600 leading-relaxed">We handle multi-location deliveries across Dhaka and Rajshahi with real-time tracking.</p>
                        </div>
                        <div className="bg-lime-50 p-8 rounded-3xl border border-lime-100 italic transition-transform hover:-translate-y-1">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-lime-600 mb-6 shadow-sm">
                                <CheckCircle2 size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-organic-green mb-4">Premium Selection</h3>
                            <p className="text-gray-600 leading-relaxed">Choose from our highest grade Himsagar, Amrapali, or Maryam dates for maximum impression.</p>
                        </div>
                    </div>

                    <div className="max-w-4xl mx-auto bg-surface rounded-[3rem] p-8 md:p-16 border border-gray-100 shadow-2xl relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl font-bold text-organic-green mb-4">Bulk Inquiry Form</h2>
                                <p className="text-gray-500">Tell us your requirements and our representative will reach out within 2 hours.</p>
                            </div>

                            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-gray-700">Company Name</label>
                                    <input type="text" placeholder="e.g. Acme Corp" className="bg-white border border-gray-200 rounded-2xl p-4 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-gray-700">Contact Person</label>
                                    <input type="text" placeholder="Your Name" className="bg-white border border-gray-200 rounded-2xl p-4 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-gray-700">Email Address</label>
                                    <input type="email" placeholder="work@company.com" className="bg-white border border-gray-200 rounded-2xl p-4 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-gray-700">Phone Number</label>
                                    <input type="tel" placeholder="+880 1..." className="bg-white border border-gray-200 rounded-2xl p-4 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" />
                                </div>
                                <div className="md:col-span-2 flex flex-col gap-2">
                                    <label className="text-sm font-bold text-gray-700">Approx. Quantity & Requirements</label>
                                    <textarea rows={4} placeholder="What kind of fruits and how many boxes do you need?" className="bg-white border border-gray-200 rounded-3xl p-4 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none"></textarea>
                                </div>
                                <div className="md:col-span-2 mt-4">
                                    <button type="button" className="w-full bg-organic-green text-white py-5 rounded-full font-bold text-lg hover:bg-primary transition-all flex items-center justify-center gap-2 shadow-xl shadow-organic-green/20">
                                        <Send size={20} /> Submit Inquiry
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Background Decoration */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full translate-x-1/3 -translate-y-1/3" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/5 rounded-full -translate-x-1/4 translate-y-1/4" />
                    </div>
                </div>
            </section>
        </div>
    );
};

export default CorporateGifting;
