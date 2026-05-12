import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/jwt-utils";

export async function GET() {
    try {
        const reviews = await prisma.review.findMany({
            where: { published: true },
            orderBy: { createdAt: "desc" }
        });
        return NextResponse.json(reviews);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
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
        const review = await prisma.review.create({
            data: {
                title: data.title,
                type: data.type,
                url: data.url,
                authorName: data.authorName,
                authorLink: data.authorLink,
                rating: data.rating || 5,
                published: data.published !== undefined ? data.published : true,
            }
        });

        return NextResponse.json(review);
    } catch (error) {
        return NextResponse.json({ error: "Failed to create review" }, { status: 500 });
    }
}
