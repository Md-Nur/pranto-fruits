import prisma from "@/lib/prisma";
import ProductDetailClient from "./ProductDetailClient";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const product = await prisma.product.findUnique({
        where: { id: Number(id) },
        select: { name: true, description: true, images: true }
    });

    if (!product) {
        return {
            title: "Product Not Found",
        };
    }

    const firstImage = product.images?.[0] || '/images/placeholder.jpg';

    return {
        title: product.name,
        description: product.description?.substring(0, 160) || `Buy fresh ${product.name} at Village Organic Fruits.`,
        openGraph: {
            title: product.name,
            description: product.description?.substring(0, 160) || `Buy fresh ${product.name} at Village Organic Fruits.`,
            images: [firstImage],
        },
        twitter: {
            card: "summary_large_image",
            title: product.name,
            description: product.description?.substring(0, 160) || `Buy fresh ${product.name} at Village Organic Fruits.`,
            images: [firstImage],
        }
    };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const product = await prisma.product.findUnique({
        where: { id: Number(id) },
        include: { 
            variants: true,
            categoryRef: true
        }
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
