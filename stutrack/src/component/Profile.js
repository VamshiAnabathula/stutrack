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
} from "lucide-react";

export default function Profile({ studentEmail }) {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!studentEmail) return;

    const fetchStudent = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/admissions/email/${studentEmail}`
        );

        if (res.data.success) {
          setStudent(res.data.data);
        } else {
          setError("Student not found");
        }
      } catch (err) {
        setError("Error fetching student data");
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [studentEmail]);

  // ================= IMAGE UPLOAD (UPDATED 🔥) =================
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("photo", file);

    try {
      setUploading(true);

      // ✅ IMPORTANT CHANGE
      const res = await axios.put(
        `http://localhost:5000/api/upload/${student.email}`,
        formData
      );
      if (res.data.success) {
      setStudent(res.data.data);
      alert("✅ Photo uploaded successfully!");
    }

    } catch (err) {
      console.log(err);
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
      <div className="flex justify-center items-center h-screen bg-gray-50 text-red-500 text-lg font-medium">
        {error}
      </div>
    );
  }

  if (!student) return null;

  const joiningDate = new Date(student.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 flex justify-center items-start pt-8 sm:pt-14">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 sm:px-10 py-8 sm:py-10 flex flex-col sm:flex-row items-center sm:items-start justify-between">

          <div className="flex flex-col sm:flex-row items-center gap-6 w-full">

            {/* AVATAR */}
            <div className="h-28 w-28 sm:h-32 sm:w-32 rounded-full bg-white p-2 shadow-xl shrink-0 relative group">

              <div className="h-full w-full rounded-full overflow-hidden shadow-inner">
                {student.photo ? (
                  <img
                    src={student.photo}
                    alt="profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-4xl sm:text-5xl text-indigo-700 font-extrabold">
                    {student.fullName?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* CAMERA ICON */}
              <label className="absolute bottom-1 right-1 bg-black text-white p-2 rounded-full cursor-pointer hover:bg-gray-800 shadow-lg">
                <Camera size={16} />
                <input type="file" hidden onChange={handleUpload} />
              </label>
            </div>

            {/* NAME + EMAIL */}
            <div className="text-center sm:text-left flex-1 flex flex-col sm:flex-row sm:items-center justify-between w-full">
              <div>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
                  {student.fullName}
                </h2>
                <div className="flex items-center justify-center sm:justify-start gap-2 mt-2 text-indigo-100 text-sm sm:text-base">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="break-all">{student.email}</span>
                </div>
              </div>

              {/* ACTIVE BADGE */}
              <div className="mt-5 sm:mt-0 flex">
                <span className="bg-green-500 text-white text-xs sm:text-sm font-extrabold px-4 py-2 rounded-full uppercase tracking-wider shadow-lg border-2 border-green-400 flex items-center">
                  <span className="w-2.5 h-2.5 rounded-full bg-white mr-2 animate-pulse"></span>
                  Active Student
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* DETAILS */}
        <div className="px-6 sm:px-10 py-8 sm:py-10 bg-gray-50/60">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <span className="w-1.5 h-6 bg-indigo-500 rounded-full"></span>
            Personal Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            <ProfileItem icon={<Phone />} label="Mobile Number" value={student.mobile} />
            <ProfileItem icon={<Calendar />} label="Date of Birth" value={student.dob} />
            <ProfileItem icon={<BookOpen />} label="Course Enrolled" value={student.course} />
            <ProfileItem icon={<Clock />} label="Course Duration" value={student.duration} />
            <ProfileItem icon={<CalendarDays />} label="Joining Date" value={joiningDate} />
          </div>
        </div>

        {uploading && (
          <p className="text-center pb-4 text-blue-500 text-sm">
            Uploading...
          </p>
        )}
      </div>
    </div>
  );
}

// ================= CARD =================
function ProfileItem({ icon, label, value }) {
  return (
    <div className="group bg-white/80 backdrop-blur-md border border-gray-100 shadow-sm hover:shadow-xl rounded-2xl p-4 sm:p-5 transition-all duration-300 flex items-center gap-4 hover:-translate-y-1 hover:border-indigo-200">

      <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[10px] sm:text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
          {label}
        </p>
        <p className="text-sm sm:text-base font-bold text-gray-800 truncate">
          {value || "-"}
        </p>
      </div>
    </div>
  );
}