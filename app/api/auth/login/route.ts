import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signJwt } from "@/lib/jwt-utils";
import { cookies } from "next/headers";

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        const token = await signJwt({ id: user.id, email: user.email, role: user.role });

        if (token) {
            const cookieStore = await cookies();
            cookieStore.set("auth-token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                maxAge: 60 * 60 * 24, // 1 day
            });
        }

        return NextResponse.json({
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
        }, { status: 200 });

    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
