import Link from "next/link";
import {
  Package,
  ShoppingCart,
  Tags,
  BadgeIndianRupee,
  Users,
  Layers,
} from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function AdminPage() {
  const [
    productCount,
    orderCount,
    categoryCount,
    brandCount,
    userCount,
    revenueData,
    recentOrders,
    recentUsers,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.category.count(),
    prisma.brand.count(),
    prisma.user.count(),

    prisma.order.aggregate({
      _sum: {
        total: true,
      },
      where: {
        status: "PAID",
      },
    }),

    prisma.order.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: true,
      },
    }),

    prisma.user.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
    }),
  ]);

  const revenue = revenueData._sum.total || 0;

  const stats = [
    {
      title: "Total Products",
      value: productCount,
      icon: Package,
      href: "/admin/products",
    },
    {
      title: "Orders",
      value: orderCount,
      icon: ShoppingCart,
      href: "/admin/orders",
    },
    {
      title: "Categories",
      value: categoryCount,
      icon: Layers,
      href: "/admin/categories",
    },
    {
      title: "Brands",
      value: brandCount,
      icon: Tags,
      href: "/admin/brands",
    },
    {
      title: "Revenue",
      value: `₹${revenue}`,
      icon: BadgeIndianRupee,
      href: "/admin/orders",
    },
    {
      title: "Customers",
      value: userCount,
      icon: Users,
      href: "/admin/users",
    },
  ];

  return (
    <div>
      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold">
          Dashboard
        </h1>

        <p className="text-gray-500 mt-2">
          Welcome to Beauty Luxe Admin Panel
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.title}
              href={item.href}
              className="bg-white rounded-3xl shadow p-6 hover:shadow-xl transition"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">
                    {item.title}
                  </p>

                  <h2 className="text-3xl font-bold mt-3">
                    {item.value}
                  </h2>
                </div>

                <div className="w-14 h-14 bg-black text-white rounded-2xl flex items-center justify-center">
                  <Icon size={26} />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* QUICK ACTIONS */}
      <div className="mt-12 bg-white rounded-3xl shadow p-8">
        <h2 className="text-2xl font-bold mb-6">
          Quick Actions
        </h2>

        <div className="flex flex-wrap gap-4">
          <Link
            href="/admin/products/create"
            className="bg-black text-white px-6 py-3 rounded-xl"
          >
            Add Product
          </Link>

          <Link
            href="/admin/categories"
            className="border px-6 py-3 rounded-xl"
          >
            Add Category
          </Link>

          <Link
            href="/admin/brands"
            className="border px-6 py-3 rounded-xl"
          >
            Add Brand
          </Link>

          <Link
            href="/admin/orders"
            className="border px-6 py-3 rounded-xl"
          >
            View Orders
          </Link>
        </div>
      </div>

      {/* RECENT ORDERS */}
      <div className="mt-12 bg-white rounded-3xl shadow p-8">
        <h2 className="text-2xl font-bold mb-6">
          Recent Orders
        </h2>

        <div className="space-y-4">
          {recentOrders.length === 0 ? (
            <p>No orders found</p>
          ) : (
            recentOrders.map((order) => (
              <div
                key={order.id}
                className="border rounded-2xl p-4 flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">
                    {order.user?.name || "Guest"}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {order.user?.email}
                  </p>
                </div>

                <div className="font-bold">
                  ₹{order.total}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* RECENT USERS */}
      <div className="mt-12 bg-white rounded-3xl shadow p-8">
        <h2 className="text-2xl font-bold mb-6">
          Recent Customers
        </h2>

        <div className="space-y-4">
          {recentUsers.length === 0 ? (
            <p>No users found</p>
          ) : (
            recentUsers.map((user) => (
              <div
                key={user.id}
                className="border rounded-2xl p-4"
              >
                <p className="font-semibold">
                  {user.name}
                </p>

                <p className="text-gray-500 text-sm">
                  {user.email}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}