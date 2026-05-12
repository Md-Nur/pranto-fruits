import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/jwt-utils";

async function checkAdmin() {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;
    if (!token) return false;
    const payload = await verifyJwt(token);
    return payload && payload.role === "ADMIN";
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    if (!(await checkAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const data = await request.json();
        const resolvedParams = await params;
        const id = parseInt(resolvedParams.id);
        const review = await prisma.review.update({
            where: { id },
            data: {
                title: data.title,
                type: data.type,
                url: data.url,
                authorName: data.authorName,
                authorLink: data.authorLink,
                rating: data.rating,
                published: data.published,
            }
        });
        return NextResponse.json(review);
    } catch (error) {
        return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    if (!(await checkAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const resolvedParams = await params;
        const id = parseInt(resolvedParams.id);
        await prisma.review.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Delete failed" }, { status: 500 });
    }
}
