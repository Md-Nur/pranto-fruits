import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin-auth";
import prisma from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const auth = await verifyAdmin();
        if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

        const { id } = await params;
        const user = await prisma.user.findUnique({
            where: { id: parseInt(id) },
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
                updatedAt: true,
                orders: {
                    orderBy: { createdAt: "desc" },
                    take: 20,
                },
            },
        });

        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        return NextResponse.json({ user });
    } catch (error) {
        console.error("Admin get user error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
import bcrypt from "bcryptjs";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const auth = await verifyAdmin();
        if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

        const { id } = await params;
        const body = await req.json();
        const { role, name, email, password } = body;

        const data: any = {};
        if (role && ["USER", "ADMIN"].includes(role)) data.role = role;
        if (name) data.name = name;
        if (email !== undefined) data.email = email || null;
        if (password) {
            data.password = await bcrypt.hash(password, 10);
        }

        const user = await prisma.user.update({
            where: { id: parseInt(id) },
            data,
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                createdAt: true,
            },
        });

        return NextResponse.json({ user });
    } catch (error) {
        console.error("Admin update user error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const auth = await verifyAdmin();
        if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

        const { id } = await params;
        const userId = parseInt(id);

        // Prevent self-deletion
        if (auth.user && auth.user.id === userId) {
            return NextResponse.json({ error: "Cannot delete your own account" }, { status: 400 });
        }

        await prisma.user.delete({ where: { id: userId } });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Admin delete user error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
