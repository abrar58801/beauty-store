"use client";

import axios from "axios";
import { useEffect, useState } from "react";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const res = await axios.get("/api/orders");
    setOrders(res.data);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <h1 className="text-5xl font-bold mb-10">
        My Orders
      </h1>

      <div className="space-y-8">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-3xl shadow p-8"
          >
            <div className="flex justify-between mb-6">
              <span>{order.status}</span>
              <span className="font-bold">
                ₹{order.total}
              </span>
            </div>

            {order.items.map((item: any) => (
              <div key={item.id}>
                {item.product.name} × {item.quantity}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}