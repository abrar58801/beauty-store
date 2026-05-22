import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: {
        active: true,
        featured: true,
      },

      include: {
        images: true,
        brand: true,
      },

      take: 8,
    });

    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { error: "Featured fetch failed" },
      { status: 500 }
    );
  }
}