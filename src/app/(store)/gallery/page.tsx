"use client";

import axios from "axios";
import { useEffect, useState } from "react";

export default function GalleryPage() {
  const [gallery, setGallery] = useState<any[]>([]);
  const [selected, setSelected] = useState("");

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    const res = await axios.get("/api/gallery");
    setGallery(res.data);
  };

  return (
    <main className="min-h-screen bg-pink-50">
      {/* HERO */}
      <section className="text-center py-20 px-6">
        <h1 className="text-5xl md:text-6xl font-bold">
          Beauty Gallery
        </h1>

        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
          Explore our luxury beauty moments,
          premium skincare collections,
          and stunning cosmetics showcases.
        </p>
      </section>

      {/* GALLERY GRID */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-3 gap-8">
          {gallery.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl shadow overflow-hidden cursor-pointer hover:shadow-xl transition"
              onClick={() =>
                setSelected(item.image)
              }
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-80 object-cover"
              />

              <div className="p-6">
                <h3 className="text-2xl font-bold">
                  {item.title}
                </h3>

                {item.description && (
                  <p className="text-gray-500 mt-3">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* LIGHTBOX */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6"
          onClick={() => setSelected("")}
        >
          <img
            src={selected}
            className="max-h-[90vh] max-w-full rounded-3xl"
          />
        </div>
      )}
    </main>
  );
}