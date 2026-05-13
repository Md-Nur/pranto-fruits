import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/jwt-utils";

async function requireAdmin() {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;
    if (!token) return null;
    const payload = await verifyJwt(token);
    if (!payload || payload.role !== "ADMIN") return null;
    return payload;
}

// GET all stories for admin (including unpublished)
export async function GET() {
    try {
        const admin = await requireAdmin();
        if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const stories = await prisma.gardenStory.findMany({
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(stories);
    } catch (error) {
        console.error("Admin fetch stories error:", error);
        return NextResponse.json({ error: "Failed to fetch stories" }, { status: 500 });
    }
}
