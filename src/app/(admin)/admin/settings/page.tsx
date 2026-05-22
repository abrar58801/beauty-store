"use client";

import axios from "axios";
import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function SettingsPage() {
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [form, setForm] = useState({
        siteName: "",
        siteDescription: "",

        logo: "",
        favicon: "",

        heroBanner: "",
        heroTitle: "",
        heroSubtitle: "",
        heroButtonText: "",
        heroButtonLink: "",

        seoTitle: "",
        seoDescription: "",
        seoKeywords: "",

        contactEmail: "",
        contactPhone: "",
        contactAddress: "",
        businessHours: "",

        facebook: "",
        instagram: "",
        twitter: "",
        youtube: "",
        whatsapp: "",
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await axios.get(
                "/api/admin/settings"
            );

            setForm({
                ...form,
                ...res.data,
            });
        } catch (error) {
            console.error(error);
        }
    };

    const uploadImage = async (
        e: React.ChangeEvent<HTMLInputElement>,
        field: "logo" | "favicon" | "heroBanner"
    ) => {
        const file = e.target.files?.[0];

        if (!file) return;

        try {
            setUploading(true);

            const data = new FormData();
            data.append("file", file);
            data.append(
                "upload_preset",
                process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
            );

            const res = await axios.post(
                `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
                data
            );

            setForm((prev) => ({
                ...prev,
                [field]: res.data.secure_url,
            }));
        } catch (error) {
            alert("Upload failed");
        } finally {
            setUploading(false);
        }
    };

    const saveSettings = async () => {
        try {
            setLoading(true);

            await axios.patch(
                "/api/admin/settings",
                form
            );

            alert("Settings updated successfully");
        } catch {
            alert("Save failed");
        } finally {
            setLoading(false);
        }
    };

    const inputClass =
        "w-full border p-4 rounded-xl";

    return (
        <div className="w-full">
            <h1 className="text-3xl md:text-4xl font-bold mb-10">
                Website Settings
            </h1>

            <div className="bg-white rounded-3xl shadow p-6 md:p-8 grid gap-6">
                {/* BRANDING */}
                <h2 className="text-2xl font-bold">
                    Branding
                </h2>

                <input
                    value={form.siteName}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            siteName: e.target.value,
                        })
                    }
                    placeholder="Site Name"
                    className={inputClass}
                />

                <textarea
                    rows={4}
                    value={form.siteDescription}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            siteDescription:
                                e.target.value,
                        })
                    }
                    placeholder="Site Description"
                    className={inputClass}
                />

                {/* LOGO */}
                <div>
                    <label className="font-medium block mb-2">
                        Logo
                    </label>

                    <input
                        type="file"
                        onChange={(e) =>
                            uploadImage(e, "logo")
                        }
                        className={inputClass}
                    />

                    {form.logo && (
                        <img
                            src={form.logo}
                            className="w-24 h-24 object-contain mt-4"
                        />
                    )}
                </div>

                {/* FAVICON */}
                <div>
                    <label className="font-medium block mb-2">
                        Favicon
                    </label>

                    <input
                        type="file"
                        onChange={(e) =>
                            uploadImage(e, "favicon")
                        }
                        className={inputClass}
                    />

                    {form.favicon && (
                        <img
                            src={form.favicon}
                            className="w-16 h-16 object-contain mt-4"
                        />
                    )}
                </div>

                {/* HERO */}
                <h2 className="text-2xl font-bold mt-8">
                    Homepage Hero
                </h2>

                <input
                    type="file"
                    onChange={(e) =>
                        uploadImage(e, "heroBanner")
                    }
                    className={inputClass}
                />

                {form.heroBanner && (
                    <img
                        src={form.heroBanner}
                        className="w-full max-w-md rounded-2xl"
                    />
                )}

                <input
                    value={form.heroTitle}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            heroTitle:
                                e.target.value,
                        })
                    }
                    placeholder="Hero Title"
                    className={inputClass}
                />

                <textarea
                    rows={3}
                    value={form.heroSubtitle}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            heroSubtitle:
                                e.target.value,
                        })
                    }
                    placeholder="Hero Subtitle"
                    className={inputClass}
                />

                <input
                    value={form.heroButtonText}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            heroButtonText:
                                e.target.value,
                        })
                    }
                    placeholder="Hero Button Text"
                    className={inputClass}
                />

                <input
                    value={form.heroButtonLink}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            heroButtonLink:
                                e.target.value,
                        })
                    }
                    placeholder="Hero Button Link"
                    className={inputClass}
                />

                {/* SEO */}
                <h2 className="text-2xl font-bold mt-8">
                    SEO
                </h2>

                <input
                    value={form.seoTitle}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            seoTitle:
                                e.target.value,
                        })
                    }
                    placeholder="SEO Title"
                    className={inputClass}
                />

                <textarea
                    rows={4}
                    value={form.seoDescription}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            seoDescription:
                                e.target.value,
                        })
                    }
                    placeholder="SEO Description"
                    className={inputClass}
                />

                <input
                    value={form.seoKeywords}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            seoKeywords:
                                e.target.value,
                        })
                    }
                    placeholder="SEO Keywords"
                    className={inputClass}
                />

                {/* CONTACT */}
                <h2 className="text-2xl font-bold mt-8">
                    Contact
                </h2>

                <input
                    value={form.contactEmail}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            contactEmail:
                                e.target.value,
                        })
                    }
                    placeholder="Contact Email"
                    className={inputClass}
                />

                <input
                    value={form.contactPhone}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            contactPhone:
                                e.target.value,
                        })
                    }
                    placeholder="Phone"
                    className={inputClass}
                />

                <textarea
                    rows={3}
                    value={form.contactAddress}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            contactAddress:
                                e.target.value,
                        })
                    }
                    placeholder="Address"
                    className={inputClass}
                />

                <input
                    value={form.businessHours}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            businessHours:
                                e.target.value,
                        })
                    }
                    placeholder="Business Hours"
                    className={inputClass}
                />

                {/* SOCIAL */}
                <h2 className="text-2xl font-bold mt-8">
                    Social Media
                </h2>

                {[
                    "facebook",
                    "instagram",
                    "twitter",
                    "youtube",
                    "whatsapp",
                ].map((field) => (
                    <input
                        key={field}
                        value={(form as any)[field]}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                [field]:
                                    e.target.value,
                            })
                        }
                        placeholder={field}
                        className={inputClass}
                    />
                ))}

                <button
                    onClick={saveSettings}
                    disabled={
                        loading || uploading
                    }
                    className="bg-black text-white py-4 rounded-xl disabled:opacity-50"
                >
                    {loading || uploading
                        ? "Saving..."
                        : "Save Settings"}
                </button>
            </div>
        </div>
    );
}