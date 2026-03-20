// src/component/Profile.js
"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Mail, Phone, Calendar, BookOpen, Clock, CalendarDays } from "lucide-react";

export default function Profile({ studentEmail }) {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
        
        {/* HEADER / COVER AREA */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-8 py-8 sm:px-12 sm:py-10 flex flex-col sm:flex-row items-center sm:items-start justify-between relative shadow-sm z-10">
          
          <div className="flex flex-col sm:flex-row items-center gap-6 w-full">
            {/* AVATAR */}
            <div className="h-28 w-28 sm:h-32 sm:w-32 rounded-full bg-white p-2 shadow-xl shrink-0">
              <div className="h-full w-full bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center text-4xl sm:text-5xl text-indigo-700 font-extrabold shadow-inner">
                {student.fullName?.charAt(0).toUpperCase()}
              </div>
            </div>

            {/* NAME & BASIC INFO & BADGE */}
            <div className="text-center sm:text-left flex-1 flex flex-col sm:flex-row sm:items-center justify-between w-full">
              <div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight drop-shadow-md">
                  {student.fullName}
                </h2>
                <div className="flex items-center justify-center sm:justify-start gap-2 mt-2 text-indigo-50 font-medium text-base">
                  <Mail className="w-5 h-5" />
                  <span className="truncate">{student.email}</span>
                </div>
              </div>
              
              {/* ACTIVE STUDENT BADGE (Right side) */}
              <div className="mt-6 sm:mt-0 flex shrink-0">
                <span className="bg-green-500 text-white text-sm font-extrabold px-4 py-2 rounded-full uppercase tracking-wider shadow-lg border-2 border-green-400 flex items-center justify-center">
                  <span className="w-2.5 h-2.5 rounded-full bg-white mr-2 animate-pulse"></span>
                  Active Student
                </span>
              </div>
            </div>
          </div>
          
        </div>

        {/* PROFILE DETAILS GRID */}
        <div className="px-8 py-8 sm:px-12 sm:py-10 bg-gray-50/50">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <span className="w-1.5 h-6 bg-indigo-500 rounded-full inline-block"></span>
            Personal Information
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <ProfileItem 
              icon={<Phone className="text-blue-500 w-6 h-6" />} 
              label="Mobile Number" 
              value={student.mobile} 
            />
            <ProfileItem 
              icon={<Calendar className="text-pink-500 w-6 h-6" />} 
              label="Date of Birth" 
              value={student.dob} 
            />
            <ProfileItem 
              icon={<BookOpen className="text-emerald-500 w-6 h-6" />} 
              label="Course Enrolled" 
              value={student.course} 
            />
            <ProfileItem 
              icon={<Clock className="text-amber-500 w-6 h-6" />} 
              label="Course Duration" 
              value={student.duration} 
            />
            <ProfileItem 
              icon={<CalendarDays className="text-purple-500 w-6 h-6" />} 
              label="Joining Date" 
              value={joiningDate} 
            />
          </div>
        </div>
        
      </div>
    </div>
  );
}

function ProfileItem({ icon, label, value }) {
  return (
    <div className="bg-white border border-gray-100 shadow-md rounded-2xl p-4 sm:p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex shrink-0 items-center justify-center group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-colors duration-300">
        {icon}
      </div>
      <div className="min-w-0 overflow-hidden">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
          {label}
        </p>
        <p className="text-base font-semibold text-gray-800 truncate" title={value || "-"}>
          {value || "-"}
        </p>
      </div>
    </div>
  );
}