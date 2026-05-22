"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function SignupPage() {
  const router = useRouter();
  const { status } = useSession();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/account");
    }
  }, [status, router]);

  const register = async () => {
    try {
      setError("");

      await axios.post("/api/auth/register", form);

      alert("Registration successful");

      router.push("/login");
    } catch (err: any) {
      setError(
        err.response?.data?.error || "Registration failed"
      );
    }
  };

  if (status === "loading") {
    return null;
  }

  if (status === "authenticated") {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl">
        <h1 className="text-3xl font-bold mb-6">Signup</h1>

        {error && (
          <div className="mb-4 text-red-500 text-sm">
            {error}
          </div>
        )}

        <input
          className="w-full border p-4 rounded-xl mb-4"
          placeholder="Name"
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          className="w-full border p-4 rounded-xl mb-4"
          placeholder="Email"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="password"
          className="w-full border p-4 rounded-xl mb-4"
          placeholder="Password"
          onChange={(e) =>
            setForm({
              ...form,
              password: e.target.value,
            })
          }
        />

        <button
          onClick={register}
          className="w-full bg-pink-500 text-white py-4 rounded-xl"
        >
          Create Account
        </button>
      </div>
    </div>
  );
}