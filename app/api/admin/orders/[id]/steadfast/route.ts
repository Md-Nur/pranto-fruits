import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin-auth";
import prisma from "@/lib/prisma";
import { createSteadfastOrder, SteadfastOrderPayload } from "@/lib/steadfast";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const auth = await verifyAdmin();
        if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

        const { id } = await params;
        const orderId = parseInt(id);

        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: { user: true },
        });

        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        // Parse shipping info
        const shippingInfo = typeof order.shippingInfo === "string" 
            ? JSON.parse(order.shippingInfo) 
            : order.shippingInfo;

        const steadfastPayload: SteadfastOrderPayload = {
            invoice: order.id.toString(),
            recipient_name: order.user?.name || shippingInfo.name || "Customer",
            recipient_phone: order.user?.phone || shippingInfo.phone || "",
            recipient_address: `${shippingInfo.address || ""}, ${shippingInfo.city || ""} ${shippingInfo.zipCode || ""}`.trim(),
            // Only collect COD if payment method is 'cod' and status is not PAID
            cod_amount: order.paymentMethod === 'cod' && order.status !== 'PAID' ? order.totalAmount : 0,
            note: "Handle with care. Perishable fruits.",
        };

        if (!steadfastPayload.recipient_phone || steadfastPayload.recipient_phone.length < 11) {
             return NextResponse.json({ error: "A valid 11-digit phone number is required for Steadfast." }, { status: 400 });
        }

        // Call Steadfast API
        const steadfastResponse = await createSteadfastOrder(steadfastPayload);

        // Usually steadfast returns something like { status: 200, message: "...", consignment: { consignment_id, tracking_code } }
        // Let's assume the successful response contains consignment details.
        
        if (steadfastResponse && steadfastResponse.status === 200 && steadfastResponse.consignment) {
             const newShippingInfo = {
                 ...shippingInfo,
                 steadfastTrackingCode: steadfastResponse.consignment.tracking_code,
                 steadfastConsignmentId: steadfastResponse.consignment.consignment_id,
             };

             await prisma.order.update({
                 where: { id: orderId },
                 data: { shippingInfo: newShippingInfo }
             });

             return NextResponse.json({ success: true, trackingCode: steadfastResponse.consignment.tracking_code });
        } else {
             return NextResponse.json({ error: "Steadfast API did not return consignment details", details: steadfastResponse }, { status: 400 });
        }
        
    } catch (error: any) {
        console.error("Steadfast API error:", error);
        return NextResponse.json({ error: error.message || "Failed to push to Steadfast" }, { status: 500 });
    }
}
