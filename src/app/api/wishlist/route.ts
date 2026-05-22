import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/getUser";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json([]);
    }

    const wishlist = await prisma.wishlist.findMany({
      where: {
        userId: user.id,
      },

      include: {
        product: {
          include: {
            images: true,
            brand: true,
          },
        },
      },
    });

    return NextResponse.json(wishlist);
  } catch (error) {
    return NextResponse.json(
      { error: "Wishlist fetch failed" },
      { status: 500 }
    );
  }
}