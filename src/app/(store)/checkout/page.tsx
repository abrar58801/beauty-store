"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [editing, setEditing] = useState(false);

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
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const res = await axios.get("/api/address");
      setAddresses(res.data);

      if (res.data.length > 0) {
        setSelectedAddress(res.data[0]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const selectAddress = (addr: any) => {
    setSelectedAddress(addr);
    setEditing(false);
  };

  const startEdit = () => {
    if (!selectedAddress) return;

    setForm({
      fullName: selectedAddress.fullName,
      phone: selectedAddress.phone,
      address: selectedAddress.address,
      city: selectedAddress.city,
      state: selectedAddress.state,
      country: selectedAddress.country,
      zipCode: selectedAddress.zipCode,
    });

    setEditing(true);
  };

  const updateAddress = async () => {
    try {
      await axios.patch(
        `/api/address/${selectedAddress.id}`,
        form
      );

      setEditing(false);
      fetchAddresses();
    } catch {
      alert("Address update failed");
    }
  };

  const payNow = async () => {
    if (!selectedAddress) {
      alert("Please select address");
      return;
    }

    try {
      setLoading(true);

      const initRes = await axios.post(
        "/api/payment/init",
        {
          fullName: selectedAddress.fullName,
          phone: selectedAddress.phone,
          address: selectedAddress.address,
          city: selectedAddress.city,
          state: selectedAddress.state,
          country: selectedAddress.country,
          zipCode: selectedAddress.zipCode,
        }
      );

      const { razorOrder, orderId } = initRes.data;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: razorOrder.amount,
        currency: razorOrder.currency,
        name: "Beauty Luxe",
        description: "Cosmetics Order",
        order_id: razorOrder.id,

        handler: async function (response: any) {
          await axios.post("/api/payment/verify", {
            ...response,
            orderId,
          });

          alert("Payment successful");
          router.push("/orders");
        },

        prefill: {
          name: selectedAddress.fullName,
          contact: selectedAddress.phone,
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch {
      alert("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <h1 className="text-5xl font-bold mb-12">
        Checkout
      </h1>

      <div className="grid md:grid-cols-2 gap-10">
        <div className="space-y-8">
          {/* ADDRESSES */}
          <div className="bg-white rounded-3xl shadow p-8">
            <h2 className="text-2xl font-bold mb-6">
              Select Address
            </h2>

            <div className="space-y-4">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  onClick={() => selectAddress(addr)}
                  className={`border rounded-2xl p-5 cursor-pointer transition ${
                    selectedAddress?.id === addr.id
                      ? "border-black bg-gray-50"
                      : "border-gray-200"
                  }`}
                >
                  <h3 className="font-bold">
                    {addr.fullName}
                  </h3>

                  <p>{addr.phone}</p>
                  <p>{addr.address}</p>
                  <p>
                    {addr.city}, {addr.state}
                  </p>
                  <p>
                    {addr.country} - {addr.zipCode}
                  </p>
                </div>
              ))}
            </div>

            {selectedAddress && !editing && (
              <button
                onClick={startEdit}
                className="mt-6 px-6 py-3 border rounded-xl"
              >
                Edit Selected Address
              </button>
            )}
          </div>

          {/* EDIT ONLY */}
          {editing && (
            <div className="bg-white rounded-3xl shadow p-8">
              <h2 className="text-2xl font-bold mb-8">
                Edit Address
              </h2>

              <div className="grid gap-4">
                <input
                  value={form.fullName}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      fullName: e.target.value,
                    })
                  }
                  className="border p-4 rounded-xl"
                />

                <input
                  value={form.phone}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      phone: e.target.value,
                    })
                  }
                  className="border p-4 rounded-xl"
                />

                <input
                  value={form.address}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      address: e.target.value,
                    })
                  }
                  className="border p-4 rounded-xl"
                />

                <input
                  value={form.city}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      city: e.target.value,
                    })
                  }
                  className="border p-4 rounded-xl"
                />

                <input
                  value={form.state}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      state: e.target.value,
                    })
                  }
                  className="border p-4 rounded-xl"
                />

                <input
                  value={form.country}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      country: e.target.value,
                    })
                  }
                  className="border p-4 rounded-xl"
                />

                <input
                  value={form.zipCode}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      zipCode: e.target.value,
                    })
                  }
                  className="border p-4 rounded-xl"
                />

                <button
                  onClick={updateAddress}
                  className="bg-black text-white py-4 rounded-xl"
                >
                  Update Address
                </button>
              </div>
            </div>
          )}
        </div>

        {/* SUMMARY */}
        <div className="bg-white rounded-3xl shadow p-8 h-fit">
          <h2 className="text-2xl font-bold mb-8">
            Order Summary
          </h2>

          <button
            onClick={payNow}
            disabled={loading}
            className="w-full bg-black text-white py-4 rounded-full"
          >
            {loading
              ? "Creating Order..."
              : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
}