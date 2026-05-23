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
        <div className="w-full">
  {/* MAIN IMAGE */}
  <div className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 shadow">
    {product.images.length > 0 ? (
      <img
        src={product.images[activeImage]?.url}
        alt={product.name}
        onClick={() => setPreviewOpen(true)}
        className="w-full h-[320px] sm:h-[450px] md:h-[600px] object-contain rounded-2xl cursor-zoom-in"
      />
    ) : (
      <div className="h-[320px] md:h-[600px] flex items-center justify-center">
        No Image
      </div>
    )}
  </div>

  {/* RESPONSIVE THUMB SLIDER */}
  {product.images.length > 1 && (
  <div className="flex items-center gap-2 md:gap-4 mt-4 md:mt-6 w-full">
    {/* LEFT */}
    <button
      onClick={() => {
        const newIndex =
          activeImage === 0
            ? product.images.length - 1
            : activeImage - 1;

        setActiveImage(newIndex);

        document
          .getElementById(`thumb-${newIndex}`)
          ?.scrollIntoView({
            behavior: "smooth",
            inline: "center",
            block: "nearest",
          });
      }}
      className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0 rounded-full border bg-white shadow flex items-center justify-center text-xl"
    >
      ‹
    </button>

    {/* THUMB CONTAINER */}
    <div className="flex-1 overflow-hidden">
      <div className="flex gap-2 md:gap-4 overflow-x-auto no-scrollbar px-1">
        {product.images.map(
          (image: any, index: number) => (
            <button
              id={`thumb-${index}`}
              key={index}
              onClick={() => {
                setActiveImage(index);

                document
                  .getElementById(`thumb-${index}`)
                  ?.scrollIntoView({
                    behavior: "smooth",
                    inline: "center",
                    block: "nearest",
                  });
              }}
              className={`flex-shrink-0 rounded-xl md:rounded-2xl p-1 md:p-2 border-2 bg-white transition ${
                activeImage === index
                  ? "border-black shadow-lg"
                  : "border-gray-200"
              }`}
            >
              <img
                src={image.url}
                alt=""
                className="w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 object-cover rounded-lg md:rounded-xl"
              />
            </button>
          )
        )}
      </div>
    </div>

    {/* RIGHT */}
    <button
      onClick={() => {
        const newIndex =
          activeImage ===
          product.images.length - 1
            ? 0
            : activeImage + 1;

        setActiveImage(newIndex);

        document
          .getElementById(`thumb-${newIndex}`)
          ?.scrollIntoView({
            behavior: "smooth",
            inline: "center",
            block: "nearest",
          });
      }}
      className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0 rounded-full border bg-white shadow flex items-center justify-center text-xl"
    >
      ›
    </button>
  </div>
)}
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