"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [products, setProducts] = useState<any[]>([]);
  const [category, setCategory] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const { slug } = await params;

    try {
      const res = await axios.get(
        `/api/collections/${slug}`
      );

      setProducts(res.data.products);
      setCategory(res.data.category);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20">
        Loading...
      </div>
    );
  }

  return (
    <main className="bg-gradient-to-b from-pink-50 to-white min-h-screen">
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <p className="text-pink-500 uppercase tracking-[0.3em] text-sm">
            Collection
          </p>

          <h1 className="text-5xl font-bold mt-4 capitalize">
            {category?.name}
          </h1>

          <p className="text-gray-600 mt-4">
            Discover premium {category?.name} products.
          </p>
        </div>

        {products.length === 0 ? (
          <div className="text-center text-gray-500">
            No products found
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="bg-white rounded-3xl shadow hover:shadow-xl transition overflow-hidden"
              >
                <img
                  src={
                    product.images?.[0]?.url ||
                    "/placeholder.png"
                  }
                  alt={product.name}
                  className="w-full h-72 object-cover"
                />

                <div className="p-5">
                  <p className="text-sm text-gray-500">
                    {product.brand?.name}
                  </p>

                  <h2 className="text-xl font-bold mt-2">
                    {product.name}
                  </h2>

                  <p className="text-2xl font-bold mt-4">
                    ₹{product.price}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}