"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Mail, Lock, Loader2, AlertCircle, Eye, EyeOff, CheckCircle2 } from "lucide-react";

function LoginContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectPath = searchParams.get("redirect") || "/";

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Login failed");
            }

            // Successful login
            router.push(redirectPath);
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-organic-green/5 rounded-full blur-3xl" />

            <div className="w-full max-w-md z-10">
                <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary transition-colors mb-8 group">
                    <div className="bg-gray-50 p-2 rounded-full group-hover:bg-primary/10 transition-colors">
                        <ArrowLeft size={18} />
                    </div>
                    <span className="font-medium">Back to Home</span>
                </Link>

                <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 p-8 md:p-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 text-primary rounded-2xl mb-6">
                            <Lock size={32} />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
                        <p className="text-gray-500">Log in to your account to continue</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center gap-3 text-sm animate-in shake-1 duration-300">
                            <AlertCircle size={18} className="shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 ml-1">Email Address</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    <Mail size={20} />
                                </span>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all placeholder:text-gray-400"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-sm font-semibold text-gray-700">Password</label>
                                <Link href="#" className="text-xs font-bold text-primary hover:text-primary-dark transition-colors">
                                    Forgot Password?
                                </Link>
                            </div>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    <Lock size={20} />
                                </span>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-12 pr-12 py-4 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all placeholder:text-gray-400"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-lg hover:bg-primary-dark transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-primary/25 flex items-center justify-center gap-3 disabled:opacity-70 disabled:hover:scale-100"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 size={24} className="animate-spin" />
                                        <span>Logging in...</span>
                                    </>
                                ) : (
                                    <span>Log In</span>
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 text-center pt-6 border-t border-gray-100">
                        <p className="text-gray-500">
                            Don&apos;t have an account?{" "}
                            <Link href="/register" className="text-primary font-bold hover:underline">
                                Sign Up
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Secure Badge */}
                <div className="mt-12 flex items-center justify-center gap-3 text-gray-400">
                    <CheckCircle2 size={16} />
                    <span className="text-xs font-medium tracking-wide uppercase">Secure and Encrypted Login</span>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 size={40} className="animate-spin text-primary" />
            </div>
        }>
            <LoginContent />
        </Suspense>
    );
}
