import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAdmin } from "@/lib/admin-auth";

export async function GET() {
    try {
        const categories = await prisma.category.findMany({
            orderBy: { name: "asc" }
        });
        return NextResponse.json(categories);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const auth = await verifyAdmin();
        if (auth.error) {
            return NextResponse.json({ error: auth.error }, { status: auth.status });
        }

        const data = await request.json();
        const category = await prisma.category.create({
            data: {
                name: data.name,
                slug: data.slug || data.name.toLowerCase().replace(/\s+/g, "-"),
                icon: data.icon,
                image: data.image,
                description: data.description,
            }
        });

        return NextResponse.json(category);
    } catch (error) {
        return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
    }
}
