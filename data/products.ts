export interface ProductVariant {
    label: string;
    price: number;
}

export interface Product {
    id: number;
    name: string;
    category: string;
    basePrice: number;
    priceRange: string;
    description: string;
    image: string;
    variants: ProductVariant[];
    details: string[];
    isNew?: boolean;
}

export const products: Product[] = [
    {
        id: 1,
        name: "Rajshahi Himsagar Mango",
        category: "Mango",
        basePrice: 180,
        priceRange: "180 - 850",
        description: "Himsagar is a popular mango cultivar, originating from the state of West Bengal in India and Rajshahi in Bangladesh. Regarded as the king of mangoes, Himsagar is famous for its sweet aroma and lack of fiber.",
        image: "https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=1000&auto=format&fit=crop",
        variants: [
            { label: "1kg", price: 180 },
            { label: "5kg (Family Pack)", price: 850 },
            { label: "10kg (Bulk)", price: 1600 }
        ],
        details: [
            "100% Chemical Free",
            "Naturally Ripened",
            "Direct from Rajshahi Orchards",
            "Grade A Quality"
        ],
        isNew: true
    },
    {
        id: 2,
        name: "Premium Maryam Dates",
        category: "Dates",
        basePrice: 950,
        priceRange: "950 - 4500",
        description: "Maryam dates are known for their dark brown color, elongated shape, and unique sweetness. They are packed with essential nutrients and fiber, making them an excellent healthy snack.",
        image: "https://images.unsplash.com/photo-1614061811858-dde54a522f5e?q=80&w=1170&auto=format&fit=crop",
        variants: [
            { label: "500g", price: 950 },
            { label: "1kg", price: 1800 },
            { label: "5kg (Box)", price: 8500 }
        ],
        details: [
            "Imported Premium Quality",
            "Rich in Fiber & Potassium",
            "No Added Sugar",
            "Long Shelf Life"
        ],
        isNew: false
    },
    {
        id: 3,
        name: "Natural Khejur Gur (Liquid)",
        category: "Jaggery",
        basePrice: 450,
        priceRange: "450",
        description: "Himsagar is a popular mango cultivar, originating from the state of West Bengal in India and Rajshahi in Bangladesh. Regarded as the king of mangoes, Himsagar is famous for its sweet aroma and lack of fiber.",
        image: "https://images.unsplash.com/photo-1671871695722-b91911e9c072?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        variants: [
            { label: "1kg", price: 180 },
            { label: "5kg (Family Pack)", price: 850 },
            { label: "10kg (Bulk)", price: 1600 }
        ],
        details: [
            "100% Chemical Free",
            "Naturally Ripened",
            "Direct from Rajshahi Orchards",
            "Grade A Quality"
        ],
        isNew: true
    },
    {
        id: 4,
        name: "Amrapali Mango (Premium)",
        category: "Mango",
        basePrice: 150,
        priceRange: "150 - 700",
        description: "Himsagar is a popular mango cultivar, originating from the state of West Bengal in India and Rajshahi in Bangladesh. Regarded as the king of mangoes, Himsagar is famous for its sweet aroma and lack of fiber.",
        image: "https://images.unsplash.com/photo-1591073113125-e46713c829ed?q=80&w=500&auto=format&fit=crop",
        variants: [
            { label: "1kg", price: 180 },
            { label: "5kg (Family Pack)", price: 850 },
            { label: "10kg (Bulk)", price: 1600 }
        ],
        details: [
            "100% Chemical Free",
            "Naturally Ripened",
            "Direct from Rajshahi Orchards",
            "Grade A Quality"
        ],
        isNew: false
    },
    {
        id: 5,
        name: "Mixed Fruit Basket",
        category: "Baskets",
        basePrice: 2500,
        priceRange: "2500 - 5500",
        description: "Himsagar is a popular mango cultivar, originating from the state of West Bengal in India and Rajshahi in Bangladesh. Regarded as the king of mangoes, Himsagar is famous for its sweet aroma and lack of fiber.",
        image: "https://images.unsplash.com/photo-1629905707362-03cf1a9f6e2d?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        variants: [
            { label: "1kg", price: 180 },
            { label: "5kg (Family Pack)", price: 850 },
            { label: "10kg (Bulk)", price: 1600 }
        ],
        details: [
            "100% Chemical Free",
            "Naturally Ripened",
            "Direct from Rajshahi Orchards",
            "Grade A Quality"
        ],
        isNew: false
    },
    {
        id: 6,
        name: "Organic Sundarban Honey",
        category: "Honey",
        basePrice: 650,
        priceRange: "650 - 1200",
        description: "Himsagar is a popular mango cultivar, originating from the state of West Bengal in India and Rajshahi in Bangladesh. Regarded as the king of mangoes, Himsagar is famous for its sweet aroma and lack of fiber.",
        image: "https://plus.unsplash.com/premium_photo-1726880614839-faa6caa3b3d4?q=80&w=943&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        variants: [
            { label: "1kg", price: 180 },
            { label: "5kg (Family Pack)", price: 850 },
            { label: "10kg (Bulk)", price: 1600 }
        ],
        details: [
            "100% Chemical Free",
            "Naturally Ripened",
            "Direct from Rajshahi Orchards",
            "Grade A Quality"
        ],
        isNew: false
    }
];
