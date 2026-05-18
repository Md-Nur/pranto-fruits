"use client";

import React, { useState, useEffect } from "react";
import {
    Store,
    Phone,
    Mail,
    MapPin,
    Facebook,
    Youtube,
    MessageCircle,
    ExternalLink,
    Shield,
    KeyRound,
    Loader2,
    Truck,
    RefreshCw,
    AlertCircle,
    CheckCircle2
} from "lucide-react";
import { toast } from "react-hot-toast";

const contactInfo = [
    { icon: Phone, label: "Phone", value: "01878716088 & 01576974735" },
    { icon: MessageCircle, label: "WhatsApp", value: "01878716088" },
    { icon: Mail, label: "Email", value: "hello@villageorganicfruits.com" },
    { icon: MapPin, label: "Address", value: "Podagonj bazar Mithapukur Rangpur" },
];

const socialLinks = [
    { icon: Facebook, label: "Facebook", url: "https://www.facebook.com/share/1HpgV6RG47/", color: "bg-blue-50 text-blue-600 border-blue-100" },
    { icon: Youtube, label: "YouTube", url: "https://youtube.com/@villageorganicfruits?si=oo1PSwaZtNaY7XNO", color: "bg-red-50 text-red-600 border-red-100" },
    { icon: MessageCircle, label: "WhatsApp", url: "https://wa.me/8801878716088", color: "bg-green-50 text-green-600 border-green-100" },
];

