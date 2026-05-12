import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin-auth";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const auth = await verifyAdmin();
        if (auth.error) {
            return NextResponse.json({ error: auth.error }, { status: auth.status });
        }

        const [totalProducts, totalOrders, totalUsers, revenueResult, ordersByStatus, recentOrders] = await Promise.all([
            prisma.product.count(),
            prisma.order.count(),
            prisma.user.count(),
            prisma.order.aggregate({
                _sum: { totalAmount: true },
                where: { status: { not: "CANCELLED" } },
            }),
            prisma.order.groupBy({
                by: ["status"],
                _count: { id: true },
            }),
            prisma.order.findMany({
                take: 10,
                orderBy: { createdAt: "desc" },
                include: {
                    user: {
                        select: { id: true, name: true, phone: true },
                    },
                },
            }),
        ]);

        const statusMap: Record<string, number> = {};
        ordersByStatus.forEach((item) => {
            statusMap[item.status] = item._count.id;
        });

        return NextResponse.json({
            stats: {
                totalProducts,
                totalOrders,
                totalUsers,
                totalRevenue: revenueResult._sum.totalAmount || 0,
            },
            ordersByStatus: statusMap,
            recentOrders,
        });
    } catch (error) {
        console.error("Admin stats error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
