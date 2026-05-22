"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import axios from "axios";
import { useEffect, useState } from "react";

export default function AccountPage() {
  const { data: session } = useSession();

  const [addresses, setAddresses] = useState<any[]>([]);
  const [editingId, setEditingId] = useState("");

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
  });

  useEffect(() => {
    if (session) {
      fetchAddresses();
    }
  }, [session]);

  const fetchAddresses = async () => {
    try {
      const res = await axios.get("/api/address");
      setAddresses(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const saveAddress = async () => {
    try {
      if (
        !form.fullName ||
        !form.phone ||
        !form.address ||
        !form.city ||
        !form.state ||
        !form.country ||
        !form.zipCode
      ) {
        alert("Please fill all address fields");
        return;
      }

      if (editingId) {
        await axios.patch(
          `/api/address/${editingId}`,
          form
        );
      } else {
        await axios.post("/api/address", form);
      }

      setForm({
        fullName: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        country: "",
        zipCode: "",
      });

      setEditingId("");

      fetchAddresses();
    } catch (error) {
      alert("Address save failed");
    }
  };

  const editAddress = (addr: any) => {
    setEditingId(addr.id);

    setForm({
      fullName: addr.fullName,
      phone: addr.phone,
      address: addr.address,
      city: addr.city,
      state: addr.state,
      country: addr.country,
      zipCode: addr.zipCode,
    });
  };

  const deleteAddress = async (id: string) => {
    if (!confirm("Delete this address?")) return;

    try {
      await axios.delete(`/api/address/${id}`);
      fetchAddresses();
    } catch {
      alert("Delete failed");
    }
  };

  if (!session) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="bg-white shadow-xl rounded-3xl p-10 text-center">
          <h1 className="text-3xl font-bold mb-4">
            Login Required
          </h1>

          <p className="text-gray-500 mb-6">
            Please login to access your account.
          </p>

          <Link
            href="/login"
            className="bg-black text-white px-8 py-4 rounded-2xl"
          >
            Login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-gradient-to-b from-pink-50 to-white min-h-screen">
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="mb-16">
          <p className="text-pink-500 uppercase tracking-[0.3em] text-sm">
            Dashboard
          </p>

          <h1 className="text-5xl font-bold mt-4">
            My Account
          </h1>
        </div>

        {/* TOP */}
        <div className="grid md:grid-cols-3 gap-10 mb-16">
          {/* PROFILE */}
          <div className="bg-white rounded-3xl shadow-lg p-10">
            <div className="w-20 h-20 rounded-full bg-black text-white flex items-center justify-center text-3xl font-bold mb-6">
              {session.user?.email?.charAt(0)}
            </div>

            <h2 className="text-2xl font-bold">
              {session.user?.name || "Customer"}
            </h2>

            <p className="text-gray-500 mt-2">
              {session.user?.email}
            </p>

            <button
              onClick={() => signOut()}
              className="mt-8 bg-red-500 text-white px-6 py-3 rounded-2xl"
            >
              Logout
            </button>
          </div>

          {/* QUICK LINKS */}
          <div className="md:col-span-2 grid sm:grid-cols-2 gap-6">
            <Link
              href="/orders"
              className="bg-white rounded-3xl shadow-lg p-8 hover:shadow-xl transition"
            >
              <h3 className="text-2xl font-bold">
                My Orders
              </h3>

              <p className="text-gray-500 mt-3">
                Track your purchases
              </p>
            </Link>

            <Link
              href="/wishlist"
              className="bg-white rounded-3xl shadow-lg p-8 hover:shadow-xl transition"
            >
              <h3 className="text-2xl font-bold">
                Wishlist
              </h3>

              <p className="text-gray-500 mt-3">
                Saved favorites
              </p>
            </Link>

            <Link
              href="/cart"
              className="bg-white rounded-3xl shadow-lg p-8 hover:shadow-xl transition"
            >
              <h3 className="text-2xl font-bold">
                Shopping Cart
              </h3>

              <p className="text-gray-500 mt-3">
                Review cart items
              </p>
            </Link>

            <Link
              href="/contact"
              className="bg-white rounded-3xl shadow-lg p-8 hover:shadow-xl transition"
            >
              <h3 className="text-2xl font-bold">
                Support
              </h3>

              <p className="text-gray-500 mt-3">
                Need help?
              </p>
            </Link>
          </div>
        </div>

        {/* ADDRESS SECTION */}
        <div className="grid lg:grid-cols-2 gap-10">
          {/* FORM */}
          <div className="bg-white rounded-3xl shadow-lg p-10">
            <h2 className="text-3xl font-bold mb-8">
              {editingId
                ? "Edit Address"
                : "Add Address"}
            </h2>

            <div className="space-y-4">
              <input
                placeholder="Full Name"
                value={form.fullName}
                onChange={(e) =>
                  setForm({
                    ...form,
                    fullName: e.target.value,
                  })
                }
                className="w-full border rounded-2xl p-4"
              />

              <input
                placeholder="Phone"
                value={form.phone}
                onChange={(e) =>
                  setForm({
                    ...form,
                    phone: e.target.value,
                  })
                }
                className="w-full border rounded-2xl p-4"
              />

              <textarea
                placeholder="Address"
                value={form.address}
                onChange={(e) =>
                  setForm({
                    ...form,
                    address: e.target.value,
                  })
                }
                className="w-full border rounded-2xl p-4"
              />

              <input
                placeholder="City"
                value={form.city}
                onChange={(e) =>
                  setForm({
                    ...form,
                    city: e.target.value,
                  })
                }
                className="w-full border rounded-2xl p-4"
              />

              <input
                placeholder="State"
                value={form.state}
                onChange={(e) =>
                  setForm({
                    ...form,
                    state: e.target.value,
                  })
                }
                className="w-full border rounded-2xl p-4"
              />

              <input
                placeholder="Country"
                value={form.country}
                onChange={(e) =>
                  setForm({
                    ...form,
                    country: e.target.value,
                  })
                }
                className="w-full border rounded-2xl p-4"
              />

              <input
                placeholder="Zip Code"
                value={form.zipCode}
                onChange={(e) =>
                  setForm({
                    ...form,
                    zipCode: e.target.value,
                  })
                }
                className="w-full border rounded-2xl p-4"
              />

              <button
                onClick={saveAddress}
                className="bg-black text-white px-8 py-4 rounded-2xl"
              >
                {editingId
                  ? "Update Address"
                  : "Save Address"}
              </button>
            </div>
          </div>

          {/* SAVED ADDRESSES */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">
              Saved Addresses
            </h2>

            {addresses.length === 0 ? (
              <div className="bg-white rounded-3xl shadow-lg p-8">
                No saved addresses
              </div>
            ) : (
              addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="bg-white rounded-3xl shadow-lg p-8"
                >
                  <h3 className="font-bold text-xl">
                    {addr.fullName}
                  </h3>

                  <p className="text-gray-600 mt-2">
                    {addr.phone}
                  </p>

                  <p className="text-gray-600 mt-2">
                    {addr.address}
                  </p>

                  <p className="text-gray-600">
                    {addr.city}, {addr.state}
                  </p>

                  <p className="text-gray-600">
                    {addr.country} - {addr.zipCode}
                  </p>

                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() =>
                        editAddress(addr)
                      }
                      className="px-5 py-2 border rounded-xl"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        deleteAddress(addr.id)
                      }
                      className="px-5 py-2 bg-red-500 text-white rounded-xl"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  );
}