import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin-auth";
import prisma from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const auth = await verifyAdmin();
        if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

        const { id } = await params;
        const order = await prisma.order.findUnique({
            where: { id: parseInt(id) },
            include: {
                user: { select: { id: true, name: true, phone: true, email: true } },
            },
        });

        if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

        return NextResponse.json({ order });
    } catch (error) {
        console.error("Admin get order error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const auth = await verifyAdmin();
        if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

        const { id } = await params;
        const { status } = await req.json();

        const validStatuses = ["PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];
        if (!validStatuses.includes(status)) {
            return NextResponse.json({ error: "Invalid status" }, { status: 400 });
        }

        const order = await prisma.order.update({
            where: { id: parseInt(id) },
            data: { status },
            include: {
                user: { select: { id: true, name: true, phone: true } },
            },
        });

        return NextResponse.json({ order });
    } catch (error) {
        console.error("Admin update order error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
