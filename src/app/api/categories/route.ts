import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      take: 6,
    });

    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json(
      { error: "Categories fetch failed" },
      { status: 500 }
    );
  }
}