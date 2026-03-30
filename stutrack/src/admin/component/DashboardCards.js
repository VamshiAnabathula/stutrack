import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function AdminDashboard() {

  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    const [s, c, l, a] = await Promise.all([
      axios.get("http://localhost:5000/api/admissions"),
      axios.get("http://localhost:5000/api/courses"),
      axios.get("http://localhost:5000/api/leave/all"),
      axios.get("http://localhost:5000/api/attendance/all"),
    ]);

    setStudents(s.data.data || []);
    setCourses(c.data.data || []);
    setLeaves(l.data || []);
    setAttendance(a.data || []);
  };

  /* ================= STATS ================= */

  const present = students.filter(s => s.attendance >= 75).length;
  const absent = students.length - present;

  const approvedLeaves = leaves.filter(l => l.status === "Approved").length;
  const pendingLeaves = leaves.filter(l => l.status === "Pending").length;

  /* ================= COURSE DATA ================= */

  const courseData = useMemo(() => {
    const map = {};
    students.forEach(s => {
      map[s.course] = (map[s.course] || 0) + 1;
    });

    return Object.keys(map).map(k => ({
      name: k,
      value: map[k],
    }));
  }, [students]);

  /* ================= ATTENDANCE DATA ================= */

  const attendanceData = [
    { name: "Present", value: present },
    { name: "Absent", value: absent },
  ];

  const COLORS = ["#22c55e", "#ef4444", "#3b82f6", "#f59e0b"];

  return (
    <div className="p-6 bg-gray-100 min-h-screen space-y-6">

      {/* TITLE */}
      <h1 className="text-3xl font-bold text-gray-800">
        Admin Dashboard
      </h1>

      {/* ================= CARDS ================= */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

        <Card title="Total Students" value={students.length} color="blue" />
        <Card title="Courses" value={courses.length} color="green" />
        <Card title="Present" value={present} color="emerald" />
        <Card title="Absent" value={absent} color="red" />

      </div>

      {/* ================= LEAVE CARDS ================= */}
      <div className="grid md:grid-cols-2 gap-6">

        <Card title="Approved Leaves" value={approvedLeaves} color="green" />
        <Card title="Pending Leaves" value={pendingLeaves} color="yellow" />

      </div>

      {/* ================= GRAPHS ================= */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* Attendance Pie */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="mb-4 font-semibold">Attendance Overview</h3>

          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={attendanceData}
                dataKey="value"
                outerRadius={100}
                label
              >
                {attendanceData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Course Bar */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="mb-4 font-semibold">Courses Distribution</h3>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={courseData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value">
                {courseData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* ================= QUICK INSIGHTS ================= */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="font-semibold mb-4">Quick Insights</h3>

        <div className="grid md:grid-cols-3 gap-4">

          <Insight
            label="Total Attendance Records"
            value={attendance.length}
          />

          <Insight
            label="Most Popular Course"
            value={
              courseData.sort((a, b) => b.value - a.value)[0]?.name || "-"
            }
          />

          <Insight
            label="Low Attendance Students"
            value={students.filter(s => s.attendance < 50).length}
          />

        </div>
      </div>

    </div>
  );
}

/* ================= CARD ================= */

const Card = ({ title, value, color }) => {

  const colors = {
    blue: "bg-blue-600",
    green: "bg-green-600",
    red: "bg-red-500",
    yellow: "bg-yellow-500",
    emerald: "bg-emerald-500",
  };

  return (
    <div className={`${colors[color]} text-white p-5 rounded-xl shadow`}>
      <p className="text-sm opacity-80">{title}</p>
      <h2 className="text-3xl font-bold">{value}</h2>
    </div>
  );
};

/* ================= INSIGHT ================= */

const Insight = ({ label, value }) => (
  <div className="bg-gray-50 p-4 rounded-lg text-center">
    <p className="text-sm text-gray-500">{label}</p>
    <h3 className="text-xl font-bold text-gray-800">{value}</h3>
  </div>
);