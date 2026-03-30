"use client";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

import Attendance from "./Attendance";
import Reports from "./Reports";
import Profile from "./Profile";
import StudentNotifications from "./Notification";
import Leave from "./Leave";
import Results from "./Results";
import StudentSidebar from "./StudentSidebar";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const [status, setStatus] = useState("OUT"); // ✅ default OUT
  const [studentName, setStudentName] = useState("Student");
  const [studentEmail, setStudentEmail] = useState("");
  const [hasNewNotification, setHasNewNotification] = useState(false);
  const [loading, setLoading] = useState(true);

  /* ================= PROTECT ROUTE ================= */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const studentData = localStorage.getItem("student");
    if (studentData) {
      const savedStudent = JSON.parse(studentData);
      if (savedStudent?.name) setStudentName(savedStudent.name);
      if (savedStudent?.email) setStudentEmail(savedStudent.email);
    }

    // ❌ REMOVE OLD AUTO STATUS
    localStorage.removeItem("attendanceStatus");

    // ✅ ALWAYS START WITH OUT
    setStatus("OUT");

    setLoading(false);
  }, [navigate]);

  /* ================= FETCH UNSEEN NOTIFICATIONS ================= */
  useEffect(() => {
    const fetchUnseen = async () => {
      if (!studentEmail) return;
      try {
        const res = await axios.get(
          `http://localhost:5000/api/notifications/unseen/${studentEmail}`
        );
        setHasNewNotification(res.data.hasUnseen);
      } catch (err) {
        console.error("Error fetching unseen notifications:", err);
        setHasNewNotification(false);
      }
    };

    fetchUnseen();
    const interval = setInterval(fetchUnseen, 20000);
    return () => clearInterval(interval);
  }, [studentEmail]);

  /* ================= MARK NOTIFICATIONS AS SEEN ================= */
  useEffect(() => {
    const markSeen = async () => {
      if (location.pathname.endsWith("/notifications") && hasNewNotification) {
        try {
          await axios.post(
            `http://localhost:5000/api/notifications/mark-seen/${studentEmail}`
          );
          setHasNewNotification(false);
        } catch (err) {
          console.error("Error marking notifications as seen:", err);
        }
      }
    };
    markSeen();
  }, [location.pathname, studentEmail, hasNewNotification]);

  /* ================= RENDER CONTENT ================= */
  const renderContent = () => {
    if (location.pathname.endsWith("/attendance"))
      return <Attendance email={studentEmail} name={studentName} />;
    if (location.pathname.endsWith("/leave"))
      return <Leave email={studentEmail} />;
    if (location.pathname.endsWith("/reports")) return <Reports />;
    if (location.pathname.endsWith("/results"))
      return <Results />;
    if (location.pathname.endsWith("/notifications"))
      return <StudentNotifications email={studentEmail} />;
    if (location.pathname.endsWith("/profile"))
      return <Profile studentEmail={studentEmail} />;

    return (
      <DashboardHome
        status={status}
        setStatus={setStatus}
        studentName={studentName}
        studentEmail={studentEmail}
      />
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <StudentSidebar studentEmail={studentEmail} />
      <div className="flex-1 overflow-auto p-8">{renderContent()}</div>
    </div>
  );
}

/* ================= DASHBOARD HOME ================= */
function DashboardHome({ status, setStatus, studentName, studentEmail }) {
  const handleAttendance = async () => {
    try {
      if (status === "OUT") {
        await axios.post("http://localhost:5000/api/attendance/checkin", {
          email: studentEmail,
          fullName: studentName,
        });

        alert("✅ Successfully Checked In");
        setStatus("IN");
        localStorage.setItem("attendanceStatus", "IN");
      } else {
        await axios.post("http://localhost:5000/api/attendance/checkout", {
          email: studentEmail,
        });

        alert("✅ Successfully Checked Out");
        setStatus("OUT");
        localStorage.removeItem("attendanceStatus");
      }
    } catch (error) {
      console.error(error);
      alert("❌ Attendance Error");
    }
  };

  return (
    <>
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome, {studentName} 👋
          </h1>
          <span
            className={`inline-block mt-3 px-4 py-2 rounded-full text-sm font-semibold ${
              status === "IN"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            Current Status: {status}
          </span>
        </div>

        {/* BUTTON */}
        <button
          onClick={handleAttendance}
          className={`text-white px-6 py-2 rounded-lg font-semibold shadow-md ${
            status === "OUT"
              ? "bg-green-500 hover:bg-green-600"
              : "bg-red-500 hover:bg-red-600"
          }`}
        >
          {status === "OUT" ? "Check In" : "Check Out"}
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Days" value="24" color="text-blue-600" />
        <StatCard title="Present" value="20" color="text-green-600" />
        <StatCard title="Absent" value="4" color="text-red-600" />
        <StatCard title="Attendance %" value="83%" color="text-purple-600" />
      </div>

      {/* TABLE */}
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Recent Attendance</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border border-gray-200 rounded-xl overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-gray-600">Date</th>
                <th className="p-3 text-gray-600">Check In</th>
                <th className="p-3 text-gray-600">Check Out</th>
                <th className="p-3 text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t hover:bg-gray-50">
                <td className="p-3">10 Feb 2026</td>
                <td className="p-3">09:02 AM</td>
                <td className="p-3">04:10 PM</td>
                <td className="p-3 text-green-600 font-semibold">Present</td>
              </tr>
              <tr className="border-t hover:bg-gray-50">
                <td className="p-3">09 Feb 2026</td>
                <td className="p-3">--</td>
                <td className="p-3">--</td>
                <td className="p-3 text-red-600 font-semibold">Absent</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

/* ================= STAT CARD ================= */
function StatCard({ title, value, color }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl">
      <h3 className="text-gray-500 text-sm">{title}</h3>
      <p className={`text-3xl font-bold mt-2 ${color}`}>{value}</p>
    </div>
  );
}