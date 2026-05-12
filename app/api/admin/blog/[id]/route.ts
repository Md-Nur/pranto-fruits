import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin-auth";
import prisma from "@/lib/prisma";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const auth = await verifyAdmin();
        if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

        const { id } = await params;
        const body = await req.json();
        const { title, excerpt, content, image, tag, readTime, published } = body;

        const post = await prisma.blogPost.update({
            where: { id: parseInt(id) },
            data: {
                title,
                excerpt,
                content,
                image,
                tag,
                readTime,
                published,
            },
        });

        return NextResponse.json({ post });
    } catch (error) {
        console.error("Admin blog update error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const auth = await verifyAdmin();
        if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

        const { id } = await params;
        await prisma.blogPost.delete({ where: { id: parseInt(id) } });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Admin blog delete error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
