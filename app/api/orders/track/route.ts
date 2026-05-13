import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const rawId = searchParams.get("id")?.trim();
        const phone = searchParams.get("phone")?.trim();

        if (!rawId) {
            return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
        }

        // Accept formats: PF-000042, PF000042, 42
        const numericId = parseInt(rawId.replace(/^PF-?/i, ""), 10);

        if (isNaN(numericId) || numericId <= 0) {
            return NextResponse.json({ error: "Invalid order ID format" }, { status: 400 });
        }

        const order = await prisma.order.findUnique({
            where: { id: numericId },
            include: {
                user: {
                    select: { name: true, phone: true },
                },
            },
        });

        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        // If a phone number is provided, verify it matches the order's shipping info or user
        if (phone) {
            const shipping = order.shippingInfo as any;
            const orderPhone = (shipping?.phone || "").replace(/\D/g, "");
            const userPhone = (order.user?.phone || "").replace(/\D/g, "");
            const inputPhone = phone.replace(/\D/g, "");

            if (orderPhone !== inputPhone && userPhone !== inputPhone) {
                return NextResponse.json({ error: "Phone number does not match this order" }, { status: 403 });
            }
        }

        // Return a sanitized order object (hide sensitive user data)
        return NextResponse.json({
            order: {
                id: order.id,
                status: order.status,
                totalAmount: order.totalAmount,
                paymentMethod: order.paymentMethod,
                createdAt: order.createdAt,
                updatedAt: order.updatedAt,
                shippingInfo: {
                    name: (order.shippingInfo as any)?.name,
                    city: (order.shippingInfo as any)?.city,
                    address: (order.shippingInfo as any)?.address,
                    phone: (order.shippingInfo as any)?.phone,
                },
                orderItems: order.orderItems,
            },
        });
    } catch (error) {
        console.error("Error tracking order:", error);
        return NextResponse.json({ error: "Failed to track order" }, { status: 500 });
    }
}
