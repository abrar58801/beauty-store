"use client";

import axios from "axios";
import { useEffect, useState } from "react";

export default function ProductDetails({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [product, setProduct] = useState<any>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    const { slug } = await params;
    const res = await axios.get(`/api/products/${slug}`);
    setProduct(res.data);
  };

  const addToCart = async () => {
    await axios.post("/api/cart/add", {
      productId: product.id,
    });

    alert("Added to cart");
  };

  const addToWishlist = async () => {
    await axios.post("/api/wishlist/add", {
      productId: product.id,
    });

    alert("Added to wishlist");
  };

  const nextImage = () => {
    setActiveImage((prev) =>
      prev === product.images.length - 1
        ? 0
        : prev + 1
    );
  };

  const prevImage = () => {
    setActiveImage((prev) =>
      prev === 0
        ? product.images.length - 1
        : prev - 1
    );
  };

  if (!product) {
    return <div className="p-20">Loading...</div>;
  }

  return (
    <>
      <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-16">
        <div>
  <div className="relative bg-pink-50 rounded-3xl p-8">
    {/* TOP THUMBNAILS */}
    {product.images.length > 1 && (
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex gap-3 bg-white/80 backdrop-blur-md px-4 py-3 rounded-2xl shadow-lg">
        {product.images.map(
          (image: any, index: number) => (
            <img
              key={index}
              src={image.url}
              onClick={() =>
                setActiveImage(index)
              }
              className={`w-16 h-16 object-cover rounded-xl cursor-pointer border-2 transition ${
                activeImage === index
                  ? "border-black scale-105"
                  : "border-transparent"
              }`}
            />
          )
        )}
      </div>
    )}

    {/* MAIN IMAGE */}
    {product.images.length > 0 ? (
      <img
        src={
          product.images[activeImage]?.url
        }
        alt={product.name}
        onClick={() =>
          setPreviewOpen(true)
        }
        className="rounded-2xl w-full h-[550px] object-cover cursor-zoom-in"
      />
    ) : (
      <div>No Image</div>
    )}
  </div>
</div>

        {/* DETAILS */}
        <div>
          <p className="text-pink-500 uppercase tracking-[0.3em]">
            {product.brand.name}
          </p>

          <h1 className="text-5xl font-bold mt-4">
            {product.name}
          </h1>

          <p className="text-3xl font-bold mt-6">
            ₹{product.price}
          </p>

          <p className="text-gray-600 mt-8 leading-8">
            {product.description}
          </p>

          <div className="flex flex-wrap gap-4 mt-10">
            <button
              onClick={addToCart}
              className="bg-black text-white px-10 py-4 rounded-full"
            >
              Add to Cart
            </button>

            <button
              onClick={addToWishlist}
              className="border border-black px-10 py-4 rounded-full"
            >
              Add to Wishlist
            </button>
          </div>
        </div>
      </div>

      {/* FULLSCREEN PREVIEW */}
      {previewOpen && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-6"
          onClick={() =>
            setPreviewOpen(false)
          }
        >
          <img
            src={
              product.images[activeImage]?.url
            }
            className="max-h-[90vh] max-w-full rounded-3xl"
          />
        </div>
      )}
    </>
  );
}