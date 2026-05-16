import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/jwt-utils";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const rawId = searchParams.get("id")?.trim();
        const phone = searchParams.get("phone")?.trim();

        if (!rawId) {
            return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
        }

        // Accept formats: #ORD-1750, ORD1750, #1750, 1750, PF-000042
        const numericId = parseInt(rawId.replace(/^(#?ORD-?|PF-?|#)/i, ""), 10);

        if (isNaN(numericId) || numericId <= 0) {
            return NextResponse.json({ error: "Invalid order ID format" }, { status: 400 });
        }

        const order = await prisma.order.findUnique({
            where: { id: numericId },
            include: {
                user: {
                    select: { id: true, name: true, phone: true },
                },
            },
        });

        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        // --- SECURITY CHECK ---
        // Check if the current user is the owner
        const cookieStore = await cookies();
        const token = cookieStore.get("auth-token")?.value;
        let isOwner = false;

        if (token) {
            try {
                const payload = await verifyJwt(token);
                if (payload && payload.id === order.userId) {
                    isOwner = true;
                }
            } catch (err) {
                // Invalid token, treat as guest
            }
        }

        // If not owner, mandatory phone verification
        if (!isOwner) {
            if (!phone) {
                // Return 403 to trigger phone input on frontend
                return NextResponse.json({ error: "Verification required" }, { status: 403 });
            }

            const shipping = order.shippingInfo as any;
            const orderPhone = (shipping?.phone || "").replace(/\D/g, "");
            const userPhone = (order.user?.phone || "").replace(/\D/g, "");
            const inputPhone = phone.replace(/\D/g, "");

            // Allow matching either the shipping phone or the user account phone
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
