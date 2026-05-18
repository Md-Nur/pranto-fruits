import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAdmin } from "@/lib/admin-auth";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const auth = await verifyAdmin();
    if (auth.error) {
        return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    try {
        const data = await request.json();
        const resolvedParams = await params;
        const id = parseInt(resolvedParams.id);
        const category = await prisma.category.update({
            where: { id },
            data: {
                name: data.name,
                slug: data.slug,
                image: data.image,
                description: data.description,
            }
        });
        return NextResponse.json(category);
    } catch (error) {
        return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const auth = await verifyAdmin();
    if (auth.error) {
        return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    try {
        const resolvedParams = await params;
        const id = parseInt(resolvedParams.id);
        await prisma.category.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Delete failed" }, { status: 500 });
    }
}
