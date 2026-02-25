import React from "react";
import Link from "next/link";
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";

const TrustFooter = () => {
    return (
        <footer className="bg-organic-green text-white pt-16 pb-8">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Info */}
                    <div>
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                                <span className="text-organic-green font-bold text-xl">P</span>
                            </div>
                            <span className="font-bold text-xl">Pranto Fruits Ltd.</span>
                        </div>
                        <p className="text-emerald-100/70 mb-6 leading-relaxed">
                            Harvesting excellence since 2012. We are dedicated to providing the most authentic and healthy fruits directly from the gardens of Bangladesh.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors">
                                <Facebook size={20} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors">
                                <Instagram size={20} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors">
                                <Twitter size={20} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors">
                                <Youtube size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-bold text-lg mb-6">Explore</h4>
                        <ul className="space-y-4 text-emerald-100/70">
                            <li><Link href="/shop" className="hover:text-primary transition-colors">Shop All Fruits</Link></li>
                            <li><Link href="/gifts" className="hover:text-primary transition-colors">Corporate Gifting</Link></li>
                            <li><Link href="/wisdom" className="hover:text-primary transition-colors">Fruit Wisdom Blog</Link></li>
                            <li><Link href="/about" className="hover:text-primary transition-colors">Our Story</Link></li>
                            <li><Link href="/farmers" className="hover:text-primary transition-colors">Join as a Farmer</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="font-bold text-lg mb-6">Get in Touch</h4>
                        <ul className="space-y-4 text-emerald-100/70">
                            <li className="flex gap-3">
                                <Phone size={18} className="text-primary shrink-0" />
                                <span>+880 1XXX-XXXXXX</span>
                            </li>
                            <li className="flex gap-3">
                                <Mail size={18} className="text-primary shrink-0" />
                                <span>hello@premiumfruitbd.com</span>
                            </li>
                            <li className="flex gap-3">
                                <MapPin size={18} className="text-primary shrink-0" />
                                <span>House 12, Road 5, Block D, Banani, Dhaka</span>
                            </li>
                        </ul>
                    </div>

                    {/* Trust Data */}
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                        <h4 className="font-bold text-lg mb-4">Official Information</h4>
                        <div className="space-y-3 text-sm text-emerald-100/60">
                            <div className="flex justify-between border-b border-white/10 pb-2">
                                <span>e-TIN:</span>
                                <span className="text-emerald-50">1234567890XX</span>
                            </div>
                            <div className="flex justify-between border-b border-white/10 pb-2">
                                <span>Trade License:</span>
                                <span className="text-emerald-50">TRAD/DNCC/123456</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Registration:</span>
                                <span className="text-emerald-50">C-12345/2012</span>
                            </div>
                        </div>
                        <div className="mt-6 flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center p-2">
                                {/* Placeholder for QR or Trust Logo */}
                                <div className="w-full h-full border-2 border-primary/30 rounded-sm" />
                            </div>
                            <p className="text-[10px] leading-tight opacity-50">
                                Pranto Fruits Ltd. is a registered Agri-Tech entity under the laws of Bangladesh.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-emerald-100/40">
                    <p>© 2026 Pranto Fruits Ltd. All rights reserved.</p>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-primary transition-colors">Refund Policy</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default TrustFooter;
