import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAdmin } from "@/lib/admin-auth";

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const auth = await verifyAdmin();
        if (auth.error) {
            return NextResponse.json({ error: auth.error }, { status: auth.status });
        }

        const data = await request.json();
        const id = parseInt((await params).id);

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
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const auth = await verifyAdmin();
        if (auth.error) {
            return NextResponse.json({ error: auth.error }, { status: auth.status });
        }

        const id = parseInt((await params).id);
        await prisma.gardenStory.delete({
            where: { id }
        });

        return NextResponse.json({ message: "Story deleted successfully" });
    } catch (error) {
        console.error("Delete story error:", error);
        return NextResponse.json({ error: "Failed to delete story" }, { status: 500 });
    }
}
