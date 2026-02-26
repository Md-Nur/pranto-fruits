import { PrismaClient } from '../generated/prisma';
import { products } from '../data/products';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import "dotenv/config";

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const blogPosts = [
    {
        title: "কাঁচা আমের অবিশ্বাস্য স্বাস্থ্য উপকারিতা",
        excerpt: "কাঁচা আম শুধু সুস্বাদুই নয়, এতে রয়েছে প্রচুর ভিটামিন ও অ্যান্টিঅক্সিডেন্ট যা রোগ প্রতিরোধ ক্ষমতা বাড়ায়।",
        content: `কাঁচা আম বাংলাদেশ ও ভারতের অন্যতম জনপ্রিয় ফল। শুধু স্বাদেই নয়, পুষ্টিগুণেও এটি অতুলনীয়।

**ভিটামিন সি-এর উৎকৃষ্ট উৎস**
কাঁচা আমে রয়েছে প্রচুর পরিমাণে ভিটামিন সি, যা রোগ প্রতিরোধ ক্ষমতা বাড়াতে সাহায্য করে। প্রতিদিন একটি কাঁচা আম খেলে সর্দি-কাশি থেকে মুক্তি পেতে পারেন।

**হজমশক্তি উন্নত করে**
কাঁচা আমে থাকা এনজাইম ও ফাইবার পাচনতন্ত্রের কার্যক্ষমতা বাড়ায়। কোষ্ঠকাঠিন্য দূর করতে এবং অন্ত্রের স্বাস্থ্য রক্ষায় কাঁচা আম বিশেষ ভূমিকা রাখে।

**রক্তশোধক হিসেবে কাজ করে**
আমে থাকা অ্যান্টিঅক্সিডেন্ট রক্তকে পরিশুদ্ধ রাখতে সাহায্য করে এবং শরীর থেকে বিষাক্ত পদার্থ বের করে দেয়।

**গরমে শরীর ঠান্ডা রাখে**
কাঁচা আমের শরবত গ্রীষ্মকালে শরীরকে ঠান্ডা রাখে এবং হিটস্ট্রোক প্রতিরোধে সাহায্য করে।

কাঁচা আমকে আপনার দৈনন্দিন খাদ্য তালিকায় অন্তর্ভুক্ত করুন এবং সুস্বাস্থ্য উপভোগ করুন।`,
        image: "https://images.unsplash.com/photo-1655168339415-fc5a98a7184f?q=80&w=522&auto=format&fit=crop",
        tag: "স্বাস্থ্য",
        readTime: "৫ মিনিট পড়া",
    },
    {
        title: "কেন মরিয়ম খেজুর একটি আদর্শ সুপারফুড",
        excerpt: "ফাইবার ও প্রাকৃতিক চিনিতে ভরপুর খেজুর আপনার ব্যস্ত জীবনে দীর্ঘস্থায়ী শক্তি জোগায়।",
        content: `মরিয়ম খেজুর বিশ্বের সবচেয়ে পুষ্টিকর ফলগুলির মধ্যে একটি। এটি মধ্যপ্রাচ্যে উৎপন্ন হলেও সারা বিশ্বে এর ব্যাপক চাহিদা রয়েছে।

**প্রাকৃতিক শক্তির উৎস**
খেজুরে রয়েছে ফ্রুক্টোজ এবং গ্লুকোজ — দুটি প্রাকৃতিক চিনি যা তাৎক্ষণিক শক্তি সরবরাহ করে। ব্যায়ামের আগে বা পরে খেজুর খাওয়া আদর্শ।

**হাড় মজবুত করে**
খেজুরে থাকা ক্যালসিয়াম, ম্যাগনেসিয়াম ও ফসফরাস হাড়কে শক্তিশালী করে এবং অস্টিওপোরোসিস প্রতিরোধ করে।

**রক্তাল্পতা দূর করে**
উচ্চ আয়রন সামগ্রীর কারণে খেজুর রক্তাল্পতার রোগীদের জন্য অত্যন্ত উপকারী। নিয়মিত খেজুর খেলে হিমোগ্লোবিনের মাত্রা বৃদ্ধি পায়।

**রমজানে খেজুরের গুরুত্ব**
ইসলামিক ঐতিহ্য অনুযায়ী ইফতারে খেজুর দিয়ে রোজা ভাঙা হয়। এটি শুধু ধর্মীয় কারণেই নয়, বৈজ্ঞানিকভাবেও প্রমাণিত যে দীর্ঘ উপবাসের পর খেজুর খাওয়া শরীরের জন্য উপকারী।

প্রতিদিন ৩-৫টি মরিয়ম খেজুর খাওয়ার অভ্যাস গড়ে তুলুন এবং সুস্থ থাকুন।`,
        image: "https://plus.unsplash.com/premium_photo-1676208753932-6e8bc83a0b0d?q=80&w=1170&auto=format&fit=crop",
        tag: "পুষ্টি",
        readTime: "৪ মিনিট পড়া",
    },
    {
        title: "টেকসই চাষাবাদ: আমাদের ২-ধাপ প্রক্রিয়া",
        excerpt: "জানুন কীভাবে আমরা ফসল সংগ্রহ থেকে আপনার ঘর পর্যন্ত ১০০% রাসায়নিকমুক্ত রাখি।",
        content: `আমরা বিশ্বাস করি প্রকৃতির সাথে সামঞ্জস্য রেখে চাষাবাদ করাই সেরা পদ্ধতি। আমাদের টেকসই কৃষি পদ্ধতি পরিবেশ রক্ষা করে এবং আপনাকে সর্বোত্তম মানের ফল সরবরাহ করে।

**ধাপ ১: জৈব চাষ পদ্ধতি**
আমাদের কৃষকরা কোনো রাসায়নিক সার বা কীটনাশক ব্যবহার করেন না। পরিবর্তে আমরা ব্যবহার করি:

- কম্পোস্ট সার ও জৈব উপাদান
- প্রাকৃতিক কীটনাশক যেমন নিম তেল
- সঠিক শস্যাবর্তন পদ্ধতি
- মাটির জৈব গুণমান বজায় রাখা

**ধাপ ২: থেকে আপনার দরজা পর্যন্ত**
সংগ্রহের পর প্রতিটি ফল সাবধানে পরীক্ষা করা হয়। শুধুমাত্র সেরা মানের ফলগুলিই প্যাকেজিংয়ের জন্য বাছাই করা হয়।

- শীতল তাপমাত্রায় পরিবহন
- পরিবেশবান্ধব প্যাকেজিং উপকরণ
- দ্রুত ডেলিভারি — সংগ্রহের ২৪ ঘণ্টার মধ্যে

**আমাদের প্রতিশ্রুতি**
আমরা প্রতিটি পদক্ষেপে স্বচ্ছতা বজায় রাখি। আমাদের গ্রাহকরা জানতে পারেন তাদের ফল কোন খামার থেকে এসেছে এবং কীভাবে চাষ করা হয়েছে।

আমাদের সাথে যোগ দিন এবং একটি স্বাস্থ্যকর, পরিবেশবান্ধব জীবনযাত্রার অংশ হোন।`,
        image: "https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?q=80&w=2070&auto=format&fit=crop",
        tag: "কৃষি",
        readTime: "৬ মিনিট পড়া",
    },
];

async function main() {
    console.log('Seeding database with products...');

    // Optional: Clean up existing data
    await prisma.productVariant.deleteMany();
    await prisma.product.deleteMany();

    for (const product of products) {
        const { id, variants, isNew, ...productData } = product;

        const createdProduct = await prisma.product.create({
            data: {
                id, // explicitly setting the ID for now, as it correlates with other hardcoded parts, or we can let it auto-increment
                name: productData.name,
                category: productData.category,
                basePrice: productData.basePrice,
                priceRange: productData.priceRange,
                description: productData.description,
                image: productData.image,
                details: productData.details,
                isNew: isNew ?? false,
                variants: {
                    create: variants.map((variant) => ({
                        label: variant.label,
                        price: variant.price,
                    })),
                },
            },
        });

        console.log(`Created product: ${createdProduct.name} (${createdProduct.id})`);
    }

    // Seed blog posts
    console.log('Seeding blog posts...');
    await prisma.blogPost.deleteMany();
    for (const post of blogPosts) {
        const created = await prisma.blogPost.create({ data: post });
        console.log(`Created blog post: ${created.title} (${created.id})`);
    }

    console.log('Database seeded successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
