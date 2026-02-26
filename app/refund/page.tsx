import React from "react";

export const metadata = {
    title: "রিফান্ড পলিসি | Pranto Fruits",
    description: "প্রাঞ্জ ফ্রুটস এর রিফান্ড পলিসি",
};

export default function RefundPolicyPage() {
    return (
        <main className="min-h-screen bg-surface py-20">
            <div className="container mx-auto px-4 md:px-6">
                <div className="max-w-4xl mx-auto bg-white rounded-[2.5rem] p-8 md:p-16 border border-gray-100 shadow-sm">
                    <h1 className="text-3xl md:text-5xl font-bold text-organic-green mb-8">রিফান্ড পলিসি</h1>

                    <div className="prose prose-lg max-w-none text-gray-600 space-y-8">
                        <section>
                            <h2 className="text-2xl font-bold text-organic-green mb-4">১. রিফান্ডের শর্তাবলী</h2>
                            <p>
                                আমরা তাজা এবং উন্নত মানের ফল সরবরাহ করতে প্রতিশ্রুতিবদ্ধ। যদি কোনো কারণে আপনি আমাদের পণ্যের মান নিয়ে সন্তুষ্ট না হন, তবে পণ্য গ্রহণের ২৪ ঘণ্টার মধ্যে আমাদের সাথে যোগাযোগ করুন।
                            </p>
                            <p className="mt-4">
                                রিফান্ড বা রিপ্লেসমেন্ট প্রযোজ্য হবে যদি:
                            </p>
                            <ul className="list-disc pl-6 mb-4">
                                <li>ফল নষ্ট বা পচা অবস্থায় পাওয়া যায়।</li>
                                <li>অর্ডার করা ফলের পরিবর্তে অন্য ফল ডেলিভারি করা হয়।</li>
                                <li>ওজনে নির্ধারিত পরিমাণের চেয়ে কম থাকে।</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-organic-green mb-4">২. রিফান্ড প্রক্রিয়া</h2>
                            <p>
                                অভিযোগ নিশ্চিত হওয়ার পর আমরা পরবর্তী ৩-৫ কার্যদিবসের মধ্যে আপনার রিফান্ড প্রক্রিয়া সম্পন্ন করব। রিফান্ড আপনার মূল পেমেন্ট মেথড বা ব্যাংক অ্যাকাউন্টে পাঠানো হবে।
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-organic-green mb-4">৩. ব্যতিক্রম</h2>
                            <p>
                                ফল যেহেতু পচনশীল পণ্য, তাই ডেলিভারি গ্রহণের ২৪ ঘণ্টা পর কোনো অভিযোগ বা রিফান্ডের অনুরোধ বাতিল বলে গণ্য হবে।
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </main>
    );
}
