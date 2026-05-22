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

    const [
      users,
      orders,
      products,
      orderItems,
    ] = await Promise.all([
      prisma.user.count({
        where: {
          role: "USER",
        },
      }),

      prisma.order.findMany({
        include: {
          items: {
            include: {
              product: true,
            },
          },
          user: true,
        },
      }),

      prisma.product.findMany(),

      prisma.orderItem.findMany({
        include: {
          product: true,
        },
      }),
    ]);

    const totalRevenue = orders.reduce(
      (sum, order) => sum + order.total,
      0
    );

    const pendingOrders = orders.filter(
      (o) => o.status === "PENDING"
    ).length;

    const paidOrders = orders.filter(
      (o) => o.status === "PAID"
    ).length;

    const cancelledOrders = orders.filter(
      (o) => o.status === "CANCELLED"
    ).length;

    const lowStockProducts = products.filter(
      (p) => p.stock <= 10
    );

    // TOP PRODUCTS
    const productSalesMap: any = {};

    orderItems.forEach((item) => {
      if (!productSalesMap[item.productId]) {
        productSalesMap[item.productId] = {
          name: item.product.name,
          quantity: 0,
        };
      }

      productSalesMap[item.productId].quantity +=
        item.quantity;
    });

    const topProducts = Object.values(
      productSalesMap
    )
      .sort(
        (a: any, b: any) =>
          b.quantity - a.quantity
      )
      .slice(0, 5);

    // TOP CUSTOMERS
    const customerSpendMap: any = {};

    orders.forEach((order) => {
      if (!customerSpendMap[order.userId]) {
        customerSpendMap[order.userId] = {
          name:
            order.user?.name ||
            order.user?.email,
          total: 0,
        };
      }

      customerSpendMap[order.userId].total +=
        order.total;
    });

    const topCustomers = Object.values(
      customerSpendMap
    )
      .sort(
        (a: any, b: any) =>
          b.total - a.total
      )
      .slice(0, 5);

    // MONTHLY SALES
    const monthlySalesMap: any = {};

    orders.forEach((order) => {
      const month = new Date(
        order.createdAt
      ).toLocaleString("default", {
        month: "short",
      });

      if (!monthlySalesMap[month]) {
        monthlySalesMap[month] = 0;
      }

      monthlySalesMap[month] += order.total;
    });

    const monthlySales = Object.entries(
      monthlySalesMap
    ).map(([month, total]) => ({
      month,
      total,
    }));

    return NextResponse.json({
      totalRevenue,
      totalOrders: orders.length,
      totalCustomers: users,

      pendingOrders,
      paidOrders,
      cancelledOrders,

      lowStockProducts,
      topProducts,
      topCustomers,
      monthlySales,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to load reports",
      },
      { status: 500 }
    );
  }
}