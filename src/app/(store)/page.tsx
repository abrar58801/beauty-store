"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function HomePage() {
  const [featured, setFeatured] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  const [settings, setSettings] = useState({
    heroTitle: "",
    heroSubtitle: "",
    heroButtonText: "",
    heroButtonLink: "",
    heroBanner: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [featuredRes, categoriesRes, settingsRes] =
        await Promise.all([
          axios.get("/api/products/featured"),
          axios.get("/api/categories"),
          axios.get("/api/settings"),
        ]);

      setFeatured(featuredRes.data);
      setCategories(categoriesRes.data);
      setSettings(settingsRes.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main>
      {/* HERO */}
      <section className="bg-gradient-to-r from-pink-50 to-white">
        <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-pink-500 uppercase tracking-[0.3em] text-sm">
              Modern Luxury Cosmetics
            </p>

            <h1 className="text-5xl md:text-6xl font-bold mt-4 leading-tight">
              {settings.heroTitle ||
                "Luxury Beauty Collection"}
            </h1>

            <p className="text-gray-600 mt-6 text-lg">
              {settings.heroSubtitle ||
                "Discover premium skincare, cosmetics, and fragrances designed for modern beauty."}
            </p>

            <Link
              href={
                settings.heroButtonLink || "/products"
              }
              className="inline-block mt-8 bg-black text-white px-8 py-4 rounded-full"
            >
              {settings.heroButtonText ||
                "Shop Now"}
            </Link>
          </div>

          <div>
            {settings.heroBanner ? (
              <img
                src={settings.heroBanner}
                alt="Hero Banner"
                className="w-full rounded-3xl shadow-xl object-cover"
              />
            ) : (
              <div className="w-full h-[500px] bg-pink-100 rounded-3xl flex items-center justify-center text-gray-400">
                No Hero Banner
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <h2 className="text-5xl font-bold mb-12">
          Shop Categories
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-3xl shadow p-8 text-center"
            >
              <h3 className="text-2xl font-semibold">
                {cat.name}
              </h3>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      <section className="py-24 bg-pink-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-5xl font-bold mb-12">
            Featured Products
          </h2>

          <div className="grid md:grid-cols-4 gap-8">
            {featured.map((product) => (
              <Link
                href={`/products/${product.slug}`}
                key={product.id}
              >
                <div className="bg-white rounded-3xl shadow hover:shadow-xl transition p-4">
                  <img
                    src={product.images[0]?.url}
                    alt={product.name}
                    className="w-full h-72 object-cover rounded-2xl"
                  />

                  <h3 className="text-xl font-semibold mt-4">
                    {product.name}
                  </h3>

                  <p>{product.brand?.name}</p>

                  <p className="text-2xl font-bold mt-3">
                    ₹{product.price}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}