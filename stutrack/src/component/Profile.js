"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Mail,
  Phone,
  Calendar,
  BookOpen,
  Clock,
  CalendarDays,
  Camera,
  Droplet,
  IndianRupee,
} from "lucide-react";

export default function Profile() {
  const [studentEmail, setStudentEmail] = useState("");
  const [student, setStudent] = useState(null);
  const [fees, setFees] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const email = localStorage.getItem("studentEmail");
    if (email) {
      setStudentEmail(email);
    } else {
      setError("Please login again");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!studentEmail) return;

    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/admissions/email/${studentEmail}`
        );

        if (res.data.success) {
          setStudent(res.data.data);

          try {
            const feesRes = await axios.get(
              `http://localhost:5000/api/fees/${res.data.data._id}`
            );

            if (feesRes.data.success) {
              setFees(feesRes.data.fees);
            } else {
              setFees({ totalFees: 0, paidFees: 0, remainingFees: 0 });
            }
          } catch (err) {
            setFees({ totalFees: 0, paidFees: 0, remainingFees: 0 });
          }
        } else {
          setError("Student not found");
        }
      } catch (err) {
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [studentEmail]);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !student) return;

    const formData = new FormData();
    formData.append("photo", file);

    try {
      setUploading(true);

      const res = await axios.put(
        `http://localhost:5000/api/upload/${student.email}`,
        formData
      );

      if (res.data.success) {
        setStudent(res.data.data);
        alert("Photo uploaded successfully!");
      }
    } catch (err) {
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500 text-lg font-medium">
        {error}
      </div>
    );
  }

  if (!student) return null;

  const joiningDate = new Date(student.createdAt).toLocaleDateString(
    "en-US",
    { year: "numeric", month: "short", day: "numeric" }
  );

  return (
    <div className="h-screen overflow-hidden bg-gray-50 px-4 sm:px-6 lg:px-8 flex justify-center items-center">

      <div className="w-full max-w-5xl h-[95vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-6 flex items-center justify-between text-white">

          <div className="flex items-center gap-5">

            <div className="h-24 w-24 rounded-full bg-white p-2 relative">
              {student.photo ? (
                <img src={student.photo} className="h-full w-full object-cover rounded-full" />
              ) : (
                <div className="h-full w-full flex items-center justify-center font-bold text-indigo-700">
                  {student.fullName?.charAt(0)}
                </div>
              )}

              <label className="absolute bottom-1 right-1 bg-black p-2 rounded-full cursor-pointer">
                <Camera size={14} />
                <input type="file" hidden onChange={handleUpload} />
              </label>
            </div>

            <div>
              <h2 className="text-2xl font-bold">{student.fullName}</h2>
              <div className="flex items-center gap-2 text-sm">
                <Mail size={14} />
                {student.email}
              </div>
            </div>

          </div>

          <span className="bg-green-500 px-4 py-1 rounded-full text-xs font-bold">
            Active
          </span>
        </div>

        {/* CONTENT */}
        <div className="px-6 py-6 bg-gray-50 flex-1 overflow-auto">

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

            <ProfileItem icon={<Phone />} label="Mobile" value={student.mobile} />
            <ProfileItem icon={<Calendar />} label="DOB" value={student.dob} />
            <ProfileItem icon={<BookOpen />} label="Course" value={student.course} />
            <ProfileItem icon={<Clock />} label="Duration" value={student.duration} />
            <ProfileItem icon={<CalendarDays />} label="Joining Date" value={joiningDate} />
            <ProfileItem icon={<Droplet />} label="Blood Group" value={student.bloodGroup} />

          </div>

          {/* ================= FEES SECTION (DISABLED INPUT STYLE) ================= */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">

            <DisabledInput label="Total Fees" value={fees?.totalFees ?? 0} />
            <DisabledInput label="Paid Fees" value={fees?.paidFees ?? 0} />
            <DisabledInput label="Remaining Fees" value={fees?.remainingFees ?? 0} />

          </div>

        </div>

        {uploading && (
          <p className="text-center pb-3 text-blue-500 text-sm">
            Uploading...
          </p>
        )}
      </div>
    </div>
  );
}

/* ================= PROFILE CARD ================= */
function ProfileItem({ icon, label, value }) {
  return (
    <div className="bg-white border rounded-2xl p-4 flex items-center gap-4 shadow-sm">
      <div className="text-indigo-600">{icon}</div>
      <div>
        <p className="text-xs text-gray-400 uppercase">{label}</p>
        <p className="text-sm font-bold text-gray-800">{value || "-"}</p>
      </div>
    </div>
  );
}

/* ================= DISABLED INPUT STYLE ================= */
function DisabledInput({ label, value }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-bold text-gray-600">{label}</label>
      <input
        value={value}
        disabled
        className="border bg-gray-100 p-2 rounded-lg font-bold text-gray-700"
      />
    </div>
  );
}