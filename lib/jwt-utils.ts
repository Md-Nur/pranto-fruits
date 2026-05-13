import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET && process.env.NODE_ENV === "production") {
    throw new Error("JWT_SECRET is not set in production environment!");
}

const secret = new TextEncoder().encode(
    JWT_SECRET || "dev_secret_only_for_local_use_never_use_in_prod"
);

export async function signJwt(payload: any) {
    try {
        const token = await new SignJWT(payload)
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("1d")
            .sign(secret);
        return token;
    } catch (error) {
        console.error("Error signing JWT:", error);
        return null;
    }
}

export async function verifyJwt(token: string) {
    try {
        const { payload } = await jwtVerify(token, secret);
        return payload;
    } catch (error) {
        console.error("Error verifying JWT:", error);
        return null;
    }
}
