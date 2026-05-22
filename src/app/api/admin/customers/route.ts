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

    const customers = await prisma.user.findMany({
      where: {
        role: "USER",
      },

      include: {
        orders: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    const formatted = customers.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      isBlocked: user.isBlocked,
      createdAt: user.createdAt,

      totalOrders: user.orders.length,

      totalSpent: user.orders.reduce(
        (sum, order) => sum + order.total,
        0
      ),
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch customers" },
      { status: 500 }
    );
  }
}