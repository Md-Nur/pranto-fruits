"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Facebook, Youtube, Mail, Phone, MapPin, Clock, Send, HelpCircle, MessageCircle, Truck, RotateCcw, ShieldCheck, Heart } from "lucide-react";
import { WhatsAppIcon } from "./WhatsAppIcon";

const TrustFooter = () => {
    const [email, setEmail] = useState("");

    const handleNewsletterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email.trim()) {
            alert("Thank you for subscribing to our newsletter!");
            setEmail("");
        }
    };

    return (
        <footer className="bg-gray-900 text-gray-300 pt-16 pb-20 md:pb-8 border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                {/* Main 3-Column Layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                    {/* Column 1: Brand Info */}
                    <div className="flex flex-col">
                        <Link href="/" className="flex items-center gap-3 mb-6 group select-none">
                            <div className="relative w-12 h-12 transition-transform duration-300 group-hover:scale-105 bg-white rounded-full p-1 shadow-md">
                                <Image
                                    src="/logo.png"
                                    alt="Village Organic Fruits"
                                    fill
                                    className="object-contain p-1"
                                />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-lg leading-tight text-white font-hind-siliguri">
                                    Village Organic Fruits
                                </span>
                                <span className="text-[10px] text-accent font-extrabold tracking-[0.15em] uppercase mt-0.5">
                                    Pure & Healthy
                                </span>
                            </div>
                        </Link>
                        <p className="text-sm text-gray-400 mb-6 leading-relaxed max-w-sm">
                            Focus on Quality Not Quantity - Village Organic Fruits is a dedicated agri-tech initiative in Bangladesh. We provide the highest quality seasonal fruits with guaranteed chemical-free freshness directly from orchards.
                        </p>
                        
                        {/* Social Follow Links */}
                        <div className="flex flex-col">
                            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
                                Follow Us
                            </h4>
                            <div className="flex gap-3">
                                <a href="https://facebook.com/villageorganicfruits" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-[#1877F2] text-gray-300 hover:text-white flex items-center justify-center transition-all hover:scale-105" title="Facebook">
                                    <Facebook size={18} />
                                </a>
                                <a href="https://youtube.com/@villageorganicfruits" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-[#FF0000] text-gray-300 hover:text-white flex items-center justify-center transition-all hover:scale-105" title="YouTube">
                                    <Youtube size={18} />
                                </a>
                                <a href="https://wa.me/8801878716088" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-[#25D366] text-gray-300 hover:text-white flex items-center justify-center transition-all hover:scale-105" title="WhatsApp">
                                    <WhatsAppIcon size={18} className="fill-current" />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Column 2: Customer Support */}
                    <div>
                        <h4 className="font-bold text-lg text-white mb-6 relative inline-block font-hind-siliguri">
                            Customer Support
                            <span className="absolute -bottom-1.5 left-0 w-8 h-1 bg-accent rounded-full"></span>
                        </h4>
                        <ul className="space-y-3.5 text-sm text-gray-400">
                            <li>
                                <Link href="#" className="hover:text-white transition-colors flex items-center gap-2.5 group">
                                    <HelpCircle size={16} className="text-gray-500 group-hover:text-accent transition-colors" />
                                    <span>Help Center / FAQs</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="https://wa.me/8801878716088" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-2.5 group">
                                    <MessageCircle size={16} className="text-gray-500 group-hover:text-accent transition-colors" />
                                    <span>Live WhatsApp Chat</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-white transition-colors flex items-center gap-2.5 group">
                                    <Truck size={16} className="text-gray-500 group-hover:text-accent transition-colors" />
                                    <span>Shipping & Delivery Info</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/refund" className="hover:text-white transition-colors flex items-center gap-2.5 group">
                                    <RotateCcw size={16} className="text-gray-500 group-hover:text-accent transition-colors" />
                                    <span>Returns & Refund Policy</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-white transition-colors flex items-center gap-2.5 group">
                                    <ShieldCheck size={16} className="text-gray-500 group-hover:text-accent transition-colors" />
                                    <span>100% Quality Guarantee</span>
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3: Contact Info & Newsletter */}
                    <div>
                        <h4 className="font-bold text-lg text-white mb-6 relative inline-block font-hind-siliguri">
                            Contact Info
                            <span className="absolute -bottom-1.5 left-0 w-8 h-1 bg-accent rounded-full"></span>
                        </h4>
                        <ul className="space-y-4 text-sm text-gray-400 mb-6">
                            <li className="flex items-start gap-3">
                                <MapPin size={18} className="text-accent shrink-0 mt-0.5" />
                                <span>Podagonj bazar, Mithapukur, Rangpur, Bangladesh</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone size={18} className="text-accent shrink-0" />
                                <a href="tel:01878716088" className="hover:text-white transition-colors">01878716088</a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail size={18} className="text-accent shrink-0" />
                                <a href="mailto:hello@villageorganicfruits.com" className="hover:text-white transition-colors">hello@villageorganicfruits.com</a>
                            </li>
                            <li className="flex items-start gap-3">
                                <Clock size={18} className="text-accent shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-semibold text-gray-300">Daily: 8:00 AM - 10:00 PM</p>
                                    <p className="text-xs text-gray-500">7 Days a week support</p>
                                </div>
                            </li>
                        </ul>

                        {/* Newsletter Input Box */}
                        <div className="pt-4 border-t border-gray-800">
                            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-2.5">
                                Newsletter Subscription
                            </h5>
                            <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    required
                                    className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-accent transition-colors"
                                />
                                <button
                                    type="submit"
                                    className="px-3.5 py-2 bg-accent hover:bg-accent/90 text-gray-950 font-bold rounded-lg transition-colors flex items-center justify-center shrink-0"
                                    title="Subscribe"
                                >
                                    <Send size={14} />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Quick Links Section (Desktop Inline) */}
                <div className="hidden md:block border-t border-gray-800 py-6">
                    <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-bold uppercase tracking-wider">
                        <Link href="/" className="text-gray-400 hover:text-white transition-colors">Home</Link>
                        <span className="text-gray-700">|</span>
                        <Link href="/shop" className="text-gray-400 hover:text-white transition-colors">Shop</Link>
                        <span className="text-gray-700">|</span>
                        <Link href="/gifts" className="text-gray-400 hover:text-white transition-colors">Corporate Gifts</Link>
                        <span className="text-gray-700">|</span>
                        <Link href="/wisdom" className="text-gray-400 hover:text-white transition-colors">Fruit Wisdom</Link>
                        <span className="text-gray-700">|</span>
                        <Link href="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link>
                        <span className="text-gray-700">|</span>
                        <Link href="/farmers" className="text-gray-400 hover:text-white transition-colors">Our Farmers</Link>
                        <span className="text-gray-700">|</span>
                        <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact Us</Link>
                        <span className="text-gray-700">|</span>
                        <Link href="/track" className="text-gray-400 hover:text-white transition-colors">Track Order</Link>
                    </div>
                </div>

                {/* Bottom Bar: Copyright, Payment Badges, Policy Links */}
                <div className="border-t border-gray-800 pt-6 mt-2 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-bold uppercase tracking-wider">
                    {/* Copyright */}
                    <div className="text-gray-500 text-center md:text-left">
                        © 2026 Village Organic Fruits. All rights reserved.
                    </div>

                    {/* Payment Partner Logos Row */}
                    <div className="flex items-center gap-3 bg-gray-800/40 rounded-xl px-4 py-2 border border-gray-800/80 shadow-inner">
                        <span className="text-[10px] text-gray-500 font-bold uppercase mr-1">We Accept:</span>
                        <div className="flex items-center gap-4">
                            <div className="relative w-12 h-6 flex items-center justify-center opacity-75 hover:opacity-100 transition-opacity">
                                <Image src="/assets/images/bkash.png" alt="bKash" fill className="object-contain" />
                            </div>
                            <div className="relative w-12 h-6 flex items-center justify-center opacity-75 hover:opacity-100 transition-opacity">
                                <Image src="/assets/images/nagad.png" alt="Nagad" fill className="object-contain" />
                            </div>
                            <span className="text-[9px] bg-gray-700/60 text-gray-400 px-2 py-0.5 rounded font-black border border-gray-600/40 select-none">
                                COD
                            </span>
                        </div>
                    </div>

                    {/* Policy Links */}
                    <div className="flex gap-6 text-gray-500">
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="/refund" className="hover:text-white transition-colors">Refund Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default TrustFooter;
