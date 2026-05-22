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

    const body = await req.json();

    const {
      fullName,
      phone,
      address,
      city,
      state,
      country,
      zipCode,
    } = body;

    const cart = await prisma.cart.findMany({
      where: {
        userId: user.id,
      },
      include: {
        product: true,
      },
    });

    if (!cart.length) {
      return NextResponse.json(
        { error: "Cart empty" },
        { status: 400 }
      );
    }

    const total = cart.reduce(
      (sum, item) =>
        sum + item.product.price * item.quantity,
      0
    );

    await prisma.address.create({
      data: {
        userId: user.id,
        fullName,
        phone,
        address,
        city,
        state,
        country,
        zipCode,
      },
    });

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        total,
        status: "PENDING",

        items: {
          create: cart.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },

      include: {
        items: true,
      },
    });

    await prisma.cart.deleteMany({
      where: {
        userId: user.id,
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Order creation failed" },
      { status: 500 }
    );
  }
}