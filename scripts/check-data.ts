import prisma from "../lib/prisma";

async function main() {
    const categories = await prisma.category.findMany({
        include: { _count: { select: { products: true } } }
    });
    console.log("Categories in DB:");
    categories.forEach(c => {
        console.log(`- ${c.name} (${c.slug}): ${c._count.products} products`);
    });

    const products = await prisma.product.findMany({
        select: { id: true, name: true, category: true, categoryId: true }
    });
    console.log("\nProducts in DB:");
    products.forEach(p => {
        console.log(`- ${p.name}: old_cat=${p.category}, new_cat_id=${p.categoryId}`);
    });
}

main().catch(console.error).finally(() => prisma.$disconnect());
