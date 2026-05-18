import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin-auth";

export async function GET() {
    try {
        // Verify admin authentication
        const auth = await verifyAdmin();
        if (auth.error) {
            return NextResponse.json({ error: auth.error }, { status: auth.status });
        }

        const API_KEY = process.env.STEADFAST_API_KEY;
        const SECRET_KEY = process.env.STEADFAST_SECRET_KEY;
        const BASE_URL = process.env.STEADFAST_BASE_URL || "https://portal.packzy.com/api/v1";

        if (!API_KEY || !SECRET_KEY) {
            return NextResponse.json({ 
                success: false, 
                error: "Steadfast API credentials are not configured in .env file.",
                configured: false 
            }, { status: 200 }); // Return 200 to let frontend display the "not configured" state gracefully
        }

        // Call Steadfast get_balance API
        const response = await fetch(`${BASE_URL}/get_balance`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Api-Key": API_KEY,
                "Secret-Key": SECRET_KEY,
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            return NextResponse.json({ 
                success: false, 
                error: `Steadfast API returned ${response.status}: ${errorText}`,
                configured: true
            }, { status: 200 }); // Return 200 to let frontend handle API errors gracefully
        }

        const data = await response.json();
        return NextResponse.json({
            success: true,
            configured: true,
            balance: data.current_balance ?? 0,
            status: data.status,
            apiUrl: BASE_URL,
            apiKeyMasked: `${API_KEY.slice(0, 4)}...${API_KEY.slice(-4)}`
        });
    } catch (error: any) {
        console.error("Failed to fetch Steadfast balance:", error);
        return NextResponse.json({ 
            success: false, 
            error: error.message || "An error occurred while connecting to Steadfast API.",
            configured: true 
        }, { status: 200 }); // Return 200 with error details for graceful client-side rendering
    }
}
