import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/getUser";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json([]);
    }

    const cart = await prisma.cart.findMany({
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

    return NextResponse.json(cart);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch cart" },
      { status: 500 }
    );
  }
}