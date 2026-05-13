import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signJwt } from "@/lib/jwt-utils";
import { cookies } from "next/headers";

import { registerSchema } from "@/lib/validation";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
    try {
        // Rate limiting: 5 requests per 15 minutes per IP
        const ip = req.headers.get("x-forwarded-for") || "unknown";
        const rl = rateLimit(ip, 5, 15 * 60 * 1000);
        if (!rl.success) {
            return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
        }

        const body = await req.json();
        const validation = registerSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ 
                error: validation.error.issues[0].message 
            }, { status: 400 });
        }

        const { name, phone, password } = validation.data;

        const existingUser = await prisma.user.findUnique({
            where: { phone },
        });

        if (existingUser) {
            return NextResponse.json({ error: "Phone number already registered" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                phone,
                password: hashedPassword,
            },
        });

        const token = await signJwt({ id: user.id, phone: user.phone, role: user.role });

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
            user: { id: user.id, name: user.name, phone: user.phone, role: user.role }
        }, { status: 201 });

    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
