import React from "react";

export const metadata = {
    title: "সেবার শর্ত | Pranto Fruits",
    description: "প্রাঞ্জ ফ্রুটস এর সেবার শর্ত",
};

export default function TermsOfServicePage() {
    return (
        <main className="min-h-screen bg-surface py-20">
            <div className="container mx-auto px-4 md:px-6">
                <div className="max-w-4xl mx-auto bg-white rounded-[2.5rem] p-8 md:p-16 border border-gray-100 shadow-sm">
                    <h1 className="text-3xl md:text-5xl font-bold text-organic-green mb-8">সেবার শর্ত</h1>

                    <div className="prose prose-lg max-w-none text-gray-600 space-y-8">
                        <section>
                            <h2 className="text-2xl font-bold text-organic-green mb-4">১. সাধারণ শর্তাবলী</h2>
                            <p>
                                আমাদের ওয়েবসাইট ব্যবহার করার মাধ্যমে আপনি নিম্নলিখিত শর্তাবলীতে সম্মত হচ্ছেন। আমরা যেকোনো সময় এই শর্তাবলী পরিবর্তন বা পরিমার্জন করার অধিকার সংরক্ষণ করি।
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-organic-green mb-4">২. অর্ডার ও ডেলিভারি</h2>
                            <p>
                                অর্ডার প্লেস করার পর আমরা সাধারণত ২৪ থেকে ৪৮ ঘণ্টার মধ্যে ডেলিভারি সম্পন্ন করি। ডেলিভারির সময় আবহাওয়া বা অনাকাঙ্ক্ষিত পরিস্থিতির কারণে পরিবর্তন হতে পারে।
                            </p>
                            <ul className="list-disc pl-6 mb-4">
                                <li>ঢাকা শহরের মধ্যে ডেলিভারি চার্জ প্রযোজ্য।</li>
                                <li>ঢাকার বাইরের ডেলিভারির ক্ষেত্রে চার্জ আলাদা হবে এবং সময় বেশি লাগতে পারে।</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-organic-green mb-4">৩. মূল্য নির্ধারণ ও পেমেন্ট</h2>
                            <p>
                                সমস্ত পণ্যের মূল্য আমাদের ওয়েবসাইটে দেওয়া আছে। আমরা ক্যাশ অন ডেলিভারি (COD) এবং অন্যান্য অনলাইন পেমেন্ট গেটওয়ে সমর্থন করি। যেকোনো মূল্যের পরিবর্তন কোনো পূর্ব ঘোষণা ছাড়াই কার্যকর হতে পারে।
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </main>
    );
}
