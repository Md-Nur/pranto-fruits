import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin-auth";
import prisma from "@/lib/prisma";
import { productSchema } from "@/lib/validation";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const auth = await verifyAdmin();
        if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

        const { id } = await params;
        const product = await prisma.product.findUnique({
            where: { id: parseInt(id) },
            include: { variants: true, categoryRef: true },
        });

        if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

        return NextResponse.json({ product });
    } catch (error) {
        console.error("Admin get product error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const auth = await verifyAdmin();
        if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

        const { id } = await params;
        const productId = parseInt(id);
        
        const body = await req.json();
        const validation = productSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ 
                error: validation.error.issues[0].message 
            }, { status: 400 });
        }

        const { name, categoryId, basePrice, priceRange, description, image, images, details, isNew, variants } = validation.data;

        // Delete existing variants and recreate
        await prisma.productVariant.deleteMany({ where: { productId } });

        const product = await prisma.product.update({
            where: { id: productId },
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

        return NextResponse.json({ product });
    } catch (error) {
        console.error("Admin update product error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const auth = await verifyAdmin();
        if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

        const { id } = await params;
        await prisma.product.delete({ where: { id: parseInt(id) } });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Admin delete product error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
