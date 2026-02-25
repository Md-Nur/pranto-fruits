import prisma from "@/lib/prisma";
import ProductDetailClient from "./ProductDetailClient";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const product = await prisma.product.findUnique({
        where: { id: Number(id) },
        include: { variants: true }
    });

    if (!product) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h1 className="text-2xl font-bold text-organic-green">Product not found</h1>
            </div>
        );
    }

    return <ProductDetailClient product={product} />;
}
