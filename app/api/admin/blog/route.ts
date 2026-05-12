import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin-auth";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const auth = await verifyAdmin();
        if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

        const posts = await prisma.blogPost.findMany({
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({ posts });
    } catch (error) {
        console.error("Admin blog list error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const auth = await verifyAdmin();
        if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

        const body = await req.json();
        const { title, excerpt, content, image, tag, readTime, published } = body;

        if (!title || !excerpt || !content || !image || !tag) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const post = await prisma.blogPost.create({
            data: {
                title,
                excerpt,
                content,
                image,
                tag,
                readTime: readTime || "5 min read",
                published: published !== undefined ? published : true,
            },
        });

        return NextResponse.json({ post }, { status: 201 });
    } catch (error) {
        console.error("Admin blog create error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
