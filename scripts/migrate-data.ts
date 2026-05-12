import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma";

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const categories = [
    { name: "Mango (আম)", slug: "mango", icon: "Mango" },
    { name: "Dates (খেজুর)", slug: "dates", icon: "Calendar" },
    { name: "Gur (গুড়)", slug: "jaggery", icon: "Sugar" },
    { name: "Honey (মধু)", slug: "honey", icon: "Droplets" },
    { name: "Baskets (ঝুড়ি)", slug: "baskets", icon: "ShoppingBasket" }
];

async function main() {
    console.log("Starting migration...");

    // 1. Create Categories
    for (const cat of categories) {
        await prisma.category.upsert({
            where: { slug: cat.slug },
            update: {},
            create: cat,
        });
        console.log(`Upserted category: ${cat.name}`);
    }

    // 2. Link Products
    const products = await prisma.product.findMany();
    const dbCategories = await prisma.category.findMany();

    for (const product of products) {
        if (!product.category) continue;

        const matchedCat = dbCategories.find(c => 
            product.category?.toLowerCase().includes(c.slug) || 
            c.name.toLowerCase().includes(product.category?.toLowerCase() || "")
        );

        if (matchedCat) {
            await prisma.product.update({
                where: { id: product.id },
                data: { categoryId: matchedCat.id },
            });
            console.log(`Linked product "${product.name}" to category "${matchedCat.name}"`);
        }
    }

    console.log("Migration complete!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
