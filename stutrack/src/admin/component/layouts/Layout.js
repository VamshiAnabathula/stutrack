import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./Sidebar";

const AdminLayout = () => {
  // ✅ Students state
  const [students, setStudents] = useState([]);

  // ✅ Leaves with From & To Dates
  const [leaves, setLeaves] = useState([
    {
      id: 1,
      name: "Rahul Sharma",
      fromDate: "2026-02-21",
      toDate: "2026-02-23",
      reason: "Fever",
      status: "Pending",
    },
    {
      id: 2,
      name: "Priya Patel",
      fromDate: "2026-02-25",
      toDate: "2026-02-26",
      reason: "Family Function",
      status: "Pending",
    },
    {
      id: 3,
      name: "Amit Shah",
      fromDate: "2026-03-01",
      toDate: "2026-03-03",
      reason: "Medical Leave",
      status: "Pending",
    },
  ]);

  // ✅ Notifications state added here
  const [notifications, setNotifications] = useState([]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar Section */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 p-6 ml-72">
        <Outlet
          context={{
            students,
            setStudents,
            leaves,
            setLeaves,
            notifications,
            setNotifications, // ✅ Added here
          }}
        />
      </div>
    </div>
  );
};

export default AdminLayout;