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

        const categories = await prisma.category.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json(categories);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch categories" },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const admin = await isAdmin();

        if (!admin) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { name, slug, image } = body;

        const category = await prisma.category.create({
            data: {
                name,
                slug,
                image,
            },
        });

        return NextResponse.json(category);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to create category" },
            { status: 500 }
        );
    }
}