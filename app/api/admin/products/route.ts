import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin-auth";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        const auth = await verifyAdmin();
        if (auth.error) {
            return NextResponse.json({ error: auth.error }, { status: auth.status });
        }

        const { searchParams } = new URL(req.url);
        const search = searchParams.get("search") || "";
        const category = searchParams.get("category") || "";

        const where: any = {};
        if (search) {
            where.name = { contains: search, mode: "insensitive" };
        }
        if (category) {
            where.categoryId = parseInt(category);
        }

        const products = await prisma.product.findMany({
            where,
            include: { 
                variants: true,
                categoryRef: true
            },
            orderBy: { id: "desc" },
        });

        return NextResponse.json({ products });
    } catch (error) {
        console.error("Admin products list error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const auth = await verifyAdmin();
        if (auth.error) {
            return NextResponse.json({ error: auth.error }, { status: auth.status });
        }

        const body = await req.json();
        const { name, categoryId, basePrice, priceRange, description, image, images, details, isNew, variants } = body;

        if (!name || !categoryId || basePrice === undefined || !description || (!image && (!images || images.length === 0))) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const product = await prisma.product.create({
            data: {
                name,
                categoryId: parseInt(categoryId.toString()),
                basePrice: parseFloat(basePrice),
                priceRange: priceRange || String(basePrice),
                description,
                image: image || (images && images.length > 0 ? images[0] : ""),
                images: images || (image ? [image] : []),
                details: details || [],
                isNew: isNew || false,
                variants: {
                    create: (variants || []).map((v: any) => ({
                        label: v.label,
                        price: parseFloat(v.price),
                    })),
                },
            },
            include: { variants: true, categoryRef: true },
        });

        return NextResponse.json({ product }, { status: 201 });
    } catch (error) {
        console.error("Admin product create error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
