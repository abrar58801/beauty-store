"use client";

import axios from "axios";
import { useEffect, useState } from "react";

export default function NewslettersPage() {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      const res = await axios.get(
        "/api/admin/newsletters"
      );

      setSubscribers(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteSubscriber = async (
    id: string
  ) => {
    if (!confirm("Delete subscriber?")) return;

    try {
      await axios.delete(
        `/api/admin/newsletters/${id}`
      );

      fetchSubscribers();
    } catch {
      alert("Delete failed");
    }
  };

  const sendNewsletter = async () => {
    if (!subject || !message) {
      alert(
        "Subject and message required"
      );
      return;
    }

    try {
      setSending(true);

      const res = await axios.post(
        "/api/admin/newsletters/send",
        {
          subject,
          message,
        }
      );

      alert(res.data.message);

      setSubject("");
      setMessage("");
    } catch (error: any) {
      alert(
        error?.response?.data?.error ||
          "Send failed"
      );
    } finally {
      setSending(false);
    }
  };

  const filtered = subscribers.filter(
    (item) =>
      item.email
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <div className="w-full">
      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold">
          Newsletter Management
        </h1>

        <p className="text-gray-500 mt-2">
          Manage subscribers and send campaigns
        </p>
      </div>

      {/* SEND NEWSLETTER */}
      <div className="bg-white rounded-3xl shadow p-6 md:p-8 mb-10 grid gap-4">
        <h2 className="text-2xl font-bold">
          Send Newsletter
        </h2>

        <input
          value={subject}
          onChange={(e) =>
            setSubject(e.target.value)
          }
          placeholder="Newsletter Subject"
          className="w-full border p-4 rounded-xl"
        />

        <textarea
          rows={8}
          value={message}
          onChange={(e) =>
            setMessage(e.target.value)
          }
          placeholder="Write newsletter message (HTML supported)"
          className="w-full border p-4 rounded-xl"
        />

        <button
          onClick={sendNewsletter}
          disabled={sending}
          className="bg-black text-white py-4 rounded-xl disabled:opacity-50"
        >
          {sending
            ? "Sending..."
            : "Send To All Subscribers"}
        </button>
      </div>

      {/* SEARCH */}
      <div className="mb-6">
        <input
          placeholder="Search subscriber..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="w-full md:w-96 border p-4 rounded-xl"
        />
      </div>

      {/* MOBILE */}
      <div className="grid gap-4 md:hidden">
        {filtered.map((subscriber) => (
          <div
            key={subscriber.id}
            className="bg-white rounded-3xl shadow p-5"
          >
            <p className="font-semibold break-all">
              {subscriber.email}
            </p>

            <p className="text-sm text-gray-500 mt-2">
              Joined{" "}
              {new Date(
                subscriber.createdAt
              ).toLocaleDateString()}
            </p>

            <button
              onClick={() =>
                deleteSubscriber(
                  subscriber.id
                )
              }
              className="mt-4 w-full bg-red-500 text-white py-3 rounded-xl"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* DESKTOP */}
      <div className="hidden md:block bg-white rounded-3xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-5">
                  Email
                </th>
                <th className="text-left p-5">
                  Joined
                </th>
                <th className="text-left p-5">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((subscriber) => (
                <tr
                  key={subscriber.id}
                  className="border-t"
                >
                  <td className="p-5 font-medium">
                    {subscriber.email}
                  </td>

                  <td className="p-5">
                    {new Date(
                      subscriber.createdAt
                    ).toLocaleDateString()}
                  </td>

                  <td className="p-5">
                    <button
                      onClick={() =>
                        deleteSubscriber(
                          subscriber.id
                        )
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