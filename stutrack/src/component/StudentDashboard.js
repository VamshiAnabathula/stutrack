"use client";
import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

import Attendance from "./Attendance";
import Reports from "./Reports";
import Profile from "./Profile";
import StudentNotifications from "./Notification";
import Leave from "./Leave";
import Results from "./Results";
import StudentSidebar from "./StudentSidebar";

/* ================= MAIN DASHBOARD ================= */
export default function StudentDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const [status, setStatus] = useState("OUT");
  const [studentName, setStudentName] = useState("Student");
  const [studentEmail, setStudentEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    const studentData = JSON.parse(localStorage.getItem("student"));
    if (studentData) {
      setStudentName(studentData.name);
      setStudentEmail(studentData.email);
    }

    setStatus(localStorage.getItem("attendanceStatus") || "OUT");
    setLoading(false);
  }, [navigate]);

  const renderContent = () => {
    if (location.pathname.endsWith("/attendance"))
      return <Attendance email={studentEmail} />;
    if (location.pathname.endsWith("/leave"))
      return <Leave email={studentEmail} />;
    if (location.pathname.endsWith("/reports")) return <Reports />;
    if (location.pathname.endsWith("/results")) return <Results />;
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

  if (loading) return <div className="p-10">Loading...</div>;

  return (
    <div className="flex h-screen bg-gray-100">
      <StudentSidebar studentEmail={studentEmail} />
      <div className="flex-1 p-6 overflow-auto">{renderContent()}</div>
    </div>
  );
}

/* ================= DASHBOARD HOME ================= */
function DashboardHome({ status, setStatus, studentName, studentEmail }) {
  const [attendance, setAttendance] = useState([]);
  const [student, setStudent] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    present: 0,
    absent: 0,
    percentage: 0,
  });

  const fetchData = useCallback(async () => {
    try {
      const attRes = await axios.get(
        `http://localhost:5000/api/attendance/student/${studentEmail}`
      );

      const profileRes = await axios.get(
        `http://localhost:5000/api/admissions/email/${studentEmail}`
      );

      const data = attRes.data;
      setAttendance(data);

      if (profileRes.data.success) {
        setStudent(profileRes.data.data);
      }

      let total = data.length;
      let present = data.filter((a) => a.checkIn && a.checkOut).length;
      let absent = total - present;
      let percentage = total ? ((present / total) * 100).toFixed(0) : 0;

      setStats({ total, present, absent, percentage });
    } catch (err) {
      console.error(err);
    }
  }, [studentEmail]);

  useEffect(() => {
    if (studentEmail) fetchData();
  }, [studentEmail, fetchData]);

  const handleAttendance = async () => {
    try {
      if (status === "OUT") {
        await axios.post("http://localhost:5000/api/attendance/checkin", {
          email: studentEmail,
          fullName: studentName,
        });
        setStatus("IN");
        localStorage.setItem("attendanceStatus", "IN");
      } else {
        await axios.post("http://localhost:5000/api/attendance/checkout", {
          email: studentEmail,
        });
        setStatus("OUT");
        localStorage.setItem("attendanceStatus", "OUT");
      }
      fetchData();
    } catch {
      alert("Error");
    }
  };

  return (
    <div className="space-y-6">

      {/* 🔥 UPDATED HEADER */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-2xl shadow-lg flex flex-col md:flex-row justify-between items-center gap-6">

        {/* LEFT SIDE */}
        <div>
          <h1 className="text-3xl font-bold">
            Welcome, 
            {student?.fullName || studentName}
          </h1>
          <p className="text-sm opacity-90 mt-1">
            {student?.course}
          </p>

          <span
            className={`mt-4 inline-block px-4 py-1 rounded-full text-sm font-semibold ${
              status === "IN" ? "bg-green-400" : "bg-red-400"
            }`}
          >
            {status === "IN" ? "Checked In" : "Checked Out"}
          </span>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-6">

          {/* BUTTON */}
          <button
            onClick={handleAttendance}
            className={`px-6 py-2 rounded-full font-semibold shadow-lg transition hover:scale-105 ${
              status === "OUT"
                ? "bg-green-500 hover:bg-green-600"
                : "bg-red-500 hover:bg-red-600"
            }`}
          >
            {status === "OUT" ? "Check In" : "Check Out"}
          </button>

          {/* BIG PROFILE */}
          <div className="w-16 h-16 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white text-blue-600 flex items-center justify-center text-xl font-bold">
            {student?.photo ? (
              <img
                src={student.photo}
                alt="profile"
                className="w-full h-full object-cover"
              />
            ) : (
              (studentName?.charAt(0) || "S").toUpperCase()
            )}
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Days" value={stats.total} color="blue" />
        <StatCard title="Present" value={stats.present} color="green" />
        <StatCard title="Absent" value={stats.absent} color="red" />
        <StatCard title="Attendance %" value={stats.percentage + "%"} color="purple" />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <div className="p-4 border-b font-bold text-lg">
          Recent Attendance
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-center">
            <thead className="bg-blue-100 text-blue-800">
              <tr>
                <th className="p-3">Date</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Hours</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {attendance.slice(0, 7).map((a, i) => {
                const present = a.checkIn && a.checkOut;
                return (
                  <tr key={i} className="border-t hover:bg-blue-50 transition">
                    <td className="p-3">
                      {new Date(a.date).toLocaleDateString()}
                    </td>
                    <td>
                      {a.checkIn
                        ? new Date(a.checkIn).toLocaleTimeString()
                        : "--"}
                    </td>
                    <td>
                      {a.checkOut
                        ? new Date(a.checkOut).toLocaleTimeString()
                        : "--"}
                    </td>
                    <td className="font-semibold text-green-600">
                      {calculateHours(a.checkIn, a.checkOut)}
                    </td>
                    <td>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          present
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {present ? "Present" : "Absent"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ================= HOURS ================= */
function calculateHours(checkIn, checkOut) {
  if (!checkIn || !checkOut) return "--";
  const diff =
    (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60);
  return diff.toFixed(2) + "h";
}

/* ================= CARD ================= */
function StatCard({ title, value, color }) {
  const colors = {
    blue: "from-blue-500 to-blue-700",
    green: "from-green-500 to-green-700",
    red: "from-red-500 to-red-700",
    purple: "from-purple-500 to-purple-700",
  };

  return (
    <div
      className={`bg-gradient-to-r ${colors[color]} text-white p-5 rounded-2xl shadow-md hover:scale-105 transition`}
    >
      <p className="text-sm opacity-80">{title}</p>
      <h2 className="text-2xl font-bold mt-1">{value}</h2>
    </div>
  );
}