export default function AdminSettingsPage() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Steadfast Courier Integration State
    const [steadfastStatus, setSteadfastStatus] = useState<any>(null);
    const [loadingSteadfast, setLoadingSteadfast] = useState(true);

    const fetchSteadfastStatus = async () => {
        setLoadingSteadfast(true);
        try {
            const res = await fetch("/api/admin/steadfast/balance");
            const data = await res.json();
            setSteadfastStatus(data);
        } catch (error) {
            console.error("Error fetching Steadfast status:", error);
            setSteadfastStatus({ success: false, error: "Failed to load Steadfast status." });
        } finally {
            setLoadingSteadfast(false);
        }
    };

    useEffect(() => {
        fetchSteadfastStatus();
    }, []);

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (newPassword !== confirmPassword) {
            toast.error("New passwords do not match");
            return;
        }
        
        if (newPassword.length < 6) {
            toast.error("New password must be at least 6 characters long");
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await fetch("/api/admin/change-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ currentPassword, newPassword }),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error || "Failed to change password");
            } else {
                toast.success("Password changed successfully");
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
            }
        } catch (error) {
            console.error("Change password error:", error);
            toast.error("An unexpected error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6 max-w-4xl">
            {/* Site Information */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                        <Store size={20} className="text-emerald-600" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900">Site Information</h3>
                        <p className="text-xs text-gray-400">Your store's basic information</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-xl">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Store Name</p>
                        <p className="text-sm font-bold text-gray-900">Village Organic Fruits</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Tagline</p>
                        <p className="text-sm font-bold text-gray-900">Pure & Healthy</p>
                    </div>
                </div>
            </div>

            {/* Steadfast Courier Integration */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-center justify-between gap-3 mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                            <Truck size={20} className="text-indigo-600" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">Steadfast Courier Integration</h3>
                            <p className="text-xs text-gray-400">Real-time status and billing balance for shipping</p>
                        </div>
                    </div>
                    
                    <button
                        onClick={fetchSteadfastStatus}
                        disabled={loadingSteadfast}
                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all duration-200 disabled:opacity-50"
                        title="Refresh Status"
                    >
                        <RefreshCw size={18} className={loadingSteadfast ? "animate-spin text-indigo-600" : ""} />
                    </button>
                </div>

                {loadingSteadfast ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="animate-spin text-indigo-600 mr-2" size={24} />
                        <span className="text-sm font-medium text-gray-500">Checking connectivity...</span>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* Status Badge */}
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Status:</span>
                                {steadfastStatus?.success ? (
                                    <span className="flex items-center gap-1 text-xs font-bold text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full">
                                        <CheckCircle2 size={12} /> Connected & Active
                                    </span>
                                ) : !steadfastStatus?.configured ? (
                                    <span className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                                        <AlertCircle size={12} /> Not Configured
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1 text-xs font-bold text-red-700 bg-red-50 border border-red-200 px-2.5 py-1 rounded-full">
                                        <AlertCircle size={12} /> Connection Failed
                                    </span>
                                )}
                            </div>
                            
                            {steadfastStatus?.success && (
                                <span className="text-xs text-gray-500 font-medium">
                                    Last checked: {new Date().toLocaleTimeString()}
                                </span>
                            )}
                        </div>

                        {/* Error Alert if failed */}
                        {steadfastStatus?.error && (
                            <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
                                <AlertCircle size={18} className="text-red-600 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-xs font-bold text-red-800 uppercase tracking-wider">Connection Error</p>
                                    <p className="text-xs text-red-600 mt-1">{steadfastStatus.error}</p>
                                </div>
                            </div>
                        )}

                        {/* Connection Details Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Balance Card */}
                            <div className="p-4 bg-gradient-to-br from-indigo-50/60 to-violet-50/40 border border-indigo-100/50 rounded-xl">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Current Balance</p>
                                <p className="text-2xl font-black text-indigo-700">
                                    {steadfastStatus?.success ? `৳ ${steadfastStatus.balance}` : "—"}
                                </p>
                            </div>

                            {/* Masked API Key */}
                            <div className="p-4 bg-gray-50 rounded-xl">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">API Key (Masked)</p>
                                <p className="text-sm font-bold text-gray-700 font-mono">
                                    {steadfastStatus?.configured && steadfastStatus?.apiKeyMasked ? steadfastStatus.apiKeyMasked : "Not Configured"}
                                </p>
                            </div>

                            {/* Base URL */}
                            <div className="p-4 bg-gray-50 rounded-xl">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">API Endpoint</p>
                                <p className="text-xs font-bold text-gray-500 font-mono truncate" title={steadfastStatus?.apiUrl || "https://portal.packzy.com/api/v1"}>
                                    {steadfastStatus?.apiUrl || "https://portal.packzy.com/api/v1"}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                        <Phone size={20} className="text-blue-600" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900">Contact Information</h3>
                        <p className="text-xs text-gray-400">How customers can reach you</p>
                    </div>
                </div>

                <div className="space-y-3">
                    {contactInfo.map((item) => {
                        const Icon = item.icon;
                        return (
                            <div key={item.label} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                                <Icon size={18} className="text-gray-400 shrink-0" />
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{item.label}</p>
                                    <p className="text-sm font-medium text-gray-900">{item.value}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
                        <ExternalLink size={20} className="text-violet-600" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900">Social Media</h3>
                        <p className="text-xs text-gray-400">Your social media presence</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {socialLinks.map((link) => {
                        const Icon = link.icon;
                        return (
                            <a
                                key={link.label}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`flex items-center gap-3 p-4 rounded-xl border font-medium text-sm hover:shadow-md transition-all duration-200 ${link.color}`}
                            >
                                <Icon size={20} />
                                <div>
                                    <p className="font-bold">{link.label}</p>
                                    <p className="text-[10px] opacity-60">Open link →</p>
                                </div>
                            </a>
                        );
                    })}
                </div>
            </div>

            {/* Admin Info */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                        <Shield size={20} className="text-amber-600" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900">Admin Panel</h3>
                        <p className="text-xs text-gray-400">System information</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-50 rounded-xl">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Framework</p>
                        <p className="text-sm font-bold text-gray-900">Next.js 16</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Database</p>
                        <p className="text-sm font-bold text-gray-900">PostgreSQL + Prisma</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Authentication</p>
                        <p className="text-sm font-bold text-gray-900">JWT (HttpOnly Cookie)</p>
                    </div>
                </div>
            </div>
            {/* Account Security */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                        <KeyRound size={20} className="text-red-600" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900">Account Security</h3>
                        <p className="text-xs text-gray-400">Change your admin password</p>
                    </div>
                </div>

                <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                        <input
                            type="password"
                            required
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-sm"
                            placeholder="Enter current password"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                        <input
                            type="password"
                            required
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-sm"
                            placeholder="Enter new password"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                        <input
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-sm"
                            placeholder="Confirm new password"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center justify-center gap-2 w-full bg-red-600 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-red-700 transition-colors disabled:bg-red-400"
                    >
                        {isSubmitting && <Loader2 size={18} className="animate-spin" />}
                        {isSubmitting ? "Updating..." : "Change Password"}
                    </button>
                </form>
            </div>
        </div>
    );
}
