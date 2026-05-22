"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function ReportsPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await axios.get("/api/admin/reports");
      setData(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  if (!data) {
    return (
      <div className="text-2xl font-semibold">
        Loading reports...
      </div>
    );
  }

  const cards = [
    {
      title: "Total Revenue",
      value: `₹${data.totalRevenue}`,
    },
    {
      title: "Total Orders",
      value: data.totalOrders,
    },
    {
      title: "Customers",
      value: data.totalCustomers,
    },
    {
      title: "Pending Orders",
      value: data.pendingOrders,
    },
    {
      title: "Paid Orders",
      value: data.paidOrders,
    },
    {
      title: "Cancelled Orders",
      value: data.cancelledOrders,
    },
  ];

  return (
    <div className="w-full">
      <h1 className="text-3xl md:text-4xl font-bold mb-10">
        Reports Dashboard
      </h1>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">
        {cards.map((card, i) => (
          <div
            key={i}
            className="bg-white rounded-3xl shadow p-6"
          >
            <p className="text-gray-500">
              {card.title}
            </p>

            <h2 className="text-3xl font-bold mt-3">
              {card.value}
            </h2>
          </div>
        ))}
      </div>

      {/* SALES CHART */}
      <div className="bg-white rounded-3xl shadow p-6 md:p-8 mb-10">
        <h2 className="text-2xl font-bold mb-6">
          Monthly Sales
        </h2>

        <div className="w-full h-[350px]">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <LineChart
              data={data.monthlySales}
            >
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="total"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* TOP PRODUCTS + LOW STOCK */}
      <div className="grid xl:grid-cols-2 gap-8 mb-10">
        <div className="bg-white rounded-3xl shadow p-6 md:p-8">
          <h2 className="text-2xl font-bold mb-6">
            Top Selling Products
          </h2>

          <div className="space-y-4">
            {data.topProducts.map(
              (product: any, i: number) => (
                <div
                  key={i}
                  className="flex justify-between border-b pb-3"
                >
                  <span>
                    {product.name}
                  </span>

                  <span className="font-semibold">
                    {product.quantity} sold
                  </span>
                </div>
              )
            )}
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow p-6 md:p-8">
          <h2 className="text-2xl font-bold mb-6">
            Low Stock Products
          </h2>

          <div className="space-y-4">
            {data.lowStockProducts.map(
              (product: any) => (
                <div
                  key={product.id}
                  className="flex justify-between border-b pb-3"
                >
                  <span>
                    {product.name}
                  </span>

                  <span className="text-red-500 font-semibold">
                    {product.stock} left
                  </span>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* TOP CUSTOMERS */}
      <div className="bg-white rounded-3xl shadow p-6 md:p-8">
        <h2 className="text-2xl font-bold mb-6">
          Top Customers
        </h2>

        <div className="space-y-4">
          {data.topCustomers.map(
            (customer: any, i: number) => (
              <div
                key={i}
                className="flex justify-between border-b pb-3"
              >
                <span>
                  {customer.name}
                </span>

                <span className="font-semibold">
                  ₹{customer.total}
                </span>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}