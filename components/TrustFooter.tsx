import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Facebook, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { WhatsAppIcon } from "./WhatsAppIcon";

const TrustFooter = () => {
    return (
        <footer className="bg-surface text-gray-700 pt-16 pb-24 md:pb-8 border-t border-gray-200">
            <div className="container mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">
                    {/* Brand Info */}
                    <div>
                        <Link href="/" className="flex items-center gap-3 mb-6 group">
                            <div className="relative w-12 h-12 transition-transform duration-300 group-hover:scale-105">
                                <Image
                                    src="/logo.png"
                                    alt="Village Organic Fruits"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-xl leading-none text-primary">Village Organic Fruits</span>
                                <span className="text-[10px] text-primary/60 font-bold tracking-[0.2em] uppercase">Pure & Healthy</span>
                            </div>
                        </Link>
                        <p className="text-gray-500 mb-8 leading-relaxed max-w-sm">
                            Village Organic Fruits is an agri-tech initiative in Bangladesh. We are dedicated to providing the purest and healthiest fruits directly from gardens.
                        </p>
                        <div className="flex gap-4">
                            <a href="https://facebook.com/villageorganicfruits" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all">
                                <Facebook size={18} />
                            </a>
                            <a href="https://wa.me/8801878716088" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all">
                                <WhatsAppIcon size={18} />
                            </a>
                            <a href="https://youtube.com/@villageorganicfruits" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all">
                                <Youtube size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-bold text-lg text-gray-900 mb-8 relative inline-block">
                            Useful Links
                            <span className="absolute -bottom-2 left-0 w-8 h-1 bg-primary rounded-full"></span>
                        </h4>
                        <ul className="space-y-4 text-gray-600">
                            <li><Link href="/shop" className="hover:text-primary transition-colors font-medium">All Fruits</Link></li>
                            <li><Link href="/gifts" className="hover:text-primary transition-colors font-medium">Corporate Gifting</Link></li>
                            <li><Link href="/about" className="hover:text-primary transition-colors font-medium">About Us</Link></li>
                            <li><Link href="/farmers" className="hover:text-primary transition-colors font-medium">Our Farmers</Link></li>
                            <li><Link href="/contact" className="hover:text-primary transition-colors font-medium">Contact Us</Link></li>
                            <li><Link href="/terms" className="hover:text-primary transition-colors font-medium">Terms & Conditions</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="font-bold text-lg text-gray-900 mb-8 relative inline-block">
                            Contact Us
                            <span className="absolute -bottom-2 left-0 w-8 h-1 bg-primary rounded-full"></span>
                        </h4>
                        <ul className="space-y-6">
                            <li className="flex gap-4">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                    <Phone size={18} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Phone</span>
                                    <span className="font-bold text-gray-700">01878716088</span>
                                </div>
                            </li>
                            <li className="flex gap-4">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                    <Mail size={18} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Email</span>
                                    <span className="font-bold text-gray-700">hello@villageorganicfruits.com</span>
                                </div>
                            </li>
                            <li className="flex gap-4">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                    <MapPin size={18} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Address</span>
                                    <span className="font-bold text-gray-700 text-sm">Podagonj bazar, Mithapukur, Rangpur</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Payment Methods */}
                <div className="py-8 border-t border-gray-200 flex flex-wrap justify-center gap-6 opacity-80 grayscale hover:grayscale-0 transition-all duration-500">
                    <div className="relative w-24 h-12">
                        <Image src="/assets/images/bkash.png" alt="bKash" fill className="object-contain" />
                    </div>
                    <div className="relative w-24 h-12">
                        <Image src="/assets/images/nagad.png" alt="Nagad" fill className="object-contain" />
                    </div>
                </div>

                <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                    <p>© 2026 Village Organic Fruits. All rights reserved.</p>
                    <div className="flex gap-8">
                        <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
                        <Link href="/refund" className="hover:text-primary transition-colors">Refund Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default TrustFooter;
