import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const formData = await request.formData();

        const response = await fetch(
            `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`,
            {
                method: "POST",
                body: formData,
            }
        );

        const result = await response.json();

        if (result.success) {
            return NextResponse.json({
                url: result.data.url,
                display_url: result.data.display_url,
            });
        } else {
            console.error("ImgBB upload failed with result:", result);
            return NextResponse.json({ error: "ImgBB upload failed" }, { status: 500 });
        }
    } catch (error) {
        console.error("Upload route exception:", error);
        return NextResponse.json({ error: "Upload error" }, { status: 500 });
    }
}
