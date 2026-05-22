"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);

  const [filters, setFilters] = useState({
    search: "",
    category: "",
    brand: "",
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchInitialData = async () => {
    const catRes = await axios.get("/api/categories");
    const brandRes = await axios.get("/api/brands");

    setCategories(catRes.data);
    setBrands(brandRes.data);

    fetchProducts();
  };

  const fetchProducts = async () => {
    const res = await axios.get("/api/products", {
      params: filters,
    });

    setProducts(res.data);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <h1 className="text-5xl font-bold mb-10">
        Premium Cosmetics
      </h1>

      <div className="grid md:grid-cols-3 gap-4 mb-12">
        <input
          placeholder="Search products..."
          className="border p-4 rounded-xl"
          onChange={(e) =>
            setFilters({
              ...filters,
              search: e.target.value,
            })
          }
        />

        <select
          className="border p-4 rounded-xl"
          onChange={(e) =>
            setFilters({
              ...filters,
              category: e.target.value,
            })
          }
        >
          <option value="">All Categories</option>

          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <select
          className="border p-4 rounded-xl"
          onChange={(e) =>
            setFilters({
              ...filters,
              brand: e.target.value,
            })
          }
        >
          <option value="">All Brands</option>

          {brands.map((brand) => (
            <option key={brand.id} value={brand.id}>
              {brand.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid md:grid-cols-4 gap-8">
        {products.map((product) => (
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

              <h2 className="text-xl font-semibold mt-4">
                {product.name}
              </h2>

              <p className="text-gray-500">
                {product.brand.name}
              </p>

              <p className="text-2xl font-bold mt-2">
                ₹{product.price}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}