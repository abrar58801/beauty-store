"use client";

import { signIn, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const { status } = useSession();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/admin");
    }
  }, [status, router]);

  const handleAdminLogin = async () => {
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      alert("Invalid admin credentials");
      return;
    }

    router.push("/admin");
  };

  if (status === "loading") return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-6">
      <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-xl">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Admin Login
        </h1>

        <input
          type="email"
          placeholder="Admin Email"
          className="w-full border p-4 rounded-xl mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-4 rounded-xl mb-6"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button
          onClick={handleAdminLogin}
          className="w-full bg-black text-white py-4 rounded-xl"
        >
          Login
        </button>
      </div>
    </div>
  );
}