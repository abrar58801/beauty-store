"use client";

import Link from "next/link";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  Search,
  ShoppingBag,
  User,
  Heart,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  const [settings, setSettings] = useState({
    siteName: "Beauty Luxe",
    logo: "",
  });

  const [wishlistCount, setWishlistCount] =
    useState(0);

  const [cartCount, setCartCount] =
    useState(0);

  const [search, setSearch] = useState("");
  const [mobileMenu, setMobileMenu] =
    useState(false);

  const [dropdownOpen, setDropdownOpen] =
    useState(false);

  useEffect(() => {
    fetchData();
  }, [session]);

  const fetchData = async () => {
    try {
      const settingsRes =
        await axios.get("/api/settings");

      setSettings(settingsRes.data);

      if (session) {
        const wishlistRes =
          await axios.get(
            "/api/wishlist/count"
          );

        const cartRes =
          await axios.get("/api/cart/count");

        setWishlistCount(
          wishlistRes.data.count
        );

        setCartCount(cartRes.data.count);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-pink-100">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* LOGO */}
        <Link
          href="/"
          className="flex items-center gap-3"
        >
          {settings.logo ? (
            <img
              src={settings.logo}
              alt="logo"
              className="h-12 object-contain"
            />
          ) : (
            <span className="text-3xl font-bold">
              {settings.siteName}
            </span>
          )}
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link href="/">Home</Link>
          <Link href="/products">Products</Link>
          <Link href="/collections">Collections</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/gallery">Gallery</Link>
        </nav>

        {/* RIGHT */}
        <div className="flex items-center gap-5">
          {/* SEARCH */}
          <Link href={`/products?search=${search}`}>
            <Search className="w-5 h-5 cursor-pointer" />
          </Link>

          {/* WISHLIST */}
          <Link
            href="/wishlist"
            className="relative"
          >
            <Heart className="w-5 h-5 cursor-pointer" />

            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* CART */}
          <Link
            href="/cart"
            className="relative"
          >
            <ShoppingBag className="w-5 h-5 cursor-pointer" />

            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {/* USER */}
          {session ? (
            <div className="relative">
              <button
                onClick={() =>
                  setDropdownOpen(
                    !dropdownOpen
                  )
                }
                className="flex items-center gap-2"
              >
                <User className="w-5 h-5" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-52 bg-white rounded-2xl shadow-xl overflow-hidden">
                  <Link
                    href="/account"
                    className="block px-4 py-3 hover:bg-gray-100"
                  >
                    My Account
                  </Link>

                  <Link
                    href="/orders"
                    className="block px-4 py-3 hover:bg-gray-100"
                  >
                    My Orders
                  </Link>

                  <Link
                    href="/wishlist"
                    className="block px-4 py-3 hover:bg-gray-100"
                  >
                    Wishlist
                  </Link>

                  <button
                    onClick={() =>
                      signOut()
                    }
                    className="w-full text-left px-4 py-3 bg-pink-100 hover:bg-pink-200"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login">
              <User className="w-5 h-5 cursor-pointer" />
            </Link>
          )}

          {/* MOBILE MENU */}
          <button
            className="md:hidden"
            onClick={() =>
              setMobileMenu(!mobileMenu)
            }
          >
            {mobileMenu ? (
              <X size={24} />
            ) : (
              <Menu size={24} />
            )}
          </button>
        </div>
      </div>

      {/* MOBILE NAV */}
      {mobileMenu && (
        <div className="md:hidden border-t bg-white px-6 py-5 space-y-4">
          <Link href="/" className="block">Home</Link>
          <Link href="/products" className="block">Products</Link>
          <Link href="/collections" className="block">Collections</Link>
          <Link href="/about" className="block">About</Link>
          <Link href="/contact" className="block">Contact</Link>
          <Link href="/gallery" className="block">Gallery</Link>
        </div>
      )}
    </header>
  );
}