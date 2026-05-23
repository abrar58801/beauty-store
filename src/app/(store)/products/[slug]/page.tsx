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
    const [reviews, setReviews] = useState<any[]>([]);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");

    const averageRating =
        reviews.length > 0
            ? (
                reviews.reduce(
                    (sum, review) => sum + review.rating,
                    0
                ) / reviews.length
            ).toFixed(1)
            : "0.0";

    useEffect(() => {
        fetchProduct();
    }, []);

    const fetchProduct = async () => {
        const { slug } = await params;
        const res = await axios.get(`/api/products/${slug}`);
        setProduct(res.data);
        setReviews(res.data.reviews || []);
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

    const submitReview = async () => {
        if (!comment) {
            alert("Write review");
            return;
        }

        try {
            await axios.post("/api/reviews", {
                productId: product.id,
                rating,
                comment,
            });

            alert("Review added");

            setComment("");
            setRating(5);

            fetchProduct();
        } catch (error: any) {
            alert(
                error?.response?.data?.error ||
                "Failed to add review"
            );
        }
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
                                                className={`flex-shrink-0 rounded-xl md:rounded-2xl p-1 md:p-2 border-2 bg-white transition ${activeImage === index
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

                    <div className="flex items-center gap-3 mt-4">
                        <div className="text-yellow-500 text-xl">
                            {"★".repeat(
                                Math.round(Number(averageRating))
                            )}
                            {"☆".repeat(
                                5 - Math.round(Number(averageRating))
                            )}
                        </div>

                        <span className="text-gray-600">
                            {averageRating} ({reviews.length} reviews)
                        </span>
                    </div>

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

                    <div className="mt-16 border-t pt-10">
                        <h2 className="text-3xl font-bold mb-8">
                            Customer Reviews
                        </h2>

                        {/* REVIEW FORM */}
                        <div className="bg-pink-50 rounded-3xl p-6 mb-10">
                            <h3 className="text-xl font-semibold mb-4">
                                Write a Review
                            </h3>

                            {/* CLICK STAR RATING */}
                            <div className="flex gap-2 mb-6">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        className="text-4xl transition hover:scale-110"
                                    >
                                        <span
                                            className={
                                                star <= rating
                                                    ? "text-yellow-500"
                                                    : "text-gray-300"
                                            }
                                        >
                                            ★
                                        </span>
                                    </button>
                                ))}
                            </div>

                            <textarea
                                value={comment}
                                onChange={(e) =>
                                    setComment(e.target.value)
                                }
                                placeholder="Write your review..."
                                className="border p-4 rounded-xl w-full h-32 bg-white"
                            />

                            <button
                                onClick={submitReview}
                                className="mt-4 bg-black text-white px-8 py-4 rounded-full"
                            >
                                Submit Review
                            </button>
                        </div>

                        {/* REVIEW LIST */}
                        <div className="space-y-6">
                            {reviews.length === 0 ? (
                                <div className="bg-white shadow rounded-2xl p-8 text-center text-gray-500">
                                    No reviews yet.
                                </div>
                            ) : (
                                reviews.map((review) => (
                                    <div
                                        key={review.id}
                                        className="bg-white shadow rounded-2xl p-6"
                                    >
                                        <div className="flex justify-between items-center mb-3">
                                            <h4 className="font-bold text-lg">
                                                {review.user?.name || "Customer"}
                                            </h4>

                                            <div className="text-yellow-500 text-lg">
                                                {"★".repeat(review.rating)}
                                                {"☆".repeat(5 - review.rating)}
                                            </div>
                                        </div>

                                        <p className="text-gray-600 leading-7">
                                            {review.comment}
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>
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