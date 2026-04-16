import { NavLink, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaEnvelope,
  FaBell,
  FaClipboardList,
  FaSignOutAlt,
  FaClock,
  FaBook,
  FaMoneyBillWave   // ✅ NEW ICON
} from "react-icons/fa";
import { useState } from "react";

const Sidebar = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const menuItems = [
    { name: "Dashboard", path: "/admindashboard", icon: <FaTachometerAlt /> },
    { name: "Manage Students", path: "/admindashboard/students", icon: <FaUsers /> },

    /* COURSES MENU */
    { name: "Courses", path: "/admindashboard/courses", icon: <FaBook /> },

    { name: "Leave Approvals", path: "/admindashboard/leave", icon: <FaEnvelope /> },
    { name: "Notifications", path: "/admindashboard/notifications", icon: <FaBell /> },
    { name: "Upload Marks", path: "/admindashboard/marks", icon: <FaClipboardList /> },
    { name: "Student Attendance", path: "/admindashboard/attendance", icon: <FaClock /> }
  ];

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (!confirmLogout) return;

    setLoading(true);

    setTimeout(() => {
      localStorage.removeItem("adminLoggedIn");
      navigate("/adminlogin");
    }, 500);
  };

  return (
    <div className="fixed left-0 top-0 h-screen w-72 bg-gradient-to-br from-sky-500 via-blue-600 to-blue-700 text-white shadow-2xl flex flex-col">

      {/* HEADER */}
      <div className="p-6 text-2xl font-bold border-b border-blue-400 text-center tracking-wide">
        🎓 Admin Panel
      </div>

      {/* MENU */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-3">

        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === "/admindashboard"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                isActive
                  ? "bg-white text-blue-600 font-semibold shadow-lg scale-105"
                  : "hover:bg-blue-500/70 hover:shadow-md hover:scale-105"
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            {item.name}
          </NavLink>
        ))}

      </div>

      {/* LOGOUT */}
      <div className="p-4 border-t border-blue-400 bg-blue-700">

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
};

export default Sidebar;