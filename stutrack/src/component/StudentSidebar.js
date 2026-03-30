// src/component/StudentSidebar.js
import {
  FaTachometerAlt,
  FaClipboardCheck,
  FaCalendarAlt,
  FaChartBar,
  FaBell,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";

import { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

export default function StudentSidebar({ studentEmail }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [hasNewNotification, setHasNewNotification] = useState(false);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH UNSEEN (FIXED) ================= */
  const fetchUnseen = useCallback(async () => {
    if (!studentEmail) return;

    try {
      const res = await axios.get(
        `http://localhost:5000/api/notifications/unseen/${studentEmail}`
      );
      setHasNewNotification(res.data.hasUnseen);
    } catch (err) {
      console.error("Error fetching unseen:", err);
    }
  }, [studentEmail]);

  useEffect(() => {
    fetchUnseen();

    const interval = setInterval(fetchUnseen, 20000);
    return () => clearInterval(interval);
  }, [fetchUnseen]);

  /* ================= MARK AS SEEN ================= */
  useEffect(() => {
    const markSeen = async () => {
      if (
        location.pathname === "/studentdashboard/notifications" &&
        hasNewNotification
      ) {
        try {
          await axios.post(
            `http://localhost:5000/api/notifications/mark-seen/${studentEmail}`
          );
          setHasNewNotification(false);
        } catch (err) {
          console.error("Error marking seen:", err);
        }
      }
    };

    markSeen();
  }, [location.pathname, studentEmail, hasNewNotification]);

  /* ================= MENU ================= */
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: <FaTachometerAlt />, path: "/studentdashboard" },
    { id: "attendance", label: "Attendance", icon: <FaClipboardCheck />, path: "/studentdashboard/attendance" },
    { id: "leave", label: "Leave", icon: <FaCalendarAlt />, path: "/studentdashboard/leave" },
    { id: "reports", label: "Reports", icon: <FaChartBar />, path: "/studentdashboard/reports" },
    { id: "results", label: "Results", icon: <FaChartBar />, path: "/studentdashboard/results" },
    { id: "notifications", label: "Notifications", icon: <FaBell />, path: "/studentdashboard/notifications" },
    { id: "profile", label: "Profile", icon: <FaUser />, path: "/studentdashboard/profile" },
  ];

  const handleClick = (path) => {
    navigate(path);
  };

  /* ================= LOGOUT (FINAL FIX) ================= */
  const handleLogout = () => {
    let attendanceStatus = localStorage.getItem("attendanceStatus");

    // ✅ fallback safety
    if (!attendanceStatus) {
      attendanceStatus = "OUT";
    }

    // ❌ block logout if not checked out
    if (attendanceStatus === "IN") {
      alert("⚠️ Please check out first before logging out!");
      return;
    }

    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (!confirmLogout) return;

    setLoading(true);

    setTimeout(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("student");
      localStorage.removeItem("studentEmail");
      localStorage.removeItem("attendanceStatus");

      navigate("/login");
    }, 500);
  };

  return (
    <div className="w-64 min-h-screen flex flex-col justify-between bg-gradient-to-b from-blue-500 to-blue-800 text-white shadow-lg">

      {/* TOP */}
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-10 flex items-center gap-2 select-none">
          🎓 StuTrack
        </h1>

        <ul className="space-y-6">
          {menuItems.map((item) => (
            <li
              key={item.id}
              onClick={() => handleClick(item.path)}
              className={`flex items-center gap-4 px-5 py-3 rounded-lg cursor-pointer transition-all duration-300
              ${location.pathname === item.path
                  ? "bg-gray-200 text-blue-700 font-semibold shadow-inner"
                  : "hover:bg-blue-600 hover:scale-105"
                }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-base font-medium">{item.label}</span>

              {/* 🔴 Notification dot */}
              {item.id === "notifications" && hasNewNotification && (
                <span className="ml-auto w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* LOGOUT */}
      <div className="p-4 border-t border-blue-400">
        <button
          onClick={handleLogout}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 
          bg-white text-blue-600 font-semibold py-3 
          rounded-lg shadow-md transition-all duration-300 
          hover:bg-blue-100 hover:scale-105 active:scale-95 
          disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <FaSignOutAlt />
          {loading ? "Logging out..." : "Logout"}
        </button>
      </div>
    </div>
  );
}