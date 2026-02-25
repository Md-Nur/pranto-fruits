import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(
    process.env.JWT_SECRET || "default_secret_for_development_only"
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
