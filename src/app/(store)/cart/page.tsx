"use client";

import axios from "axios";
import { useEffect, useState } from "react";

export default function CartPage() {
  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    const res = await axios.get("/api/cart");
    setCart(res.data);
  };

  const updateQuantity = async (
    cartId: string,
    quantity: number
  ) => {
    if (quantity < 1) return;

    await axios.patch("/api/cart/update", {
      cartId,
      quantity,
    });

    fetchCart();
  };

  const removeItem = async (cartId: string) => {
    await axios.delete("/api/cart/remove", {
      data: { cartId },
    });

    fetchCart();
  };

  const total = cart.reduce(
    (sum, item) =>
      sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <h1 className="text-5xl font-bold mb-12">
        Shopping Cart
      </h1>

      {cart.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          Your cart is empty
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-10">
          <div className="md:col-span-2 space-y-6">
            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl shadow p-6 flex justify-between items-center"
              >
                <div>
                  <h2 className="text-2xl font-semibold">
                    {item.product.name}
                  </h2>

                  <p className="text-gray-500">
                    {item.product.brand.name}
                  </p>

                  <p className="text-xl font-bold mt-3">
                    ₹{item.product.price}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.id,
                          item.quantity - 1
                        )
                      }
                      className="w-10 h-10 rounded-full border"
                    >
                      -
                    </button>

                    <span className="text-lg font-semibold">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        updateQuantity(
                          item.id,
                          item.quantity + 1
                        )
                      }
                      className="w-10 h-10 rounded-full border"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-3xl shadow p-8 h-fit">
            <h2 className="text-2xl font-bold mb-6">
              Order Summary
            </h2>

            <div className="flex justify-between mb-4">
              <span>Total</span>
              <span className="font-bold text-2xl">
                ₹{total}
              </span>
            </div>

            <a
              href="/checkout"
              className="block text-center bg-black text-white py-4 rounded-full mt-8"
            >
              Proceed to Checkout
            </a>
          </div>
        </div>
      )}
    </div>
  );
}