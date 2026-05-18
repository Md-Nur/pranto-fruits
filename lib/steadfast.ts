export interface SteadfastOrderPayload {
    invoice: string;
    recipient_name: string;
    recipient_phone: string;
    recipient_address: string;
    cod_amount: number;
    note?: string;
}

export async function createSteadfastOrder(payload: SteadfastOrderPayload) {
    const API_KEY = process.env.STEADFAST_API_KEY;
    const SECRET_KEY = process.env.STEADFAST_SECRET_KEY;
    const BASE_URL = process.env.STEADFAST_BASE_URL || "https://portal.packzy.com/api/v1";

    if (!API_KEY || !SECRET_KEY) {
        throw new Error("Steadfast API credentials are not configured.");
    }

    const response = await fetch(`${BASE_URL}/create_order`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Api-Key": API_KEY,
            "Secret-Key": SECRET_KEY,
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Steadfast API Error:", errorText);
        throw new Error(`Steadfast API returned ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return data;
}
