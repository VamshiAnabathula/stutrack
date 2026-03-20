"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Notifications() {
  const [students, setStudents] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [customTitle, setCustomTitle] = useState("");
  const [customMsg, setCustomMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMsg, setModalMsg] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [currentBtnLabel, setCurrentBtnLabel] = useState("");

  // ================= FETCH ALL STUDENTS =================
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admissions");
        setStudents(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching students:", err);
        setStudents([]);
      }
    };
    fetchStudents();
  }, []);

  // ================= FETCH NOTIFICATION HISTORY =================
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/notifications");
        setNotifications(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching notifications:", err);
        setNotifications([]);
      }
    };
    fetchNotifications();
  }, []);

  // ================= SEND NOTIFICATION =================
  const sendNotification = async (title, message) => {
    if (!message || !title) return;

    const confirmed = window.confirm(
      `Are you sure you want to send this notification?\n\nTitle: ${title}\nMessage: ${message}`
    );
    if (!confirmed) return;

    const payload = { title, message, type: "general" };
    const emails = students.map((s) => s.email);

    try {
      setLoading(true);
      await axios.post(
        "http://localhost:5000/api/notifications/broadcast",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      // Add to local history
      setNotifications((prev) => [
        {
          ...payload,
          id: Date.now(),
          emails,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);

      setModalOpen(false);
      setModalMsg("");
      setModalTitle("");
      setCustomMsg("");
      setCustomTitle("");
      alert("Notification sent successfully ✅!");
    } catch (err) {
      console.error("Error sending notification:", err);
      alert("Failed to send notification. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ================= BUTTONS =================
  const predefinedButtons = [
    { label: "Holiday", color: "bg-blue-500" },
    { label: "Exam Date", color: "bg-green-500" },
    { label: "General Announcement", color: "bg-yellow-500" },
    { label: "Cultural Event", color: "bg-purple-500" },
    { label: "Fee Reminder", color: "bg-orange-500" },
    { label: "Results Declared", color: "bg-pink-500" },
  ];

  // ================= OPEN MODAL FOR BUTTON =================
  const handleButtonClick = (label) => {
    setCurrentBtnLabel(label);
    setModalTitle(label); // Default title = button label
    setModalMsg("");
    setModalOpen(true);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-700 mb-8 text-center">
        Admin Notification Dashboard
      </h1>

      {/* ================= PREDEFINED MESSAGES ================= */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Quick Notifications</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {predefinedButtons.map((btn) => (
            <button
              key={btn.label}
              disabled={loading}
              onClick={() => handleButtonClick(btn.label)}
              className={`${btn.color} hover:${btn.color.replace(
                "-500",
                "-600"
              )} text-white font-medium px-5 py-3 rounded-lg shadow-md transition`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </section>

      {/* ================= MODAL ================= */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-11/12 max-w-md shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Send Notification</h3>
            <input
              type="text"
              placeholder="Title"
              value={modalTitle}
              onChange={(e) => setModalTitle(e.target.value)}
              className="border border-gray-300 rounded-lg w-full p-3 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <textarea
              placeholder="Enter your message..."
              value={modalMsg}
              onChange={(e) => setModalMsg(e.target.value)}
              className="border border-gray-300 rounded-lg w-full p-3 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => sendNotification(modalTitle, modalMsg)}
                disabled={loading || !modalMsg.trim() || !modalTitle.trim()}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Sending..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= CUSTOM NOTIFICATION ================= */}
      <section className="mb-8 bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-2xl font-semibold mb-4">Custom Notification</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Title"
            value={customTitle}
            onChange={(e) => setCustomTitle(e.target.value)}
            className="border border-gray-300 rounded-lg flex-1 p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            placeholder="Message"
            value={customMsg}
            onChange={(e) => setCustomMsg(e.target.value)}
            className="border border-gray-300 rounded-lg flex-1 p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            disabled={loading || !customMsg.trim() || !customTitle.trim()}
            onClick={() => sendNotification(customTitle.trim(), customMsg.trim())}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </div>
      </section>

      {/* ================= NOTIFICATION HISTORY ================= */}
      <section className="bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-2xl font-semibold mb-4">Notification History</h2>
        {notifications.length > 0 ? (
          <ul className="space-y-3 max-h-96 overflow-y-auto">
            {notifications.map((n) => (
              <li
                key={n.id || n._id}
                className="bg-gray-100 p-4 rounded-lg border flex flex-col sm:flex-row justify-between items-start sm:items-center hover:bg-gray-200 transition"
              >
                <span className="font-medium">{n.title || n.message}</span>
                <span className="text-sm text-gray-500 mt-2 sm:mt-0">
                  {new Date(n.createdAt || n.time).toLocaleString()} | Recipients:{" "}
                  {Array.isArray(n.emails) ? n.emails.length : 0}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No notifications sent yet.</p>
        )}
      </section>
    </div>
  );
}