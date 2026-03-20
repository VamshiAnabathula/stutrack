// src/student/components/StudentNotifications.js
"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function StudentNotifications({ email }) {
  const [notifications, setNotifications] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [unseenCount, setUnseenCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  /* ================= FETCH BROADCAST & PERSONAL NOTIFICATIONS ================= */
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!email) return;
      try {
        const res = await axios.get(
          `http://localhost:5000/api/notifications/student/${email}`
        );
        const sorted = Array.isArray(res.data)
          ? res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          : [];
        setNotifications(sorted);

        // Count unseen notifications
        const unseen = sorted.filter((n) => !n.seen).length;
        setUnseenCount(unseen);
      } catch (err) {
        console.error("Error fetching notifications:", err);
        setNotifications([]);
        setUnseenCount(0);
      }
    };

    fetchNotifications();
  }, [email]);

  /* ================= FETCH LEAVE NOTIFICATIONS ================= */
  useEffect(() => {
    const fetchLeaves = async () => {
      if (!email) return;
      try {
        const res = await axios.get(`http://localhost:5000/api/leave/student/${email}`);
        const filtered = Array.isArray(res.data)
          ? res.data
              .filter((leave) => leave.status === "Approved" || leave.status === "Rejected")
              .map((leave) => ({
                id: leave._id,
                title: `Leave ${leave.status}`,
                message: `Your leave from ${new Date(
                  leave.fromDate
                ).toLocaleDateString()} to ${new Date(
                  leave.toDate
                ).toLocaleDateString()} has been ${leave.status.toLowerCase()}.`,
                createdAt: leave.updatedAt,
                seen: true, // leave notifications are always seen on arrival
              }))
          : [];
        setLeaves(filtered);
      } catch (err) {
        console.error("Error fetching leave notifications:", err);
        setLeaves([]);
      }
    };

    fetchLeaves();
  }, [email]);

  /* ================= MARK ALL NOTIFICATIONS AS SEEN ================= */
  const markAllSeen = async () => {
    try {
      await axios.post(`http://localhost:5000/api/notifications/mark-seen/${email}`);
      setNotifications((prev) => prev.map((n) => ({ ...n, seen: true })));
      setUnseenCount(0);
    } catch (err) {
      console.error("Error marking notifications as seen:", err);
    }
  };

  /* ================= COMBINE ADMIN + LEAVE NOTIFICATIONS ================= */
  const combinedNotifications = [...notifications, ...leaves].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  /* ================= FILTER BY SEARCH QUERY ================= */
  const filteredNotifications = combinedNotifications.filter(
    (n) =>
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
        <h1 className="text-3xl font-bold text-gray-700">Notifications</h1>

        {unseenCount > 0 && (
          <div
            onClick={markAllSeen}
            className="relative cursor-pointer group"
            title="Click to mark all as seen"
          >
            {/* Bell Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-9 w-9 text-gray-600 transition-colors duration-300 group-hover:text-gray-800"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14V11a6 6 0 10-12 0v3c0 .386-.149.735-.395 1.005L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>

            {/* Animated Red Dot */}
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-ping">
              {unseenCount}
            </span>
          </div>
        )}
      </div>

      {/* ================= SEARCH BAR ================= */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search notifications..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full border rounded-xl p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
        />
      </div>

      {/* ================= NOTIFICATIONS LIST ================= */}
      {filteredNotifications.length === 0 ? (
        <p className="text-gray-500 text-center py-16 text-lg">
          🎉 No notifications found.
        </p>
      ) : (
        <div className="space-y-4">
          {filteredNotifications.map((n) => (
            <div
              key={n.id || n._id}
              className={`border rounded-2xl p-5 shadow-lg transition transform hover:-translate-y-1 hover:shadow-2xl duration-300 ${
                !n.seen ? "bg-blue-50 border-blue-300" : "bg-white border-gray-200"
              }`}
            >
              <h3 className="font-semibold text-lg text-gray-800">{n.title}</h3>
              <p className="text-gray-600 mt-2">{n.message}</p>
              <p className="text-xs text-gray-400 mt-2">
                {new Date(n.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}