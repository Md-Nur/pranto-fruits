import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyJwt } from "@/lib/jwt";
import { cookies } from "next/headers";

export async function POST(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("auth-token")?.value;

        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const payload = await verifyJwt(token);
        if (!payload || !payload.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { totalAmount, paymentMethod, shippingInfo, orderItems } = await req.json();

        const order = await prisma.order.create({
            data: {
                userId: payload.id as number,
                totalAmount,
                paymentMethod,
                shippingInfo,
                orderItems,
            },
        });

        return NextResponse.json({ success: true, orderId: order.id }, { status: 201 });

    } catch (error) {
        console.error("Checkout error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
