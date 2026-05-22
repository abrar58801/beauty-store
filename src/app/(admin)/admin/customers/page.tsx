"use client";

import axios from "axios";
import { useEffect, useState } from "react";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await axios.get("/api/admin/customers");
      setCustomers(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const toggleBlock = async (
    id: string,
    currentStatus: boolean
  ) => {
    try {
      await axios.patch(`/api/admin/customers/${id}`, {
        isBlocked: !currentStatus,
      });

      fetchCustomers();
    } catch {
      alert("Update failed");
    }
  };

  const deleteCustomer = async (id: string) => {
    if (!confirm("Delete customer?")) return;

    try {
      await axios.delete(`/api/admin/customers/${id}`);
      fetchCustomers();
    } catch {
      alert("Delete failed");
    }
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      customer.email
        ?.toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
        <h1 className="text-3xl md:text-4xl font-bold">
          Customers
        </h1>

        <input
          placeholder="Search customer..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="w-full md:w-80 border p-4 rounded-xl"
        />
      </div>

      {/* MOBILE CARDS */}
      <div className="grid gap-4 md:hidden">
        {filteredCustomers.map((customer) => (
          <div
            key={customer.id}
            className="bg-white rounded-3xl shadow p-5"
          >
            <h2 className="text-xl font-bold">
              {customer.name || "No Name"}
            </h2>

            <p className="text-gray-500 mt-1">
              {customer.email}
            </p>

            <div className="mt-4 space-y-2 text-sm">
              <p>
                Orders: {customer.totalOrders}
              </p>

              <p>
                Spent: ₹{customer.totalSpent}
              </p>

              <p>
                Joined:{" "}
                {new Date(
                  customer.createdAt
                ).toLocaleDateString()}
              </p>

              <p>
                Status:{" "}
                {customer.isBlocked ? (
                  <span className="text-red-500">
                    Blocked
                  </span>
                ) : (
                  <span className="text-green-500">
                    Active
                  </span>
                )}
              </p>
            </div>

            <div className="flex gap-3 mt-5">
              <button
                onClick={() =>
                  toggleBlock(
                    customer.id,
                    customer.isBlocked
                  )
                }
                className={`px-4 py-2 rounded-xl text-white ${
                  customer.isBlocked
                    ? "bg-green-500"
                    : "bg-yellow-500"
                }`}
              >
                {customer.isBlocked
                  ? "Unblock"
                  : "Block"}
              </button>

              <button
                onClick={() =>
                  deleteCustomer(customer.id)
                }
                className="px-4 py-2 bg-red-500 text-white rounded-xl"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block bg-white rounded-3xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-5">
                  Name
                </th>
                <th className="text-left p-5">
                  Email
                </th>
                <th className="text-left p-5">
                  Orders
                </th>
                <th className="text-left p-5">
                  Total Spent
                </th>
                <th className="text-left p-5">
                  Joined
                </th>
                <th className="text-left p-5">
                  Status
                </th>
                <th className="text-left p-5">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredCustomers.map((customer) => (
                <tr
                  key={customer.id}
                  className="border-t"
                >
                  <td className="p-5 font-semibold">
                    {customer.name || "No Name"}
                  </td>

                  <td className="p-5">
                    {customer.email}
                  </td>

                  <td className="p-5">
                    {customer.totalOrders}
                  </td>

                  <td className="p-5">
                    ₹{customer.totalSpent}
                  </td>

                  <td className="p-5">
                    {new Date(
                      customer.createdAt
                    ).toLocaleDateString()}
                  </td>

                  <td className="p-5">
                    {customer.isBlocked ? (
                      <span className="text-red-500 font-medium">
                        Blocked
                      </span>
                    ) : (
                      <span className="text-green-500 font-medium">
                        Active
                      </span>
                    )}
                  </td>

                  <td className="p-5">
                    <div className="flex gap-3">
                      <button
                        onClick={() =>
                          toggleBlock(
                            customer.id,
                            customer.isBlocked
                          )
                        }
                        className={`px-4 py-2 rounded-xl text-white ${
                          customer.isBlocked
                            ? "bg-green-500"
                            : "bg-yellow-500"
                        }`}
                      >
                        {customer.isBlocked
                          ? "Unblock"
                          : "Block"}
                      </button>

                      <button
                        onClick={() =>
                          deleteCustomer(
                            customer.id
                          )
                        }
                        className="px-4 py-2 bg-red-500 text-white rounded-xl"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}