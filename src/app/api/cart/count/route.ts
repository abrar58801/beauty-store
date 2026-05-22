import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({
      count: 0,
    });
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!user) {
    return NextResponse.json({
      count: 0,
    });
  }

  const cartItems = await prisma.cart.findMany({
    where: {
      userId: user.id,
    },
  });

  const count = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return NextResponse.json({
    count,
  });
}