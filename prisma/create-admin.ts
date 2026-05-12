import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma';
import bcrypt from 'bcryptjs';
import "dotenv/config";

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    const phone = "01878716088";
    const password = "admin123";
    const name = "Admin";

    const existing = await prisma.user.findUnique({ where: { phone } });

    if (existing) {
        // Update to admin if already exists
        await prisma.user.update({
            where: { phone },
            data: { role: "ADMIN" },
        });
        console.log(`User ${phone} already exists — promoted to ADMIN.`);
    } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.user.create({
            data: {
                name,
                phone,
                password: hashedPassword,
                role: "ADMIN",
            },
        });
        console.log(`Admin user created: phone=${phone}, password=${password}`);
    }

    console.log("\nYou can now login with:");
    console.log(`  Phone: ${phone}`);
    console.log(`  Password: ${password}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
