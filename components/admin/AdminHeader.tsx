"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Menu, Bell, ShoppingCart, Users, Package, X, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminHeaderProps {
    title: string;
    subtitle?: string;
    onMobileMenuToggle: () => void;
}

interface Notification {
    id: string;
    type: 'ORDER' | 'USER' | 'PRODUCT';
    title: string;
    message: string;
    time: string;
    link: string;
    unread: boolean;
}

const AdminHeader = ({ title, subtitle, onMobileMenuToggle }: AdminHeaderProps) => {
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await fetch("/api/admin/notifications");
                const data = await res.json();
                if (data.notifications) {
                    setNotifications(data.notifications);
                    
                    // Logic for unread count: check against localStorage last read timestamp
                    const lastRead = localStorage.getItem('admin_notifications_last_read');
                    const lastReadDate = lastRead ? new Date(lastRead) : new Date(0);
                    
                    const count = data.notifications.filter((n: Notification) => 
                        new Date(n.time) > lastReadDate
                    ).length;
                    
                    setUnreadCount(count);
                }
            } catch (err) {
                console.error("Failed to fetch notifications", err);
            }
        };

        fetchNotifications();
        // Refresh every 5 minutes
        const interval = setInterval(fetchNotifications, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsNotificationsOpen(false);
            }
        };

        if (isNotificationsOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isNotificationsOpen]);

    const handleToggleNotifications = () => {
        if (!isNotificationsOpen) {
            // Mark all as read when opening
            localStorage.setItem('admin_notifications_last_read', new Date().toISOString());
            setUnreadCount(0);
        }
        setIsNotificationsOpen(!isNotificationsOpen);
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'ORDER': return <ShoppingCart size={14} className="text-blue-500" />;
            case 'USER': return <Users size={14} className="text-purple-500" />;
            default: return <Package size={14} className="text-emerald-500" />;
        }
    };

    const formatTime = (timeStr: string) => {
        const date = new Date(timeStr);
        const now = new Date();
        const diffInMs = now.getTime() - date.getTime();
        const diffInMins = Math.floor(diffInMs / (1000 * 60));
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

        if (diffInMins < 60) return `${diffInMins}m ago`;
        if (diffInHours < 24) return `${diffInHours}h ago`;
        return `${diffInDays}d ago`;
    };

    return (
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 shrink-0 sticky top-0 z-30">
            <div className="flex items-center gap-4">
                <button
                    onClick={onMobileMenuToggle}
                    className="lg:hidden p-2 -ml-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <Menu size={22} />
                </button>
                <div>
                    <h1 className="text-lg font-bold text-gray-900 leading-tight">{title}</h1>
                    {subtitle && <p className="text-xs text-gray-400 font-medium">{subtitle}</p>}
                </div>
            </div>

            <div className="flex items-center gap-3">
                <div className="relative" ref={dropdownRef}>
                    <button 
                        onClick={handleToggleNotifications}
                        className={cn(
                            "relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors",
                            isNotificationsOpen && "bg-gray-100 text-gray-600"
                        )}
                    >
                        <Bell size={20} />
                        {unreadCount > 0 && (
                            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </button>

                    {/* Notifications Dropdown */}
                    {isNotificationsOpen && (
                        <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in duration-200">
                            <div className="px-4 py-2 border-b border-gray-50 flex items-center justify-between">
                                <h3 className="font-bold text-gray-900">Notifications</h3>
                                <button 
                                    onClick={() => setIsNotificationsOpen(false)}
                                    className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                            
                            <div className="max-h-[400px] overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <div className="py-8 px-4 text-center">
                                        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <Bell size={20} className="text-gray-300" />
                                        </div>
                                        <p className="text-sm text-gray-400">No new notifications</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-gray-50">
                                        {notifications.map((n) => (
                                            <Link 
                                                key={n.id}
                                                href={n.link}
                                                onClick={() => setIsNotificationsOpen(false)}
                                                className="block px-4 py-3 hover:bg-gray-50 transition-colors"
                                            >
                                                <div className="flex gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0 mt-0.5">
                                                        {getIcon(n.type)}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex justify-between items-start mb-0.5">
                                                            <p className="text-xs font-bold text-gray-900 truncate pr-2">{n.title}</p>
                                                            <span className="text-[10px] font-medium text-gray-400 flex items-center gap-0.5 shrink-0">
                                                                <Clock size={10} /> {formatTime(n.time)}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-gray-500 leading-normal line-clamp-2">{n.message}</p>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                            
                            <div className="px-4 py-2 border-t border-gray-50 text-center">
                                <Link 
                                    href="/admin/orders" 
                                    className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
                                    onClick={() => setIsNotificationsOpen(false)}
                                >
                                    View All Activities
                                </Link>
                            </div>
                        </div>
                    )}
                </div>

                <Link href="/" className="text-xs font-medium text-gray-400 hover:text-emerald-600 border border-gray-200 px-3 py-1.5 rounded-lg hover:border-emerald-200 transition-all">
                    View Site →
                </Link>
            </div>
        </header>
    );
};

export default AdminHeader;

