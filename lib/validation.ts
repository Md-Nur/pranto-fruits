import { z } from "zod";

// User Registration Schema
export const registerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    phone: z.string().regex(/^(\+88)?01[3-9]\d{8}$/, "Invalid Bangladeshi phone number"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

// User Login Schema
export const loginSchema = z.object({
    phone: z.string().regex(/^(\+88)?01[3-9]\d{8}$/, "Invalid phone number"),
    password: z.string().min(1, "Password is required"),
});

// Product Schema
export const productSchema = z.object({
    name: z.string().min(2, "Name is required"),
    categoryId: z.union([z.number(), z.string().transform(v => parseInt(v))]),
    basePrice: z.union([z.number(), z.string().transform(v => parseFloat(v))]),
    priceRange: z.string().optional(),
    description: z.string().min(10, "Description must be at least 10 characters"),
    image: z.string().url().optional().or(z.literal("")),
    images: z.array(z.string().url()).optional().default([]),
    details: z.array(z.string()).optional().default([]),
    isNew: z.boolean().optional().default(false),
    variants: z.array(z.object({
        label: z.string().min(1),
        price: z.union([z.number(), z.string().transform(v => parseFloat(v))]),
    })).optional().default([]),
});

// Order Schema (Basic)
export const orderSchema = z.object({
    shippingInfo: z.object({
        name: z.string().min(2),
        phone: z.string().regex(/^(\+88)?01[3-9]\d{8}$/),
        address: z.string().min(5),
        city: z.string().min(2),
        area: z.string().optional(),
    }),
    paymentMethod: z.enum(["cod", "bkash", "card"]),
    totalAmount: z.number().positive(),
    orderItems: z.array(z.any()),
});
