import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddStudent = () => {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);

  const [student, setStudent] = useState({
    fullName: "",
    dob: "",
    mobile: "",
    email: "",
    address: "",
    course: "",
    duration: "",
    bloodGroup: "",
  });

  const [fees, setFees] = useState({
    totalAmount: 0,
    feesPaid: 0,
    remainingFees: 0,
  });

  const today = new Date().toISOString().split("T")[0];

  /* ================= FETCH COURSES ================= */
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/courses");
        const courseData = res.data.data || res.data;
        setCourses(courseData);
      } catch (error) {
        console.log("Error loading courses", error);
      }
    };

    fetchCourses();
  }, []);

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "course") {
      const selectedCourse = courses.find(
        (c) => c.courseName === value
      );

      const total = Number(selectedCourse?.fees || 0);

      setStudent({
        ...student,
        course: value,
        duration: selectedCourse?.duration || "",
      });

      setFees({
        totalAmount: total,
        feesPaid: 0,
        remainingFees: total,
      });
    } 
    else if (name === "feesPaid") {
      const paid = Number(value || 0);
      const total = Number(fees.totalAmount || 0);

      let remaining = total - paid;
      if (remaining < 0) remaining = 0;

      setFees({
        ...fees,
        feesPaid: paid,
        remainingFees: remaining,
      });
    } 
    else {
      setStudent({
        ...student,
        [name]: value,
      });
    }
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!/^\d{10}$/.test(student.mobile)) {
      alert("Mobile number must be exactly 10 digits.");
      return;
    }

    try {
      // 1. Create Student (WITH FEES FIX)
      const res = await axios.post(
        "http://localhost:5000/api/admissions",
        {
          ...student,
          totalFees: fees.totalAmount,
          paidFees: fees.feesPaid,
        }
      );

      const studentId = res.data.data._id;

      // 2. Create Fees separately (backup table)
      await axios.post("http://localhost:5000/api/fees", {
        studentId,
        totalFees: fees.totalAmount,
        paidFees: fees.feesPaid,
      });

      alert("Student Added Successfully ✅");
      navigate("/admindashboard/students");

    } catch (error) {
      console.log(error);
      alert("Error saving student ❌");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">

      <button
        onClick={() => navigate(-1)}
        className="mb-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md transition-all"
      >
        ← Back
      </button>

      <div className="flex items-start justify-center">
        <div className="bg-white w-full max-w-4xl rounded-2xl shadow-lg border border-gray-100 overflow-hidden mt-2 sm:mt-4">

          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-5 sm:p-6 text-white relative">
            <div className="absolute inset-0 bg-black opacity-10"></div>
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Add New Student
              </h2>
              <p className="mt-1 text-indigo-100 text-sm font-medium">
                Register a new student into the system
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-5 sm:p-8">

            {/* ================= PERSONAL INFO ================= */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-3">
                <span className="w-1.5 h-5 bg-blue-500 rounded-full inline-block"></span>
                Personal & Contact Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">

                <Input label="Full Name" name="fullName" value={student.fullName} onChange={handleChange} />

                <Input label="Date of Birth" type="date" name="dob" value={student.dob} onChange={handleChange} max={today} />

                <Input label="Mobile Number" name="mobile" value={student.mobile} onChange={handleChange} />

                <Input label="Email Address" type="email" name="email" value={student.email} onChange={handleChange} />

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-700">Blood Group</label>
                  <select
                    name="bloodGroup"
                    value={student.bloodGroup}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-2.5 rounded-lg"
                    required
                  >
                    <option value="">Select Blood Group</option>
                    <option>A+</option><option>B+</option><option>O+</option>
                    <option>AB+</option><option>A-</option><option>B-</option>
                    <option>O-</option><option>AB-</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <textarea
                    name="address"
                    value={student.address}
                    onChange={handleChange}
                    className="w-full border p-2.5 rounded-lg"
                    placeholder="Enter address"
                    required
                  />
                </div>

              </div>
            </div>

            {/* ================= ACADEMIC ================= */}
            <div className="mb-4">
              <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-3">
                Academic Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">

                <select
                  name="course"
                  value={student.course}
                  onChange={handleChange}
                  className="border p-2.5 rounded-lg"
                >
                  <option value="">Select Course</option>
                  {courses.map((course) => (
                    <option key={course._id} value={course.courseName}>
                      {course.courseName}
                    </option>
                  ))}
                </select>

                <Input label="Duration" value={student.duration} readOnly />

                <Input label="Total Fees" value={fees.totalAmount} readOnly />

                <Input
                  label="Paid Fees"
                  name="feesPaid"
                  value={fees.feesPaid}
                  onChange={handleChange}
                />

                <Input
                  label="Remaining Fees"
                  value={fees.remainingFees}
                  readOnly
                />

              </div>
            </div>

            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg mt-4">
              Save Student
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

/* ================= INPUT COMPONENT ================= */
const Input = ({ label, ...props }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-bold text-gray-700">{label}</label>
    <input className="border p-2.5 rounded-lg" {...props} />
  </div>
);

export default AddStudent;