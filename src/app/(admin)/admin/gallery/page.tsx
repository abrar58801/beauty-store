"use client";

import axios from "axios";
import { useEffect, useState } from "react";

export default function AdminGalleryPage() {
  const [gallery, setGallery] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    image: "",
  });

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    const res = await axios.get("/api/admin/gallery");
    setGallery(res.data);
  };

  const uploadImage = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    const res = await axios.post(
      "/api/upload",
      formData
    );

    setForm({
      ...form,
      image: res.data.url,
    });

    setUploading(false);
  };

  const saveGallery = async () => {
    if (!form.title || !form.image) {
      alert("Title and image required");
      return;
    }

    await axios.post("/api/admin/gallery", form);

    setForm({
      title: "",
      description: "",
      image: "",
    });

    fetchGallery();
  };

  const deleteItem = async (id: string) => {
    if (!confirm("Delete image?")) return;

    await axios.delete(
      `/api/admin/gallery/${id}`
    );

    fetchGallery();
  };

  return (
    <div>
      <h1 className="text-4xl font-bold mb-10">
        Gallery Management
      </h1>

      {/* FORM */}
      <div className="bg-white rounded-3xl shadow p-8 max-w-3xl grid gap-4 mb-10">
        <input
          value={form.title}
          placeholder="Gallery Title"
          className="border p-4 rounded-xl"
          onChange={(e) =>
            setForm({
              ...form,
              title: e.target.value,
            })
          }
        />

        <textarea
          value={form.description}
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
          type="file"
          onChange={uploadImage}
        />

        {uploading && (
          <p>Uploading image...</p>
        )}

        {form.image && (
          <img
            src={form.image}
            className="w-40 h-40 rounded-2xl object-cover"
          />
        )}

        <button
          onClick={saveGallery}
          className="bg-black text-white py-4 rounded-xl"
        >
          Add Gallery Image
        </button>
      </div>

      {/* GALLERY LIST */}
      <div className="grid md:grid-cols-3 gap-8">
        {gallery.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl shadow p-4"
          >
            <img
              src={item.image}
              className="w-full h-64 object-cover rounded-2xl"
            />

            <h3 className="text-xl font-bold mt-4">
              {item.title}
            </h3>

            <p className="text-gray-500 mt-2">
              {item.description}
            </p>

            <button
              onClick={() =>
                deleteItem(item.id)
              }
              className="mt-4 bg-red-500 text-white px-5 py-3 rounded-xl"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}