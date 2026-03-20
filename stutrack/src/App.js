// src/App.js
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

/* ================= STUDENT ================= */
import Login from "./component/st-login";
import StudentDashboard from "./component/StudentDashboard";
import AdmissionForm from "./component/student-register";

/* ================= ADMIN ================= */
import AdminLayout from "./admin/component/layouts/Layout";
import AdminLogin from "./admin/component/adminlogin";
import DashboardCards from "./admin/component/DashboardCards";
import ManageStudents from "./admin/component/ManageStudents";
import LeaveApprovals from "./admin/component/LeaveApprovals";
import Notifications from "./admin/component/Notifications";
import UploadMarks from "./admin/component/UploadMarks";
import AddStudent from "./admin/component/addstudent";
import CoursesPage from "./admin/component/CoursesPage";

/* ================= NEW PAGE ================= */
import AdminAttendance from "./component/AdminAttendance";
import EditStudent from "./admin/component/EditStudent";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================= DEFAULT ================= */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* ================= STUDENT ================= */}
        <Route path="/login" element={<Login />} />
        <Route path="/student-register" element={<AdmissionForm />} />

        {/* ================= STUDENT DASHBOARD ================= */}
        <Route path="/studentdashboard/*" element={<StudentDashboard />} />

        {/* ================= ADMIN ================= */}
        <Route path="/adminlogin" element={<AdminLogin />} />

        <Route path="/admindashboard" element={<AdminLayout />}>

          <Route index element={<DashboardCards />} />

          <Route path="students" element={<ManageStudents />} />

          <Route path="courses" element={<CoursesPage />} />

          <Route path="leave" element={<LeaveApprovals />} />

          <Route path="notifications" element={<Notifications />} />

          <Route path="marks" element={<UploadMarks />} />

          <Route path="addstudent" element={<AddStudent />} />

          <Route path="editstudent/:id" element={<EditStudent />} />

          <Route path="attendance" element={<AdminAttendance />} />

        </Route>

        {/* ================= 404 ================= */}
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;