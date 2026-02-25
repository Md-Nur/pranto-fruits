import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/jwt-utils";

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("auth-token")?.value;

        if (!token) {
            return NextResponse.json({ authenticated: false }, { status: 401 });
        }

        const payload = await verifyJwt(token);

        if (!payload) {
            return NextResponse.json({ authenticated: false }, { status: 401 });
        }

        return NextResponse.json({
            authenticated: true,
            user: payload
        });
    } catch (error) {
        return NextResponse.json({ authenticated: false }, { status: 500 });
    }
}
