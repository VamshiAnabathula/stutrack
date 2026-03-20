import { useState } from "react";
import { Outlet } from "react-router-dom";
import Layout from "../component/layouts/Layout";
import { studentsData, leaveData } from "../dummy/dummyData";

const AdminPage = () => {
  const [students, setStudents] = useState(studentsData);
  const [leaves, setLeaves] = useState(leaveData);
  const [notifications, setNotifications] = useState([]);

  return (
    <Layout>
      <Outlet context={{ students, setStudents, leaves, setLeaves, notifications, setNotifications }} />
    </Layout>
  );
};

export default AdminPage;
