import React from "react";

export const metadata = {
    title: "আমাদের গল্প | Pranto Fruits",
    description: "প্রান্ত ফ্রুটস লিমিটেডের গল্প ও মিশন",
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
                                ২০১২ সাল থেকে প্রান্ত ফ্রুটস লিমিটেড শ্রেষ্ঠত্ব চাষাবাদ করে আসছে। আমরা বাংলাদেশের বাগান থেকে সরাসরি সবচেয়ে খাঁটি ও স্বাস্থ্যকর ফল সরবরাহে নিবেদিত। একটি ছোট উদ্যোগ হিসেবে যাত্রা শুরু করে, আজকে আমরা দেশের হাজারো সচেতন পরিবারের বিশ্বস্ত তাজা ফলের সরবরাহকারী।
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

                        <section className="bg-primary/5 p-6 rounded-2xl mt-12 border border-primary/10 text-center">
                            <h3 className="text-xl font-bold text-organic-green mb-3">আমাদের প্রতিশ্রুতি</h3>
                            <p className="text-gray-700 leading-relaxed">
                                প্রান্ত ফ্রুটস লিমিটেড বাংলাদেশের আইনে নিবন্ধিত একটি স্বনামধন্য কৃষিপ্রযুক্তি প্রতিষ্ঠান। আমরা সর্বদা গ্রাহকের সন্তুষ্টি ও সুস্বাস্থ্য নিশ্চিত করতে বদ্ধপরিকর। আমাদের পথচলায় সাথে থাকার জন্য আপনাদের আন্তরিক ধন্যবাদ।
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </main>
    );
}
