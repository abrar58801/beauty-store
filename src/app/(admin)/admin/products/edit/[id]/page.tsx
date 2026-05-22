"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EditProductPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const router = useRouter();

    const [id, setId] = useState("");
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    const [categories, setCategories] = useState<any[]>([]);
    const [brands, setBrands] = useState<any[]>([]);
    const [images, setImages] = useState<string[]>([]);

    const [variants, setVariants] = useState<any[]>([]);

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
        active: true,
    });

    useEffect(() => {
        init();
    }, []);

    const init = async () => {
        const { id } = await params;
        setId(id);

        const [productRes, catRes, brandRes] =
            await Promise.all([
                axios.get(`/api/admin/products/${id}`),
                axios.get("/api/admin/categories"),
                axios.get("/api/admin/brands"),
            ]);

        const product = productRes.data;

        setForm({
            name: product.name || "",
            slug: product.slug || "",
            description: product.description || "",
            shortDescription:
                product.shortDescription || "",
            price: product.price?.toString() || "",
            comparePrice:
                product.comparePrice?.toString() || "",
            sku: product.sku || "",
            stock: product.stock?.toString() || "",
            categoryId: product.categoryId || "",
            brandId: product.brandId || "",
            featured: product.featured,
            active: product.active,
        });

        setImages(
            product.images.map((img: any) => img.url)
        );

        setVariants(
            product.variants.length
                ? product.variants
                : [
                    {
                        name: "",
                        value: "",
                        price: "",
                        stock: "",
                    },
                ]
        );

        setCategories(catRes.data);
        setBrands(brandRes.data);
        setLoading(false);
    };

    const uploadImage = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];

        if (!file) return;

        try {
            setUploading(true);

            const formData = new FormData();
            formData.append("file", file);

            const res = await axios.post(
                "/api/upload",
                formData
            );

            setImages((prev) => [...prev, res.data.url]);

            e.target.value = "";
        } catch (error) {
            console.error(error);
        } finally {
            setUploading(false);
        }
    };

    const removeImage = (img: string) => {
        setImages((prev) => {
            const updated = prev.filter(
                (item) => item !== img
            );

            console.log("AFTER DELETE:", updated);

            return updated;
        });
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
        field: string,
        value: string
    ) => {
        const updated = [...variants];
        updated[index][field] = value;
        setVariants(updated);
    };

    const removeVariant = (index: number) => {
        setVariants(
            variants.filter((_, i) => i !== index)
        );
    };

    const updateProduct = async () => {
        try {
            const { id } = await params;

            const payload = {
                ...form,
                price: Number(form.price),
                comparePrice: Number(form.comparePrice) || 0,
                stock: Number(form.stock),
                images,
                variants: variants.map((v) => ({
                    name: v.name,
                    value: v.value,
                    price: Number(v.price) || 0,
                    stock: Number(v.stock) || 0,
                })),
            };

            console.log("PATCH PAYLOAD:", payload);

            await axios.patch(
                `/api/admin/products/${id}`,
                payload
            );

            alert("Product updated");

            router.push("/admin/products");
        } catch (error) {
            console.error(error);
            alert("Update failed");
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="product-add">
            <h1 className="text-4xl font-bold mb-10">
                Edit Product
            </h1>

            <div className="bg-white rounded-3xl shadow p-8 grid gap-4 max-w-5xl">
                <input
                    value={form.name}
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
                    value={form.price}
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
                    value={form.comparePrice}
                    placeholder="Compare Price"
                    className="border p-4 rounded-xl"
                    onChange={(e) =>
                        setForm({
                            ...form,
                            comparePrice: e.target.value,
                        })
                    }
                />

                <input
                    value={form.sku}
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
                    value={form.stock}
                    placeholder="Stock"
                    className="border p-4 rounded-xl"
                    onChange={(e) =>
                        setForm({
                            ...form,
                            stock: e.target.value,
                        })
                    }
                />

                <select
                    value={form.categoryId}
                    className="border p-4 rounded-xl"
                    onChange={(e) =>
                        setForm({
                            ...form,
                            categoryId: e.target.value,
                        })
                    }
                >
                    {categories.map((cat) => (
                        <option
                            key={cat.id}
                            value={cat.id}
                        >
                            {cat.name}
                        </option>
                    ))}
                </select>

                <select
                    value={form.brandId}
                    className="border p-4 rounded-xl"
                    onChange={(e) =>
                        setForm({
                            ...form,
                            brandId: e.target.value,
                        })
                    }
                >
                    {brands.map((brand) => (
                        <option
                            key={brand.id}
                            value={brand.id}
                        >
                            {brand.name}
                        </option>
                    ))}
                </select>

                <label className="flex gap-3">
                    <input
                        type="checkbox"
                        checked={form.featured}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                featured: e.target.checked,
                            })
                        }
                    />
                    Featured
                </label>

                <label className="flex gap-3">
                    <input
                        type="checkbox"
                        checked={form.active}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                active: e.target.checked,
                            })
                        }
                    />
                    Active
                </label>

                <input
                    type="file"
                    onChange={uploadImage}
                />

                {uploading && <p>Uploading...</p>}

                <div className="flex gap-4 flex-wrap">
                    {images.map((img) => (
                        <div
                            key={img}
                            className="relative"
                        >
                            <img
                                src={img}
                                className="w-24 h-24 rounded-xl object-cover"
                            />

                            <button
                                onClick={() => removeImage(img)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-2"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>

                <h2 className="text-2xl font-bold mt-8">
                    Variants
                </h2>

                {variants.map((variant, index) => (
                    <div
                        key={index}
                        className="grid md:grid-cols-5 gap-4"
                    >
                        <input
                            value={variant.name}
                            placeholder="Type"
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
                            value={variant.value}
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
                            value={variant.price}
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
                            value={variant.stock}
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

                        <button
                            onClick={() =>
                                removeVariant(index)
                            }
                            className="bg-red-500 text-white rounded-xl"
                        >
                            Remove
                        </button>
                    </div>
                ))}

                <button
                    onClick={addVariant}
                    className="border py-3 rounded-xl"
                >
                    Add Variant
                </button>

                <button
                    onClick={updateProduct}
                    className="bg-black text-white py-4 rounded-xl"
                >
                    Update Product
                </button>
            </div>
        </div>
    );
}