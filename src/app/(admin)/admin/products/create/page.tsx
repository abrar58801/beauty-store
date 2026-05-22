"use client";

import axios from "axios";
import { useEffect, useState } from "react";

export default function ProductsPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);

  const [images, setImages] = useState<string[]>([]);

  type Variant = {
    name: string;
    value: string;
    price: string;
    stock: string;
  };

  const [variants, setVariants] = useState<Variant[]>([
    {
      name: "",
      value: "",
      price: "",
      stock: "",
    },
  ]);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    shortDescription: "",
    price: "",
    comparePrice: "",
    sku: "",
    stock: "",
    categoryId: "",
    brandId: "",
    featured: false,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const catRes = await axios.get("/api/admin/categories");
    const brandRes = await axios.get("/api/admin/brands");

    setCategories(catRes.data);
    setBrands(brandRes.data);
  };

  const uploadImage = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    const res = await axios.post("/api/upload", formData);

    setImages([...images, res.data.url]);

    setUploading(false);
  };

  const addVariant = () => {
    setVariants([
      ...variants,
      {
        name: "",
        value: "",
        price: "",
        stock: "",
      },
    ]);
  };

  const updateVariant = (
    index: number,
    field: keyof Variant,
    value: string
  ) => {
    const updated = [...variants];
    updated[index][field] = value;
    setVariants(updated);
  };

  const createProduct = async () => {
    await axios.post("/api/admin/products", {
      ...form,
      price: Number(form.price),
      comparePrice: Number(form.comparePrice),
      stock: Number(form.stock),
      active: true,
      images,

      variants: variants.map((v) => ({
        name: v.name,
        value: v.value,
        price: Number(v.price),
        stock: Number(v.stock),
      })),
    });

    alert("Product created");
  };

  return (
    <div className="product-add">
      <h1 className="text-4xl font-bold mb-10">
        Create Product
      </h1>

      <div className="bg-white rounded-3xl shadow p-8 grid gap-4 max-w-4xl">
        <input
          placeholder="Product Name"
          className="border p-4 rounded-xl"
          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value,
            })
          }
        />

        <input
          placeholder="Slug"
          className="border p-4 rounded-xl"
          onChange={(e) =>
            setForm({
              ...form,
              slug: e.target.value,
            })
          }
        />

        <textarea
          placeholder="Description"
          className="border p-4 rounded-xl"
          onChange={(e) =>
            setForm({
              ...form,
              description: e.target.value,
            })
          }
        />

        <input
          placeholder="Price"
          className="border p-4 rounded-xl"
          onChange={(e) =>
            setForm({
              ...form,
              price: e.target.value,
            })
          }
        />

        <input
          placeholder="SKU"
          className="border p-4 rounded-xl"
          onChange={(e) =>
            setForm({
              ...form,
              sku: e.target.value,
            })
          }
        />

        <input
          type="file"
          onChange={uploadImage}
        />

        {uploading && <p>Uploading...</p>}

        <div className="flex gap-3 flex-wrap">
          {images.map((img) => (
            <img
              key={img}
              src={img}
              className="w-24 h-24 rounded-xl object-cover"
            />
          ))}
        </div>

        <select
          className="border p-4 rounded-xl"
          value={form.categoryId}
          onChange={(e) =>
            setForm({
              ...form,
              categoryId: e.target.value,
            })
          }
        >
          <option value="">Select Category</option>

          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <select
          className="border p-4 rounded-xl"
          value={form.brandId}
          onChange={(e) =>
            setForm({
              ...form,
              brandId: e.target.value,
            })
          }
        >
          <option value="">Select Brand</option>

          {brands.map((brand) => (
            <option key={brand.id} value={brand.id}>
              {brand.name}
            </option>
          ))}
        </select>

        <h2 className="text-2xl font-bold mt-8">
          Variants
        </h2>

        {variants.map((variant, index) => (
          <div
            key={index}
            className="grid md:grid-cols-4 gap-4"
          >
            <input
              placeholder="Variant Type (Shade / Size)"
              className="border p-4 rounded-xl"
              onChange={(e) =>
                updateVariant(
                  index,
                  "name",
                  e.target.value
                )
              }
            />

            <input
              placeholder="Value"
              className="border p-4 rounded-xl"
              onChange={(e) =>
                updateVariant(
                  index,
                  "value",
                  e.target.value
                )
              }
            />

            <input
              placeholder="Price"
              className="border p-4 rounded-xl"
              onChange={(e) =>
                updateVariant(
                  index,
                  "price",
                  e.target.value
                )
              }
            />

            <input
              placeholder="Stock"
              className="border p-4 rounded-xl"
              onChange={(e) =>
                updateVariant(
                  index,
                  "stock",
                  e.target.value
                )
              }
            />
          </div>
        ))}

        <button
          onClick={addVariant}
          className="border py-3 rounded-xl"
        >
          Add Variant
        </button>

        <button
          onClick={createProduct}
          className="bg-black text-white py-4 rounded-xl"
        >
          Create Product
        </button>
      </div>
    </div>
  );
}