"use client";

import React from "react";
import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => {
    const phoneNumber = "01878716088";
    const message = "Hello Village Organic Fruits, I would like to know more about your fruits.";

    return (
        <a
            href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-8 right-8 z-[100] group flex items-center gap-3"
        >
            <div className="bg-white px-4 py-2 rounded-lg shadow-lg border border-gray-100 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 pointer-events-none">
                <span className="text-sm font-bold text-gray-700 whitespace-nowrap">Chat on WhatsApp</span>
            </div>
            <div className="w-16 h-16 bg-brand-green text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform duration-300 animate-bounce-subtle">
                <MessageCircle size={32} fill="currentColor" />
            </div>
        </a>
    );
};

export default WhatsAppButton;
