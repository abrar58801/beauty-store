"use client";

import axios from "axios";
import { useEffect, useState } from "react";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [settings, setSettings] = useState({
    contactEmail: "",
    contactPhone: "",
    contactAddress: "",
    businessHours: "",
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

  const sendMessage = async () => {
    if (
      !form.name ||
      !form.email ||
      !form.phone ||
      !form.subject ||
      !form.message
    ) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post("/api/contact", form);

      alert(res.data.message);

      setForm({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (error: any) {
      alert(
        error?.response?.data?.error ||
          "Failed to send message"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-gradient-to-b from-pink-50 to-white min-h-screen">
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <p className="text-pink-500 uppercase tracking-[0.3em] text-sm">
            Get In Touch
          </p>

          <h1 className="text-5xl font-bold mt-4">
            Contact Us
          </h1>

          <p className="text-gray-600 mt-5 max-w-2xl mx-auto">
            We'd love to hear from you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          <div className="bg-white rounded-3xl shadow-lg p-10">
            <h2 className="text-3xl font-bold mb-8">
              Send Message
            </h2>

            <div className="space-y-5">
              <input
                type="text"
                placeholder="Full Name"
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
                className="w-full border border-pink-100 rounded-2xl p-4"
              />

              <input
                type="email"
                placeholder="Email Address"
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
                className="w-full border border-pink-100 rounded-2xl p-4"
              />

              <input
                type="tel"
                placeholder="Phone Number"
                value={form.phone}
                onChange={(e) =>
                  setForm({
                    ...form,
                    phone: e.target.value,
                  })
                }
                className="w-full border border-pink-100 rounded-2xl p-4"
              />

              <input
                type="text"
                placeholder="Subject"
                value={form.subject}
                onChange={(e) =>
                  setForm({
                    ...form,
                    subject: e.target.value,
                  })
                }
                className="w-full border border-pink-100 rounded-2xl p-4"
              />

              <textarea
                rows={6}
                placeholder="Your Message"
                value={form.message}
                onChange={(e) =>
                  setForm({
                    ...form,
                    message: e.target.value,
                  })
                }
                className="w-full border border-pink-100 rounded-2xl p-4"
              />

              <button
                onClick={sendMessage}
                disabled={loading}
                className="w-full sm:w-auto bg-black text-white px-8 py-4 rounded-2xl"
              >
                {loading
                  ? "Sending..."
                  : "Send Message"}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-10">
            <h2 className="text-3xl font-bold mb-8">
              Contact Information
            </h2>

            <div className="space-y-6 text-gray-600">
              <div>
                <h3 className="font-semibold text-black">
                  Email
                </h3>
                <p>{settings.contactEmail}</p>
              </div>

              <div>
                <h3 className="font-semibold text-black">
                  Phone
                </h3>
                <p>{settings.contactPhone}</p>
              </div>

              <div>
                <h3 className="font-semibold text-black">
                  Address
                </h3>
                <p>{settings.contactAddress}</p>
              </div>

              <div>
                <h3 className="font-semibold text-black">
                  Business Hours
                </h3>
                <p>{settings.businessHours}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}