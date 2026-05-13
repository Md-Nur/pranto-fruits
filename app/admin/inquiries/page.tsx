"use client";

import React, { useState, useEffect } from "react";
import { Search, Eye, Clock, CheckCircle2, Trash2, Mail, Phone, Building2, User } from "lucide-react";
import { cn } from "@/lib/utils";
import FruitLoading from "@/components/FruitLoading";
import { toast } from "react-hot-toast";

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
    PENDING: { label: "Pending", color: "text-amber-600", bg: "bg-amber-50 border-amber-200" },
    CONTACTED: { label: "Contacted", color: "text-blue-600", bg: "bg-blue-50 border-blue-200" },
    COMPLETED: { label: "Completed", color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200" },
};

export default function AdminInquiriesPage() {
    const [inquiries, setInquiries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedInquiry, setSelectedInquiry] = useState<any>(null);

    const fetchInquiries = async () => {
        try {
            const res = await fetch("/api/admin/inquiries");
            const data = await res.json();
            setInquiries(data.inquiries || []);
        } catch (err) {
            console.error("Failed to fetch inquiries", err);
            toast.error("Failed to fetch inquiries");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInquiries();
    }, []);

    const handleStatusUpdate = async (id: number, status: string) => {
        try {
            const res = await fetch("/api/admin/inquiries", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, status }),
            });
            if (res.ok) {
                const data = await res.json();
                setInquiries((prev) => prev.map((i) => (i.id === id ? data.inquiry : i)));
                if (selectedInquiry?.id === id) {
                    setSelectedInquiry(data.inquiry);
                }
                toast.success("Status updated successfully");
            } else {
                toast.error("Failed to update status");
            }
        } catch (err) {
            toast.error("An error occurred");
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this inquiry?")) return;

        try {
            const res = await fetch(`/api/admin/inquiries?id=${id}`, {
                method: "DELETE",
            });
            if (res.ok) {
                setInquiries((prev) => prev.filter((i) => i.id !== id));
                if (selectedInquiry?.id === id) {
                    setSelectedInquiry(null);
                }
                toast.success("Inquiry deleted successfully");
            } else {
                toast.error("Failed to delete");
            }
        } catch (err) {
            toast.error("An error occurred");
        }
    };

    if (loading) return <FruitLoading />;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-slate-800">Bulk Inquiries</h1>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-600 rounded-lg border border-amber-100 font-medium">
                        <Clock size={14} /> {inquiries.filter(i => i.status === 'PENDING').length} Pending
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* List Column */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                        {inquiries.length === 0 ? (
                            <div className="text-center py-16">
                                <Mail size={48} className="mx-auto text-slate-200 mb-4" />
                                <p className="text-slate-400 font-medium">No inquiries found</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-slate-50/50 border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                        <tr>
                                            <th className="px-6 py-4">Company / Contact</th>
                                            <th className="px-6 py-4">Status</th>
                                            <th className="px-6 py-4">Date</th>
                                            <th className="px-6 py-4 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {inquiries.map((inquiry) => {
                                            const sc = statusConfig[inquiry.status];
                                            return (
                                                <tr 
                                                    key={inquiry.id} 
                                                    className={cn(
                                                        "hover:bg-slate-50/50 transition-colors cursor-pointer",
                                                        selectedInquiry?.id === inquiry.id ? "bg-emerald-50/50" : ""
                                                    )}
                                                    onClick={() => setSelectedInquiry(inquiry)}
                                                >
                                                    <td className="px-6 py-4">
                                                        <div className="font-bold text-slate-700 mb-0.5">{inquiry.companyName}</div>
                                                        <div className="text-xs text-slate-500 flex items-center gap-1">
                                                            <User size={12} /> {inquiry.contactPerson}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={cn("text-[10px] font-bold px-2 py-1 rounded-full border uppercase tracking-wider", sc?.bg, sc?.color)}>
                                                            {sc?.label}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-slate-400 text-xs">
                                                        {new Date(inquiry.createdAt).toLocaleDateString("en-GB", {
                                                            day: "2-digit", month: "short", year: "numeric"
                                                        })}
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button 
                                                            onClick={(e) => { e.stopPropagation(); handleDelete(inquiry.id); }}
                                                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                {/* Detail Column */}
                <div className="lg:col-span-1">
                    {selectedInquiry ? (
                        <div className="bg-white rounded-2xl border border-slate-100 p-6 sticky top-24 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold text-slate-800">Inquiry Details</h3>
                                <button 
                                    onClick={() => setSelectedInquiry(null)}
                                    className="text-slate-400 hover:text-slate-600 text-xs font-medium"
                                >
                                    Close
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div className="flex items-center gap-3 mb-1 text-emerald-600">
                                        <Building2 size={18} />
                                        <span className="font-bold text-sm">Company</span>
                                    </div>
                                    <p className="text-slate-700 font-medium ml-7">{selectedInquiry.companyName}</p>
                                </div>

                                <div className="space-y-3 px-1">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0">
                                            <User size={16} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Contact Person</p>
                                            <p className="text-sm font-medium text-slate-700">{selectedInquiry.contactPerson}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center shrink-0">
                                            <Mail size={16} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Email Address</p>
                                            <p className="text-sm font-medium text-slate-700">{selectedInquiry.email}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center shrink-0">
                                            <Phone size={16} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Phone Number</p>
                                            <p className="text-sm font-medium text-slate-700">{selectedInquiry.phone}</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-2 px-1">Detailed Requirements</p>
                                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-sm text-slate-600 leading-relaxed italic">
                                        "{selectedInquiry.details}"
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-slate-50">
                                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-3 px-1">Update Status</p>
                                    <div className="grid grid-cols-3 gap-2">
                                        {Object.keys(statusConfig).map((key) => (
                                            <button
                                                key={key}
                                                onClick={() => handleStatusUpdate(selectedInquiry.id, key)}
                                                className={cn(
                                                    "px-2 py-2 rounded-xl text-[10px] font-bold border transition-all",
                                                    selectedInquiry.status === key
                                                        ? statusConfig[key].bg + " " + statusConfig[key].color
                                                        : "bg-white text-slate-400 border-slate-100 hover:border-slate-200"
                                                )}
                                            >
                                                {statusConfig[key].label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 h-[400px] flex flex-col items-center justify-center text-slate-300 p-8 text-center">
                            <Eye size={40} className="mb-4 opacity-50" />
                            <p className="font-medium text-sm">Select an inquiry from the list to view full details and manage status.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
