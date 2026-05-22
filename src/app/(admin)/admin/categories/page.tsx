"use client";

import axios from "axios";
import { useEffect, useState } from "react";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);

  const [form, setForm] = useState({
    id: "",
    name: "",
    slug: "",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const res = await axios.get(
      "/api/admin/categories"
    );

    setCategories(res.data);
  };

  const saveCategory = async () => {
    if (form.id) {
      await axios.patch(
        `/api/admin/categories/${form.id}`,
        {
          name: form.name,
          slug: form.slug,
        }
      );
    } else {
      await axios.post("/api/admin/categories", {
        name: form.name,
        slug: form.slug,
      });
    }

    setForm({
      id: "",
      name: "",
      slug: "",
    });

    fetchCategories();
  };

  const editCategory = (category: any) => {
    setForm({
      id: category.id,
      name: category.name,
      slug: category.slug,
    });
  };

  const deleteCategory = async (id: string) => {
    if (!confirm("Delete category?")) return;

    try {
      await axios.delete(
        `/api/admin/categories/${id}`
      );

      fetchCategories();
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
        Categories
      </h1>

      <div className="bg-white rounded-3xl shadow p-8 mb-10 max-w-xl grid gap-4">
        <input
          value={form.name}
          placeholder="Category Name"
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
          onClick={saveCategory}
          className="bg-black text-white py-4 rounded-xl"
        >
          {form.id
            ? "Update Category"
            : "Create Category"}
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
            {categories.map((category) => (
              <tr
                key={category.id}
                className="border-t"
              >
                <td className="p-5">
                  {category.name}
                </td>

                <td className="p-5">
                  {category.slug}
                </td>

                <td className="p-5">
                  <div className="flex gap-3">
                    <button
                      onClick={() =>
                        editCategory(category)
                      }
                      className="px-4 py-2 border rounded-lg"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        deleteCategory(category.id)
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