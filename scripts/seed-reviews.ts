import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma";

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const reviews = [
    {
        title: "Healthy & Safe Premium Mangoes",
        type: "VIDEO",
        url: "https://www.youtube.com/watch?v=0hL4o6yV-a0",
        authorName: "Premium Fruits",
        rating: 5
    },
    {
        title: "Premium Fruits Mango Reviews",
        type: "VIDEO",
        url: "https://www.youtube.com/watch?v=7u28rXjWc_k",
        authorName: "Explore with Hasan",
        rating: 5
    },
    {
        title: "Freshness directly from the garden!",
        type: "IMAGE",
        url: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=800",
        authorName: "Happy Customer",
        rating: 5
    },
    {
        title: "The best dates I have ever had.",
        type: "IMAGE",
        url: "https://images.unsplash.com/photo-1614061811858-dde54a522f5e?q=80&w=800",
        authorName: "Date Lover",
        rating: 5
    }
];

async function main() {
    console.log("Seeding reviews...");
    for (const review of reviews) {
        await prisma.review.create({ data: review as any });
    }
    console.log("Seeding complete!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
