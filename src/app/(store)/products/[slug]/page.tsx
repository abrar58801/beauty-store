"use client";

import axios from "axios";
import { useEffect, useState } from "react";

export default function ProductDetails({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const [product, setProduct] = useState<any>(null);

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

    if (!product) {
        return <div className="p-20">Loading...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-16">
            <div>
                <div className="bg-pink-50 rounded-3xl p-8">
                    {product.images[0]?.url ? (
                        <img
                            src={product.images[0].url}
                            alt={product.name}
                            className="rounded-2xl"
                        />
                    ) : (
                        <div>No Image</div>
                    )}
                </div>
            </div>

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

                <button
                    onClick={addToCart}
                    className="mt-10 bg-black text-white px-10 py-4 rounded-full">
                    Add to Cart
                </button>

                <button
                    onClick={addToWishlist}
                    className="mt-4 border border-black px-10 py-4 rounded-full"
                >
                    Add to Wishlist
                </button>
            </div>
        </div>
    );
}