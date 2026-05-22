"use client";

import axios from "axios";
import { useEffect, useState } from "react";

export default function ContactsPage() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await axios.get("/api/admin/contacts");
      setContacts(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteContact = async (id: string) => {
    if (!confirm("Delete this message?")) return;

    try {
      await axios.delete(`/api/admin/contacts/${id}`);
      fetchContacts();
    } catch {
      alert("Delete failed");
    }
  };

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      contact.email
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      contact.subject
        ?.toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <div className="w-full">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
        <h1 className="text-3xl md:text-4xl font-bold">
          Contact Messages
        </h1>

        <input
          placeholder="Search messages..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="w-full md:w-96 border p-4 rounded-xl"
        />
      </div>

      {/* MOBILE CARDS */}
      <div className="grid gap-4 md:hidden">
        {filteredContacts.map((contact) => (
          <div
            key={contact.id}
            className="bg-white rounded-3xl shadow p-5"
          >
            <h2 className="text-xl font-bold">
              {contact.name}
            </h2>

            <p className="text-gray-500 mt-1">
              {contact.email}
            </p>

            {contact.phone && (
              <p className="text-gray-500">
                {contact.phone}
              </p>
            )}

            <p className="font-semibold mt-4">
              {contact.subject}
            </p>

            <p className="text-gray-600 mt-3 break-words">
              {contact.message}
            </p>

            <p className="text-sm text-gray-400 mt-4">
              {new Date(
                contact.createdAt
              ).toLocaleString()}
            </p>

            <button
              onClick={() =>
                deleteContact(contact.id)
              }
              className="mt-5 px-5 py-3 bg-red-500 text-white rounded-xl w-full"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block bg-white rounded-3xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px]">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-5">
                  Name
                </th>
                <th className="text-left p-5">
                  Email
                </th>
                <th className="text-left p-5">
                  Phone
                </th>
                <th className="text-left p-5">
                  Subject
                </th>
                <th className="text-left p-5">
                  Message
                </th>
                <th className="text-left p-5">
                  Date
                </th>
                <th className="text-left p-5">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredContacts.map((contact) => (
                <tr
                  key={contact.id}
                  className="border-t align-top"
                >
                  <td className="p-5 font-semibold">
                    {contact.name}
                  </td>

                  <td className="p-5">
                    {contact.email}
                  </td>

                  <td className="p-5">
                    {contact.phone || "-"}
                  </td>

                  <td className="p-5 font-medium">
                    {contact.subject}
                  </td>

                  <td className="p-5 max-w-xs break-words text-gray-600">
                    {contact.message}
                  </td>

                  <td className="p-5 text-sm text-gray-500">
                    {new Date(
                      contact.createdAt
                    ).toLocaleString()}
                  </td>

                  <td className="p-5">
                    <button
                      onClick={() =>
                        deleteContact(contact.id)
                      }
                      className="px-4 py-2 bg-red-500 text-white rounded-xl"
                    >
                      Delete
                    </button>
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