import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q");
    const category = searchParams.get("category");

    try {
        const where: any = {};
        
        if (q) {
            where.OR = [
                { name: { contains: q, mode: "insensitive" } },
                { description: { contains: q, mode: "insensitive" } },
            ];
        }

        if (category && category !== "all") {
            where.categoryRef = {
                slug: category
            };
        }

        const products = await prisma.product.findMany({
            where,
            include: { 
                variants: true,
                categoryRef: true
            }
        });

        return NextResponse.json(products);
    } catch (error) {
        console.error("Search error:", error);
        return NextResponse.json({ error: "Failed to search products" }, { status: 500 });
    }
}
