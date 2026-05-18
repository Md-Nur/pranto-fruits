"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

export default function TopProgressBar() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    // Complete the progress state when pathname or search parameters change
    useEffect(() => {
        if (loading) {
            setProgress(100);
            const timer = setTimeout(() => {
                setLoading(false);
                setProgress(0);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [pathname, searchParams, loading]);

    // Intercept all local anchor tag navigation clicks globally to trigger progress bar start
    useEffect(() => {
        const handleAnchorClick = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            const anchor = target.closest("a");

            if (
                anchor &&
                anchor.href &&
                anchor.target !== "_blank" &&
                !event.defaultPrevented &&
                event.button === 0 && // Left-click only
                !event.metaKey &&
                !event.ctrlKey &&
                !event.shiftKey &&
                !event.altKey
            ) {
                try {
                    const targetUrl = new URL(anchor.href);
                    const currentUrl = new URL(window.location.href);

                    // Only trigger if navigating to a local path and the path actually changes
                    if (
                        targetUrl.origin === currentUrl.origin &&
                        (targetUrl.pathname !== currentUrl.pathname || targetUrl.search !== currentUrl.search) &&
                        !anchor.getAttribute("download") &&
                        !anchor.href.includes("#")
                    ) {
                        setLoading(true);
                        setProgress(10);
                    }
                } catch (e) {
                    // Ignore malformed URL parsing errors
                }
            }
        };

        document.addEventListener("click", handleAnchorClick, { capture: true });
        return () => {
            document.removeEventListener("click", handleAnchorClick, { capture: true });
        };
    }, []);

    // Animate the progress increments while loading
    useEffect(() => {
        if (loading && progress < 90) {
            const interval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 90) {
                        clearInterval(interval);
                        return prev;
                    }
                    // Slower growth as it nears 90%
                    const step = (90 - prev) * 0.15;
                    return prev + step;
                });
            }, 150);
            return () => clearInterval(interval);
        }
    }, [loading, progress]);

    return (
        <AnimatePresence>
            {loading && (
                <div className="fixed top-0 left-0 right-0 z-[99999] pointer-events-none">
                    {/* Glowing Progress Bar */}
                    <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: `${progress}%` }}
                        exit={{ opacity: 0 }}
                        transition={{ ease: "easeOut", duration: 0.2 }}
                        className="h-[3px] bg-gradient-to-r from-emerald-500 via-emerald-400 to-green-500 shadow-[0_0_8px_#10b981,0_0_4px_#10b981]"
                    />
                    
                    {/* Glowing spinner in the top right corner */}
                    <div className="absolute right-4 top-4">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 0.6, ease: "linear" }}
                            className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full shadow-[0_0_4px_rgba(16,185,129,0.3)]"
                        />
                    </div>
                </div>
            )}
        </AnimatePresence>
    );
}
