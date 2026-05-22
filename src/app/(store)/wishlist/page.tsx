"use client";

import axios from "axios";
import { useEffect, useState } from "react";

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<any[]>([]);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    const res = await axios.get("/api/wishlist");
    setWishlist(res.data);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-20">
      <h1 className="text-5xl font-bold mb-10">
        Wishlist
      </h1>

      <div className="grid md:grid-cols-3 gap-8">
        {wishlist.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl shadow p-6"
          >
            <h2 className="text-xl font-bold">
              {item.product.name}
            </h2>

            <p>{item.product.brand.name}</p>

            <p className="text-2xl font-bold mt-4">
              ₹{item.product.price}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}