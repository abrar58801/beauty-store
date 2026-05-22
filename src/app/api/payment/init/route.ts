import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { razorpay } from "@/lib/razorpay";
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
    });

    const razorOrder = await razorpay.orders.create({
      amount: total * 100,
      currency: "INR",
      receipt: order.id,
    });

    await prisma.order.update({
      where: {
        id: order.id,
      },
      data: {
        razorpayOrderId: razorOrder.id,
      },
    });

    return NextResponse.json({
      razorOrder,
      orderId: order.id,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Payment init failed" },
      { status: 500 }
    );
  }
}