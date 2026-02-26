import React from "react";

export const metadata = {
    title: "গোপনীয়তা নীতি | Pranto Fruits",
    description: "প্রাঞ্জ ফ্রুটস এর গোপনীয়তা নীতি",
};

export default function PrivacyPolicyPage() {
    return (
        <main className="min-h-screen bg-surface py-20">
            <div className="container mx-auto px-4 md:px-6">
                <div className="max-w-4xl mx-auto bg-white rounded-[2.5rem] p-8 md:p-16 border border-gray-100 shadow-sm">
                    <h1 className="text-3xl md:text-5xl font-bold text-organic-green mb-8">গোপনীয়তা নীতি</h1>

                    <div className="prose prose-lg max-w-none text-gray-600 space-y-8">
                        <section>
                            <h2 className="text-2xl font-bold text-organic-green mb-4">১. তথ্য সংগ্রহ ও ব্যবহার</h2>
                            <p>
                                আমরা শুধুমাত্র আপনার নাম, ঠিকানা, ফোন নম্বর এবং ইমেইল সংগ্রহ করি যা আপনার অর্ডার সফলভাবে প্রসেস এবং ডেলিভারি করার জন্য প্রয়োজনীয়। আপনার কোনো তথ্য তৃতীয় পক্ষের কাছে বিক্রি করা হয় না।
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-organic-green mb-4">২. কুকিজ</h2>
                            <p>
                                আমাদের ওয়েবসাইটের ব্যবহারকারীর অভিজ্ঞতা উন্নত করার উদ্দেশ্যে আমরা কুকিজ ব্যবহার করি। এর মাধ্যমে আমরা আপনাকে দ্রুত লগইন করতে এবং আপনার শপিং কার্ট মনে রাখতে সাহায্য করি।
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-organic-green mb-4">৩. তথ্যের নিরাপত্তা</h2>
                            <p>
                                আপনার ব্যক্তিগত এবং লেনদেনের তথ্য এনক্রিপ্ট করে আমাদের সুরক্ষিত সার্ভারে সংরক্ষণ করা হয়। আমরা আপনার গোপনীয়তা রক্ষায় সর্বদা প্রতিশ্রুতিবদ্ধ।
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </main>
    );
}
