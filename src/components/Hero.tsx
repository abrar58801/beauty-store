"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-pink-500 uppercase tracking-[0.3em] text-sm">
            Modern Cosmetics
          </span>

          <h1 className="text-6xl md:text-7xl font-bold mt-6 leading-tight">
            Glow Beyond Beauty
          </h1>

          <p className="mt-6 text-gray-600 text-lg max-w-xl">
            Luxury skincare & premium cosmetics crafted for modern elegance.
          </p>

          <div className="mt-8 flex gap-4">
            <button className="bg-black text-white px-8 py-4 rounded-full">
              Shop Now
            </button>

            <button className="border border-black px-8 py-4 rounded-full">
              Explore
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <img
            src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9"
            alt="beauty"
            className="rounded-3xl shadow-2xl"
          />
        </motion.div>
      </div>
    </section>
  );
}