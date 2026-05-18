import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/jwt-utils";

export async function verifyAdmin() {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) {
        return { error: "Unauthorized", status: 401, user: null };
    }

    const payload = await verifyJwt(token);

    if (!payload || !payload.id) {
        return { error: "Invalid token", status: 401, user: null };
    }

    if (payload.role !== "ADMIN") {
        return { error: "Forbidden: Admin access required", status: 403, user: null };
    }

    return { 
        error: null, 
        status: 200, 
        user: {
            id: payload.id as number,
            phone: payload.phone as string,
            role: payload.role as string,
        }
    };
}
