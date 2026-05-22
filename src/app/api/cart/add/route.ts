import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/getUser";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { productId } = await req.json();

    const existing = await prisma.cart.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId,
        },
      },
    });

    if (existing) {
      await prisma.cart.update({
        where: {
          id: existing.id,
        },
        data: {
          quantity: existing.quantity + 1,
        },
      });
    } else {
      await prisma.cart.create({
        data: {
          userId: user.id,
          productId,
          quantity: 1,
        },
      });
    }

    return NextResponse.json({
      message: "Added to cart",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Cart failed" },
      { status: 500 }
    );
  }
}