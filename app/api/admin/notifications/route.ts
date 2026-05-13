import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin-auth";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const auth = await verifyAdmin();
        if (auth.error) {
            return NextResponse.json({ error: auth.error }, { status: auth.status });
        }

        // Fetch recent orders
        const recentOrders = await prisma.order.findMany({
            take: 5,
            orderBy: { createdAt: "desc" },
            include: {
                user: {
                    select: { name: true }
                }
            }
        });

        // Fetch recent users
        const recentUsers = await prisma.user.findMany({
            take: 5,
            orderBy: { createdAt: "desc" },
            select: { id: true, name: true, createdAt: true }
        });

        // Format into a unified notification list
        const notifications = [
            ...recentOrders.map(order => ({
                id: `order-${order.id}`,
                type: 'ORDER',
                title: 'New Order Received',
                message: `${order.user?.name || 'A customer'} placed an order for ৳${order.totalAmount}`,
                time: order.createdAt,
                link: `/admin/orders`, // In a real app, this would be /admin/orders/${order.id}
                unread: true // Logic for unread could be more complex
            })),
            ...recentUsers.map(user => ({
                id: `user-${user.id}`,
                type: 'USER',
                title: 'New User Registered',
                message: `${user.name} joined the platform`,
                time: user.createdAt,
                link: `/admin/users`,
                unread: true
            }))
        ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 8);

        return NextResponse.json({ notifications });
    } catch (error) {
        console.error("Notifications API error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
