import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin-auth";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        const auth = await verifyAdmin();
        if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

        const { searchParams } = new URL(req.url);
        const search = searchParams.get("search") || "";

        const where: any = {};
        if (search) {
            where.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { phone: { contains: search } },
            ];
        }

        const users = await prisma.user.findMany({
            where,
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                address: true,
                city: true,
                zipCode: true,
                createdAt: true,
                _count: { select: { orders: true } },
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({ users });
    } catch (error) {
        console.error("Admin users list error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
