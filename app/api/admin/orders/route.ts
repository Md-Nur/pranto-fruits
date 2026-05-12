import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin-auth";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        const auth = await verifyAdmin();
        if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

        const { searchParams } = new URL(req.url);
        const status = searchParams.get("status") || "";

        const where: any = {};
        if (status) {
            where.status = status;
        }

        const orders = await prisma.order.findMany({
            where,
            include: {
                user: { select: { id: true, name: true, phone: true } },
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({ orders });
    } catch (error) {
        console.error("Admin orders list error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
