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

        const brands = await prisma.brand.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json(brands);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch brands" },
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

        const { name, slug, logo } = body;

        const brand = await prisma.brand.create({
            data: {
                name,
                slug,
                logo,
            },
        });

        return NextResponse.json(brand);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to create brand" },
            { status: 500 }
        );
    }
}