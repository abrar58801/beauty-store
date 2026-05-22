import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const brand = searchParams.get("brand") || "";
    const featured = searchParams.get("featured");

    const products = await prisma.product.findMany({
      where: {
        active: true,

        name: search
          ? {
              contains: search,
            }
          : undefined,

        categoryId: category || undefined,

        brandId: brand || undefined,

        featured:
          featured === "true"
            ? true
            : undefined,
      },

      include: {
        images: true,
        category: true,
        brand: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Products fetch failed" },
      { status: 500 }
    );
  }
}