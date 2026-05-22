import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin";

export async function GET() {
    try {

        const admin = await isAdmin();

        if (!admin) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const products = await prisma.product.findMany({
            include: {
                category: true,
                brand: true,
                images: true,
                variants: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json(products);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch products" },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        const admin = await isAdmin();

        if (!admin) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }
        const body = await req.json();

        const {
            name,
            slug,
            description,
            shortDescription,
            price,
            comparePrice,
            sku,
            stock,
            featured,
            active,
            categoryId,
            brandId,
            images,
            variants,
        } = body;

        const product = await prisma.product.create({
            data: {
                name,
                slug,
                description,
                shortDescription,
                price,
                comparePrice,
                sku,
                stock,
                featured,
                active,
                categoryId,
                brandId,

                images: {
                    create: images.map((img: string) => ({
                        url: img,
                    })),
                },

                variants: {
                    create: variants.map((variant: any) => ({
                        name: variant.name,
                        value: variant.value,
                        price: variant.price,
                        stock: variant.stock,
                    })),
                },
            },

            include: {
                images: true,
                variants: true,
            },
        });

        return NextResponse.json(product);
    } catch (error) {
        console.log(error);

        return NextResponse.json(
            { error: "Failed to create product" },
            { status: 500 }
        );
    }
}