import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { companyName, contactPerson, email, phone, details } = body;

        if (!companyName || !contactPerson || !email || !phone || !details) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }

        const inquiry = await prisma.bulkInquiry.create({
            data: {
                companyName,
                contactPerson,
                email,
                phone,
                details,
            },
        });

        return NextResponse.json({ success: true, inquiry });
    } catch (error) {
        console.error("Bulk inquiry submission error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
