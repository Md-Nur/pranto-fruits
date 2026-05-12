import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/jwt-utils";

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
        const cookieStore = await cookies();
        const token = cookieStore.get("auth-token")?.value;
        if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const payload = await verifyJwt(token);
        if (!payload || payload.role !== "ADMIN") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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
