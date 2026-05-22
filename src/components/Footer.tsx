"use client";

import Link from "next/link";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const [settings, setSettings] = useState({
    siteName: "Beauty Luxe",
    siteDescription:
      "Luxury skincare & premium cosmetics for modern beauty.",
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await axios.get("/api/settings");
      setSettings(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const subscribe = async () => {
    if (!email) {
      alert("Enter email");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post("/api/newsletter", {
        email,
      });

      alert(res.data.message);
      setEmail("");
    } catch (error: any) {
      alert(
        error?.response?.data?.error ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-white border-t border-pink-100 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-4 gap-10">
        <div>
          <h2 className="text-3xl font-bold">
            {settings.siteName}
          </h2>

          <p className="mt-4 text-gray-500">
            {settings.siteDescription}
          </p>
        </div>

        <div>
          <h3 className="font-semibold mb-4">
            Shop
          </h3>

          <ul className="space-y-2 text-gray-500">
            <li>
              <Link href="/collections/makeup">
                Makeup
              </Link>
            </li>

            <li>
              <Link href="/collections/skincare">
                Skincare
              </Link>
            </li>

            <li>
              <Link href="/collections/fragrance">
                Fragrance
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-4">
            Support
          </h3>

          <ul className="space-y-2 text-gray-500">
            <li>
              <Link href="/contact">
                Contact
              </Link>
            </li>

            <li>
              <Link href="/faqs">
                FAQs
              </Link>
            </li>

            <li>
              <Link href="/shipping">
                Shipping
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-4">
            Newsletter
          </h3>

          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="w-full border border-pink-200 rounded-full px-5 py-3 outline-none"
            />

            <button
              onClick={subscribe}
              disabled={loading}
              className="bg-black text-white px-6 rounded-full"
            >
              {loading ? "..." : "Join"}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}