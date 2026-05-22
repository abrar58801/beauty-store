"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";

export default function AdminShell({
    children,
    session,
}: {
    children: React.ReactNode;
    session: any;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const navItems = [
        { name: "Dashboard", href: "/admin" },
        { name: "Products", href: "/admin/products" },
        { name: "Categories", href: "/admin/categories" },
        { name: "Brands", href: "/admin/brands" },
        { name: "Orders", href: "/admin/orders" },
        {
            name: "Customers",
            href: "/admin/customers",
        },
        {
            name: "Contacts",
            href: "/admin/contacts",
        },
        {
            name: "Newsletters",
            href: "/admin/newsletters",
        },
        {
            name: "Settings",
            href: "/admin/settings",
        },
        {
            name: "Reports",
            href: "/admin/reports",
        }
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="fixed top-0 left-0 right-0 h-16 bg-white shadow z-50">
                <div className="h-full px-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() =>
                                setSidebarOpen(!sidebarOpen)
                            }
                            className="lg:hidden"
                        >
                            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>

                        <Link
                            href="/admin"
                            className="text-2xl font-bold"
                        >
                            Beauty Admin
                        </Link>
                    </div>

                    <div className="relative">
                        <button
                            onClick={() =>
                                setDropdownOpen(!dropdownOpen)
                            }
                            className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-xl"
                        >
                            <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center">
                                {session?.user?.email?.charAt(0)}
                            </div>

                            <span className="hidden md:block">
                                {session?.user?.email}
                            </span>

                            <ChevronDown size={18} />
                        </button>

                        {dropdownOpen && (
                            <div className="absolute right-0 mt-3 w-48 bg-white shadow-xl rounded-2xl overflow-hidden">
                                <Link
                                    href="/"
                                    className="block px-4 py-3 hover:bg-gray-100"
                                >
                                    View Store
                                </Link>

                                <button
                                    onClick={() => signOut()}
                                    className="w-full text-left px-4 py-3 hover:bg-gray-100"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 lg:hidden"
                    onClick={() =>
                        setSidebarOpen(false)
                    }
                />
            )}

            <aside
                className={`
          fixed top-16 left-0 h-[calc(100vh-4rem)] w-72 bg-black text-white z-50
          transform transition-transform duration-300
          ${sidebarOpen
                        ? "translate-x-0"
                        : "-translate-x-full"
                    }
          lg:translate-x-0
        `}
            >
                <nav className="p-6 space-y-3">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="block px-4 py-3 rounded-xl hover:bg-white/10"
                        >
                            {item.name}
                        </Link>
                    ))}
                </nav>
            </aside>

            <main className="pt-20 lg:pl-72 p-6">
                <div className="ps-0 lg:ps-6">
                    {children}
                </div>
            </main>
        </div>
    );
}