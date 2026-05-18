import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyJwt } from "@/lib/jwt-utils";
import { cookies } from "next/headers";
import { orderSchema } from "@/lib/validation";

export async function POST(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("auth-token")?.value;

        let userId: number | null = null;

        if (token) {
            const payload = await verifyJwt(token);
            if (payload && payload.id) {
                userId = payload.id as number;
            }
        }

        const body = await req.json();
        const validation = orderSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ 
                error: validation.error.issues[0].message 
            }, { status: 400 });
        }

        const { totalAmount, paymentMethod, paymentDetails, shippingInfo, orderItems } = validation.data;

        const order = await prisma.order.create({
            data: {
                ...(userId ? { userId } : {}),
                totalAmount,
                paymentMethod,
                paymentDetails: paymentDetails || undefined,
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
