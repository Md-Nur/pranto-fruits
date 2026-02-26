import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/jwt-utils";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("auth-token")?.value;

        if (!token) {
            return NextResponse.json({ authenticated: false }, { status: 401 });
        }

        const payload = await verifyJwt(token);

        if (!payload || !payload.id) {
            return NextResponse.json({ authenticated: false }, { status: 401 });
        }

        // Fetch full user from DB to include saved address fields
        const user = await prisma.user.findUnique({
            where: { id: payload.id as number },
            select: {
                id: true,
                name: true,
                phone: true,
                role: true,
                address: true,
                city: true,
                zipCode: true,
            },
        });

        if (!user) {
            return NextResponse.json({ authenticated: false }, { status: 401 });
        }

        return NextResponse.json({
            authenticated: true,
            user,
        });
    } catch (error) {
        return NextResponse.json({ authenticated: false }, { status: 500 });
    }
}
