import { PrismaClient } from '../generated/prisma';
import { products } from '../data/products';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import "dotenv/config";

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

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
