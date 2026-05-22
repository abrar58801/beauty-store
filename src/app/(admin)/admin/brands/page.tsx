"use client";

import axios from "axios";
import { useEffect, useState } from "react";

export default function BrandsPage() {
  const [brands, setBrands] = useState<any[]>([]);

  const [form, setForm] = useState({
    id: "",
    name: "",
    slug: "",
  });

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    const res = await axios.get(
      "/api/admin/brands"
    );

    setBrands(res.data);
  };

  const saveBrand = async () => {
    if (form.id) {
      await axios.patch(
        `/api/admin/brands/${form.id}`,
        {
          name: form.name,
          slug: form.slug,
        }
      );
    } else {
      await axios.post("/api/admin/brands", {
        name: form.name,
        slug: form.slug,
      });
    }

    setForm({
      id: "",
      name: "",
      slug: "",
    });

    fetchBrands();
  };

  const editBrand = (brand: any) => {
    setForm({
      id: brand.id,
      name: brand.name,
      slug: brand.slug,
    });
  };

  const deleteBrand = async (id: string) => {
    if (!confirm("Delete brand?")) return;

    try {
      await axios.delete(
        `/api/admin/brands/${id}`
      );

      fetchBrands();
    } catch (error: any) {
      alert(
        error?.response?.data?.error ||
          "Delete failed"
      );
    }
  };

  return (
    <div>
      <h1 className="text-4xl font-bold mb-10">
        Brands
      </h1>

      <div className="bg-white rounded-3xl shadow p-8 mb-10 max-w-xl grid gap-4">
        <input
          value={form.name}
          placeholder="Brand Name"
          className="border p-4 rounded-xl"
          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value,
            })
          }
        />

        <input
          value={form.slug}
          placeholder="Slug"
          className="border p-4 rounded-xl"
          onChange={(e) =>
            setForm({
              ...form,
              slug: e.target.value,
            })
          }
        />

        <button
          onClick={saveBrand}
          className="bg-black text-white py-4 rounded-xl"
        >
          {form.id
            ? "Update Brand"
            : "Create Brand"}
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-5">Name</th>
              <th className="text-left p-5">Slug</th>
              <th className="text-left p-5">Actions</th>
            </tr>
          </thead>

          <tbody>
            {brands.map((brand) => (
              <tr
                key={brand.id}
                className="border-t"
              >
                <td className="p-5">
                  {brand.name}
                </td>

                <td className="p-5">
                  {brand.slug}
                </td>

                <td className="p-5">
                  <div className="flex gap-3">
                    <button
                      onClick={() =>
                        editBrand(brand)
                      }
                      className="px-4 py-2 border rounded-lg"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        deleteBrand(brand.id)
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
  );
}