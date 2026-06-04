"use client";

import React from "react";
import { Mail, Phone, MapPin, Clock, Send, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

import { fbEvents } from "@/components/FacebookPixel";

export default function ContactPage() {
    const [loading, setLoading] = React.useState(false);
    const [formData, setFormData] = React.useState({
        companyName: "",
        contactPerson: "",
        email: "",
        phone: "",
        details: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/inquiries", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok) {
                // Track lead event via Facebook Pixel
                try {
                    fbEvents.lead({
                        content_name: "Bulk Inquiry Form",
                        value: 0
                    }, {
                        em: formData.email,
                        ph: formData.phone,
                        fn: formData.contactPerson
                    });
                } catch (error) {
                    console.error("Failed to track Lead event:", error);
                }

                toast.success("আপনার ইনকোয়ারি সফলভাবে সাবমিট করা হয়েছে!");
                setFormData({
                    companyName: "",
                    contactPerson: "",
                    email: "",
                    phone: "",
                    details: "",
                });
            } else {
                toast.error(data.error || "কিছু ভুল হয়েছে");
            }
        } catch (error) {
            toast.error("সার্ভার ত্রুটি, দয়া করে আবার চেষ্টা করুন");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 md:py-24">
            <div className="container mx-auto px-4 md:px-8">

                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">
                        Get in <span className="text-primary">Touch</span>
                    </h1>
                    <p className="text-lg text-gray-600 leading-relaxed">
                        Have a question about our fresh fruits, need help with an order, or interested in bulk purchases? We'd love to hear from you.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">

                    {/* Contact Information Cards */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-6 group hover:shadow-md transition-all duration-300">
                            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                <Phone size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 text-lg mb-2">Call Us</h3>
                                <p className="text-gray-500 mb-2">We are available during business hours to assist you.</p>
                                <a href="tel:01878716088" className="font-bold text-primary hover:underline text-lg">01878716088</a>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-6 group hover:shadow-md transition-all duration-300">
                            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                <Mail size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 text-lg mb-2">Email Us</h3>
                                <p className="text-gray-500 mb-2">Drop us a line anytime. We usually reply within 24 hours.</p>
                                <a href="mailto:hello@villageorganicfruits.com" className="font-bold text-primary hover:underline">hello@villageorganicfruits.com</a>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-6 group hover:shadow-md transition-all duration-300">
                            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                <MapPin size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 text-lg mb-2">Visit Us</h3>
                                <p className="text-gray-500 mb-2">Come say hello at our farm location.</p>
                                <p className="font-bold text-gray-800">Podagonj bazar, Mithapukur, Rangpur</p>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-6 group hover:shadow-md transition-all duration-300">
                            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                <Clock size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 text-lg mb-2">Business Hours</h3>
                                <p className="font-bold text-gray-800">Saturday - Thursday</p>
                                <p className="text-gray-500">9:00 AM - 6:00 PM</p>
                                <p className="font-bold text-gray-800 mt-2">Friday</p>
                                <p className="text-gray-500">Closed</p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-8 md:p-12">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">বাল্ক ইনকোয়ারি ফর্ম</h2>
                            <p className="text-gray-500 mb-8">আপনার কী প্রয়োজন তা আমাদের জানান এবং আমাদের প্রতিনিধি ২ ঘণ্টার মধ্যে আপনার সাথে যোগাযোগ করবে।</p>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">কোম্পানির নাম</label>
                                        <input
                                            type="text"
                                            name="companyName"
                                            value={formData.companyName}
                                            onChange={handleChange}
                                            required
                                            placeholder="উদাঃ এবিসি কর্পোরেশন"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-gray-50/50 focus:bg-white"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">যোগাযোগের ব্যক্তি</label>
                                        <input
                                            type="text"
                                            name="contactPerson"
                                            value={formData.contactPerson}
                                            onChange={handleChange}
                                            required
                                            placeholder="আপনার নাম"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-gray-50/50 focus:bg-white"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">ইমেইল ঠিকানা</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            placeholder="work@company.com"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-gray-50/50 focus:bg-white"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">ফোন নম্বর</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required
                                            placeholder="+880 1..."
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-gray-50/50 focus:bg-white"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">আনুমানিক পরিমাণ এবং আপনার বিস্তারিত প্রয়োজন</label>
                                    <textarea
                                        rows={6}
                                        name="details"
                                        value={formData.details}
                                        onChange={handleChange}
                                        required
                                        placeholder="আপনার কী ধরণের ফল এবং কয়টি বাক্স প্রয়োজন?"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none bg-gray-50/50 focus:bg-white"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full md:w-auto px-8 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all duration-300 shadow-lg shadow-primary/30 flex items-center justify-center gap-2 disabled:opacity-70"
                                >
                                    {loading ? (
                                        <Loader2 size={18} className="animate-spin" />
                                    ) : (
                                        <>
                                            <Send size={18} />
                                            সাবমিট করুন
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
