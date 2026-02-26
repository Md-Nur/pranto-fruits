import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q");

    try {
        let products;
        
        if (q) {
            products = await prisma.product.findMany({
                where: {
                    OR: [
                        { name: { contains: q, mode: "insensitive" } },
                        { description: { contains: q, mode: "insensitive" } },
                        { category: { contains: q, mode: "insensitive" } },
                    ]
                },
                include: { variants: true }
            });
        } else {
            products = await prisma.product.findMany({
                include: { variants: true }
            });
        }

        return NextResponse.json(products);
    } catch (error) {
        console.error("Search error:", error);
        return NextResponse.json({ error: "Failed to search products" }, { status: 500 });
    }
}
