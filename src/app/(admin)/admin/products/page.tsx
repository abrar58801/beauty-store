"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("/api/admin/products");
      setProducts(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    const confirmed = confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      await axios.delete(`/api/admin/products/${id}`);
      fetchProducts();
    } catch (error) {
      alert("Delete failed");
    }
  };

  if (loading) {
    return (
      <div className="text-2xl font-semibold">
        Loading products...
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold">
          Products
        </h1>

        <Link
          href="/admin/products/create"
          className="bg-black text-white px-6 py-3 rounded-xl"
        >
          Create Product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="bg-white rounded-3xl shadow p-10 text-center">
          No products found
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left p-5">Image</th>
                  <th className="text-left p-5">Product</th>
                  <th className="text-left p-5">Brand</th>
                  <th className="text-left p-5">Category</th>
                  <th className="text-left p-5">Price</th>
                  <th className="text-left p-5">Stock</th>
                  <th className="text-left p-5">Featured</th>
                  <th className="text-left p-5">Actions</th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-t"
                  >
                    <td className="p-5">
                      {product.images[0]?.url ? (
                        <img
                          src={product.images[0].url}
                          alt={product.name}
                          className="w-20 h-20 object-cover rounded-xl"
                        />
                      ) : (
                        <div className="w-20 h-20 bg-gray-200 rounded-xl" />
                      )}
                    </td>

                    <td className="p-5 font-semibold">
                      {product.name}
                    </td>

                    <td className="p-5">
                      {product.brand?.name}
                    </td>

                    <td className="p-5">
                      {product.category?.name}
                    </td>

                    <td className="p-5">
                      ₹{product.price}
                    </td>

                    <td className="p-5">
                      {product.stock}
                    </td>

                    <td className="p-5">
                      {product.featured ? (
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                          Yes
                        </span>
                      ) : (
                        <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                          No
                        </span>
                      )}
                    </td>

                    <td className="p-5">
                      <div className="flex gap-3">
                        <Link
                          href={`/admin/products/edit/${product.id}`}
                          className="px-4 py-2 border rounded-lg"
                        >
                          Edit
                        </Link>

                        <button
                          onClick={() =>
                            deleteProduct(product.id)
                          }
                          className="px-4 py-2 bg-red-500 text-white rounded-lg"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}