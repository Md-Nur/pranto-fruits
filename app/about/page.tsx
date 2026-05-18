import React from "react";
import Image from "next/image";

export const metadata = {
    title: "আমাদের গল্প | Village Organic Fruits",
    description: "ভিলেজ অর্গানিক ফ্রুটসের গল্প ও মিশন",
};

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-surface py-20">
            <div className="container mx-auto px-4 md:px-6">
                <div className="max-w-4xl mx-auto bg-white rounded-[2.5rem] p-8 md:p-16 border border-gray-100 shadow-sm">
                    <h1 className="text-3xl md:text-5xl font-bold text-organic-green mb-8 text-center border-b border-gray-100 pb-8">আমাদের গল্প</h1>

                    <div className="prose prose-lg max-w-none text-gray-600 space-y-8">
                        <section>
                            <h2 className="text-2xl font-bold text-organic-green mb-4">আমাদের শুরু</h2>
                            <p className="leading-relaxed">
                                ভিলেজ অর্গানিক ফ্রুটস বাংলাদেশের বাগান থেকে সরাসরি সবচেয়ে খাঁটি ও স্বাস্থ্যকর ফল সরবরাহে নিবেদিত। একটি ছোট উদ্যোগ হিসেবে যাত্রা শুরু করে, আজকে আমরা দেশের হাজারো সচেতন পরিবারের বিশ্বস্ত তাজা ফলের সরবরাহকারী।
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-organic-green mb-4">আমাদের মিশন</h2>
                            <p className="leading-relaxed">
                                আমাদের মূল লক্ষ্য হলো ভেজালমুক্ত, তাজা এবং শতভাগ প্রাকৃতিকভাবে উৎপাদিত দেশি ও বিদেশি ফল গ্রাহকদের দোরগোড়ায় পৌঁছে দেওয়া। আমরা বিশ্বাস করি সুস্থতার জন্য স্বাস্থ্যকর খাদ্যাভ্যাস অপরিহার্য, আর সেই লক্ষ্যেই আমরা নিরলস কাজ করে যাচ্ছি।
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-organic-green mb-4">কৃষকদের সাথে আমাদের বন্ধন</h2>
                            <p className="leading-relaxed">
                                আমরা সরাসরি দেশের দূরদূরান্তের কৃষকদের সাথে কাজ করি। মধ্যস্বত্বভোগীদের এড়িয়ে কৃষকদের ন্যায্যমূল্য নিশ্চিত করার পাশাপাশি, আমরা গ্রাহকদের জন্য সাশ্রয়ী মূল্যে উৎকৃষ্ট মানের ফল সরবরাহ নিশ্চিত করি।
                            </p>
                            <ul className="list-disc pl-6 mt-4 space-y-2">
                                <li>সরাসরি বাগান থেকে সংগ্রহ</li>
                                <li>শতভাগ ফর্মালিন ও কেমিক্যালমুক্ত নিরাপদ ফল</li>
                                <li>কৃষকদের যথাযথ ও ন্যায্যমূল্য প্রদান</li>
                                <li>দ্রুততম সময়ে তাজা ফল ডেলিভারি</li>
                            </ul>
                        </section>

                        <section className="pt-8 border-t border-gray-100">
                            <h2 className="text-2xl font-bold text-organic-green mb-8 text-center">আমাদের নেতৃত্ব</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
                                {/* Founder & CEO */}
                                <div className="group bg-surface rounded-3xl p-6 border border-gray-100 flex flex-col items-center text-center transition-all duration-300 hover:shadow-md">
                                    <div className="relative w-40 h-40 rounded-full overflow-hidden mb-4 border-4 border-white shadow-md transition-transform duration-300 group-hover:scale-105">
                                        <Image
                                            src="/founder.jpeg"
                                            alt="Md Nayon Ali"
                                            fill
                                            className="object-cover"
                                            sizes="(max-w-768px) 160px, 160px"
                                        />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-950 mb-1">Md Nayon Ali</h3>
                                    <p className="text-sm font-semibold text-primary/90 mb-3 tracking-wider uppercase">Founder & CEO</p>
                                    <p className="text-gray-500 text-sm leading-relaxed italic max-w-xs">
                                        &ldquo;নিরাপদ ও ভেজালমুক্ত ফল সবার ঘরে ঘরে পৌঁছে দেওয়াই আমাদের একমাত্র অঙ্গীকার।&rdquo;
                                    </p>
                                </div>

                                {/* Director */}
                                <div className="group bg-surface rounded-3xl p-6 border border-gray-100 flex flex-col items-center text-center transition-all duration-300 hover:shadow-md">
                                    <div className="relative w-40 h-40 rounded-full overflow-hidden mb-4 border-4 border-white shadow-md transition-transform duration-300 group-hover:scale-105">
                                        <Image
                                            src="/director.jpeg"
                                            alt="Md Nahid Pervej"
                                            fill
                                            className="object-cover"
                                            sizes="(max-w-768px) 160px, 160px"
                                        />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-950 mb-1">Md Nahid Pervej</h3>
                                    <p className="text-sm font-semibold text-primary/90 mb-3 tracking-wider uppercase">Director</p>
                                    <p className="text-gray-500 text-sm leading-relaxed italic max-w-xs">
                                        &ldquo;কৃষকদের মেধা ও গ্রাহকদের সুস্বাস্থ্যের মধ্যে একটি মজবুত সেতুবন্ধন তৈরি করতে আমরা নিরলস কাজ করে যাচ্ছি।&rdquo;
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section className="bg-primary/5 p-6 rounded-2xl mt-12 border border-primary/10 text-center">
                            <h3 className="text-xl font-bold text-organic-green mb-3">আমাদের প্রতিশ্রুতি</h3>
                            <p className="text-gray-700 leading-relaxed">
                                ভিলেজ অর্গানিক ফ্রুটস বাংলাদেশের একটি স্বনামধন্য কৃষিপ্রযুক্তি প্রতিষ্ঠান। আমরা সর্বদা গ্রাহকের সন্তুষ্টি ও সুস্বাস্থ্য নিশ্চিত করতে বদ্ধপরিকর। আমাদের পথচলায় সাথে থাকার জন্য আপনাদের আন্তরিক ধন্যবাদ।
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </main>
    );
}
