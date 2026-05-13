import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/jwt-utils";

export async function GET() {
    try {
        const stories = await prisma.gardenStory.findMany({
            where: { published: true },
            orderBy: { createdAt: "desc" }
        });
        return NextResponse.json(stories);
    } catch (error) {
        console.error("Fetch stories error:", error);
        return NextResponse.json({ error: "Failed to fetch stories" }, { status: 500 });
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
        const story = await prisma.gardenStory.create({
            data: {
                title: data.title,
                videoUrl: data.videoUrl,
                published: data.published !== undefined ? data.published : true,
            }
        });

        return NextResponse.json(story);
    } catch (error) {
        console.error("Create story error:", error);
        return NextResponse.json({ error: "Failed to create story" }, { status: 500 });
    }
}
