import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/jwt-utils";

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("auth-token")?.value;
        if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const payload = await verifyJwt(token);
        if (!payload || payload.role !== "ADMIN") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const data = await request.json();
        const id = parseInt(params.id);

        const story = await prisma.gardenStory.update({
            where: { id },
            data: {
                title: data.title,
                videoUrl: data.videoUrl,
                published: data.published !== undefined ? data.published : true,
            }
        });

        return NextResponse.json(story);
    } catch (error) {
        console.error("Update story error:", error);
        return NextResponse.json({ error: "Failed to update story" }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("auth-token")?.value;
        if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const payload = await verifyJwt(token);
        if (!payload || payload.role !== "ADMIN") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const id = parseInt(params.id);
        await prisma.gardenStory.delete({
            where: { id }
        });

        return NextResponse.json({ message: "Story deleted successfully" });
    } catch (error) {
        console.error("Delete story error:", error);
        return NextResponse.json({ error: "Failed to delete story" }, { status: 500 });
    }
}
