"use client";

import React, { useState, useEffect } from "react";
import { Search, Shield, ShieldOff, Trash2, Users as UsersIcon, Phone, Mail, ShoppingCart, Key } from "lucide-react";
import { cn } from "@/lib/utils";
import FruitLoading from "@/components/FruitLoading";

export default function AdminUsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [expandedUser, setExpandedUser] = useState<number | null>(null);
    const [userOrders, setUserOrders] = useState<any[]>([]);
    const [loadingOrders, setLoadingOrders] = useState(false);

    const fetchUsers = async () => {
        try {
            const params = new URLSearchParams();
            if (search) params.set("search", search);
            const res = await fetch(`/api/admin/users?${params}`);
            const data = await res.json();
            setUsers(data.users || []);
        } catch (err) {
            console.error("Failed to fetch users", err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchUsers();
    }, [search]);

    const handleRoleToggle = async (userId: number, currentRole: string) => {
        const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN";
        if (!confirm(`Change this user's role to ${newRole}?`)) return;

        try {
            const res = await fetch(`/api/admin/users/${userId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role: newRole }),
            });
            if (res.ok) {
                setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
            }
        } catch (err) {
            console.error("Failed to update role", err);
        }
    };

    const handleDelete = async (userId: number) => {
        if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;

        try {
            const res = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
            if (res.ok) {
                setUsers((prev) => prev.filter((u) => u.id !== userId));
            } else {
                const data = await res.json();
                alert(data.error || "Failed to delete user");
            }
        } catch (err) {
            console.error("Failed to delete user", err);
        }
    };

    const handleChangePassword = async (userId: number) => {
        const newPassword = prompt("Enter the new password for this user:");
        if (!newPassword) return; // User cancelled or entered empty string

        if (newPassword.length < 6) {
            alert("Password must be at least 6 characters long.");
            return;
        }

        if (!confirm(`Are you sure you want to change the password for this user?`)) return;

        try {
            const res = await fetch(`/api/admin/users/${userId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password: newPassword }),
            });
            if (res.ok) {
                alert("Password changed successfully.");
            } else {
                const data = await res.json();
                alert(data.error || "Failed to change password");
            }
        } catch (err) {
            console.error("Failed to change password", err);
            alert("An error occurred while changing the password.");
        }
    };


    const handleExpandUser = async (userId: number) => {
        if (expandedUser === userId) {
            setExpandedUser(null);
            return;
        }
        setExpandedUser(userId);
        setLoadingOrders(true);
        try {
            const res = await fetch(`/api/admin/users/${userId}`);
            const data = await res.json();
            setUserOrders(data.user?.orders || []);
        } catch (err) {
            console.error("Failed to fetch user orders", err);
        }
        setLoadingOrders(false);
    };

    if (loading) return <FruitLoading />;

    return (
        <div className="space-y-6">
            {/* Search */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="relative flex-1 max-w-sm">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name or phone..."
                        className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    />
                </div>
                <div className="text-sm text-gray-400 font-medium">
                    {users.length} total users
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                {users.length === 0 ? (
                    <div className="text-center py-16">
                        <UsersIcon size={48} className="mx-auto text-gray-200 mb-4" />
                        <p className="text-gray-400 font-medium">No users found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-xs text-gray-400 uppercase tracking-wider border-b border-gray-100 bg-gray-50/50">
                                    <th className="px-6 py-3 font-semibold">User</th>
                                    <th className="px-4 py-3 font-semibold">Phone</th>
                                    <th className="px-4 py-3 font-semibold">Role</th>
                                    <th className="px-4 py-3 font-semibold">Orders</th>
                                    <th className="px-4 py-3 font-semibold">Joined</th>
                                    <th className="px-6 py-3 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <React.Fragment key={user.id}>
                                        <tr
                                            className={cn(
                                                "border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors cursor-pointer",
                                                expandedUser === user.id && "bg-gray-50/80"
                                            )}
                                            onClick={() => handleExpandUser(user.id)}
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={cn(
                                                        "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0",
                                                        user.role === "ADMIN"
                                                            ? "bg-emerald-100 text-emerald-700"
                                                            : "bg-gray-100 text-gray-600"
                                                    )}>
                                                        {user.name?.charAt(0)?.toUpperCase() || "U"}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900">{user.name}</p>
                                                        <p className="text-xs text-gray-400">{user.email || "No email"}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-1.5 text-gray-600">
                                                    <Phone size={12} className="text-gray-400" />
                                                    {user.phone}
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className={cn(
                                                    "text-xs font-bold px-2.5 py-1 rounded-full border",
                                                    user.role === "ADMIN"
                                                        ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                                                        : "bg-gray-50 text-gray-500 border-gray-200"
                                                )}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-1.5 text-gray-600">
                                                    <ShoppingCart size={12} className="text-gray-400" />
                                                    {user._count?.orders || 0}
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-gray-400 text-xs">
                                                {new Date(user.createdAt).toLocaleDateString("en-GB", {
                                                    day: "2-digit", month: "short", year: "numeric",
                                                })}
                                            </td>
                                            <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                                                <div className="flex items-center justify-end gap-1">
                                                    <button
                                                        onClick={() => handleChangePassword(user.id)}
                                                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Change Password"
                                                    >
                                                        <Key size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleRoleToggle(user.id, user.role)}
                                                        className={cn(
                                                            "p-2 rounded-lg transition-colors",
                                                            user.role === "ADMIN"
                                                                ? "text-amber-500 hover:bg-amber-50"
                                                                : "text-emerald-500 hover:bg-emerald-50"
                                                        )}
                                                        title={user.role === "ADMIN" ? "Demote to User" : "Promote to Admin"}
                                                    >
                                                        {user.role === "ADMIN" ? <ShieldOff size={16} /> : <Shield size={16} />}
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(user.id)}
                                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Delete User"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>

                                        {/* Expanded Orders Row */}
                                        {expandedUser === user.id && (
                                            <tr>
                                                <td colSpan={6} className="px-6 py-4 bg-gray-50/50 border-b border-gray-100">
                                                    {loadingOrders ? (
                                                        <p className="text-sm text-gray-400 text-center py-4">Loading orders...</p>
                                                    ) : userOrders.length === 0 ? (
                                                        <p className="text-sm text-gray-400 text-center py-4">No orders from this user</p>
                                                    ) : (
                                                        <div className="space-y-2">
                                                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                                                                Recent Orders ({userOrders.length})
                                                            </p>
                                                            {userOrders.slice(0, 5).map((order: any) => (
                                                                <div key={order.id} className="flex items-center justify-between bg-white rounded-xl p-3 border border-gray-100">
                                                                    <div className="flex items-center gap-4">
                                                                        <span className="text-sm font-bold text-gray-900">#{order.id}</span>
                                                                        <span className="text-sm text-gray-500">৳{order.totalAmount?.toLocaleString()}</span>
                                                                    </div>
                                                                    <div className="flex items-center gap-3">
                                                                        <span className={cn(
                                                                            "text-[10px] font-bold px-2 py-0.5 rounded-full border",
                                                                            order.status === "DELIVERED" && "bg-emerald-50 text-emerald-600 border-emerald-200",
                                                                            order.status === "PENDING" && "bg-amber-50 text-amber-600 border-amber-200",
                                                                            order.status === "PROCESSING" && "bg-blue-50 text-blue-600 border-blue-200",
                                                                            order.status === "SHIPPED" && "bg-purple-50 text-purple-600 border-purple-200",
                                                                            order.status === "CANCELLED" && "bg-red-50 text-red-600 border-red-200",
                                                                        )}>
                                                                            {order.status}
                                                                        </span>
                                                                        <span className="text-xs text-gray-400">
                                                                            {new Date(order.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
