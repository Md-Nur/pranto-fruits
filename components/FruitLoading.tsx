"use client";

import { motion } from "framer-motion";
import { Apple, Banana, Cherry, Citrus, Grape, Leaf } from "lucide-react";

const fruits = [
    { icon: Apple, color: "text-red-500", delay: 0 },
    { icon: Banana, color: "text-yellow-400", delay: 0.1 },
    { icon: Cherry, color: "text-red-600", delay: 0.2 },
    { icon: Citrus, color: "text-orange-500", delay: 0.3 },
    { icon: Grape, color: "text-purple-500", delay: 0.4 },
    { icon: Leaf, color: "text-green-500", delay: 0.5 },
];

const FruitLoading = () => {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-md">
            <div className="flex space-x-4 mb-8">
                {fruits.map((Fruit, index) => (
                    <motion.div
                        key={index}
                        initial={{ y: 0 }}
                        animate={{
                            y: [-20, 0],
                        }}
                        transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            repeatType: "reverse",
                            ease: "easeInOut",
                            delay: Fruit.delay,
                        }}
                        className={`${Fruit.color} p-2 bg-white rounded-full shadow-lg border border-gray-100`}
                    >
                        <Fruit.icon size={32} strokeWidth={2.5} />
                    </motion.div>
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center"
            >
                <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
                    Gathering Fresh Fruits
                </h2>
                <div className="mt-2 flex items-center justify-center space-x-1">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            animate={{
                                opacity: [0.3, 1, 0.3],
                                scale: [1, 1.2, 1],
                            }}
                            transition={{
                                duration: 1,
                                repeat: Infinity,
                                delay: i * 0.2,
                            }}
                            className="w-2 h-2 bg-green-500 rounded-full"
                        />
                    ))}
                </div>
            </motion.div>

            {/* Subtle background decoration */}
            <div className="absolute inset-0 -z-10 overflow-hidden opacity-10 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-300 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-yellow-200 rounded-full blur-3xl animate-pulse delay-700" />
            </div>
        </div>
    );
};

export default FruitLoading;
