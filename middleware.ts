import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_only_for_local_use_never_use_in_prod";
const secret = new TextEncoder().encode(JWT_SECRET);

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 1. Protect Admin Routes
    if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
        const token = request.cookies.get("auth-token")?.value;

        if (!token) {
            return NextResponse.redirect(new URL("/login", request.url));
        }

        try {
            const { payload } = await jwtVerify(token, secret);
            
            if (payload.role !== "ADMIN") {
                return NextResponse.redirect(new URL("/", request.url));
            }
        } catch (error) {
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }

    // 2. Protect API Admin Routes
    if (pathname.startsWith("/api/admin")) {
        const token = request.cookies.get("auth-token")?.value;

        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        try {
            const { payload } = await jwtVerify(token, secret);
            if (payload.role !== "ADMIN") {
                return NextResponse.json({ error: "Forbidden" }, { status: 403 });
            }
        } catch (error) {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*", "/api/admin/:path*"],
};
