import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/jwt-utils";
import prisma from "@/lib/prisma";

export async function PATCH(req: Request) {
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

        const { address, city, zipCode } = await req.json();

        await prisma.user.update({
            where: { id: payload.id as number },
            data: {
                ...(address !== undefined && { address }),
                ...(city !== undefined && { city }),
                ...(zipCode !== undefined && { zipCode }),
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Profile update error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
