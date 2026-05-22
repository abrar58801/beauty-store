"use client";

import axios from "axios";
import { useEffect, useState } from "react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const res = await axios.get("/api/admin/orders");
    setOrders(res.data);
  };

  const updateStatus = async (
    orderId: string,
    status: string
  ) => {
    await axios.patch("/api/admin/orders/update", {
      orderId,
      status,
    });

    fetchOrders();
  };

  return (
    <div>
      <h1 className="text-4xl font-bold mb-10">
        Manage Orders
      </h1>

      <div className="space-y-8">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-3xl shadow p-8"
          >
            <div className="flex justify-between mb-6 gap-3">
              <div>
                <p className="font-semibold">
                  {order.user.email}
                </p>

                <p>₹{order.total}</p>
              </div>

              <select
                value={order.status}
                onChange={(e) =>
                  updateStatus(
                    order.id,
                    e.target.value
                  )
                }
                className="border p-3 rounded-xl"
              >
                <option>PENDING</option>
                <option>PAID</option>
                <option>SHIPPED</option>
                <option>DELIVERED</option>
                <option>CANCELLED</option>
              </select>
            </div>

            <div className="space-y-2">
              {order.items.map((item: any) => (
                <div key={item.id}>
                  {item.product.name} × {item.quantity}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}