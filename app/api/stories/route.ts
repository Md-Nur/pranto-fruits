import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAdmin } from "@/lib/admin-auth";

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
        const auth = await verifyAdmin();
        if (auth.error) {
            return NextResponse.json({ error: auth.error }, { status: auth.status });
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
