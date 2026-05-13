import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin-auth";
import prisma from "@/lib/prisma";
import { productSchema } from "@/lib/validation";

export async function GET(req: Request) {
    try {
        // Auth is now handled by middleware, but we can still use verifyAdmin for user info if needed
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
        const validation = productSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ 
                error: validation.error.issues[0].message 
            }, { status: 400 });
        }

        const { name, categoryId, basePrice, priceRange, description, image, images, details, isNew, variants } = validation.data;

        const product = await prisma.product.create({
            data: {
                name,
                categoryId: categoryId,
                basePrice: basePrice,
                priceRange: priceRange || String(basePrice),
                description,
                image: image || (images && images.length > 0 ? images[0] : ""),
                images: images || (image ? [image] : []),
                details: details || [],
                isNew: isNew || false,
                variants: {
                    create: (variants || []).map((v: any) => ({
                        label: v.label,
                        price: v.price,
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
