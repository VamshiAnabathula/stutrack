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
    fees: "",
    bloodGroup: "", // ✅ NEW
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
      const selectedCourse = courses.find((c) => c.courseName === value);
      setStudent({
        ...student,
        course: value,
        duration: selectedCourse?.duration || "",
        fees: selectedCourse?.fees || "",
      });
    } else {
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
      await axios.post("http://localhost:5000/api/admissions", student);
      alert("Student Added Successfully ✅");
      navigate("/admindashboard/students");
    } catch (error) {
      console.log(error);
      alert("Error saving student ❌");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">

      {/* 🔙 BACK BUTTON */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md transition-all"
      >
        ← Back
      </button>

      <div className="flex items-start justify-center">
        <div className="bg-white w-full max-w-4xl rounded-2xl shadow-lg border border-gray-100 overflow-hidden mt-2 sm:mt-4">
          
          {/* HEADER */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-5 sm:p-6 text-white relative">
            <div className="absolute inset-0 bg-black opacity-10"></div>
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Add New Student</h2>
              <p className="mt-1 text-indigo-100 text-sm font-medium">
                Register a new student into the system
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-5 sm:p-8">
            
            {/* ================= PERSONAL ================= */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-3">
                <span className="w-1.5 h-5 bg-blue-500 rounded-full inline-block"></span>
                Personal & Contact Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                
                <Input label="Full Name" name="fullName" value={student.fullName} onChange={handleChange} placeholder="Enter full name" icon="👤" />

                <Input label="Date of Birth" type="date" name="dob" value={student.dob} onChange={handleChange} max={today} />

                <Input label="Mobile Number" name="mobile" value={student.mobile} onChange={handleChange} placeholder="Enter 10-digit mobile number" icon="📞" pattern="[0-9]{10}" title="Mobile number must be exactly 10 digits" />

                <Input label="Email Address" type="email" name="email" value={student.email} onChange={handleChange} placeholder="Enter email address" icon="✉️" />

                {/* ✅ BLOOD GROUP */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-700">Blood Group</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                      <span className="text-gray-400 text-sm">🩸</span>
                    </div>
                    <select
                      name="bloodGroup"
                      value={student.bloodGroup}
                      onChange={handleChange}
                      className="w-full pl-8 border border-gray-300 p-2.5 rounded-lg bg-white text-gray-800 text-sm font-medium cursor-pointer focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm appearance-none"
                      required
                    >
                      <option value="" disabled className="text-gray-400">Select Blood Group</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>

                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-500 text-xs">
                      ▼
                    </div>
                  </div>
                </div>

                {/* ADDRESS */}
                <div className="md:col-span-2 flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-700">Address</label>
                  <div className="relative">
                    <div className="absolute top-3 left-0 pl-2.5 flex items-start pointer-events-none">
                      <span className="text-gray-400 text-sm">📍</span>
                    </div>
                    <textarea
                      name="address"
                      value={student.address}
                      onChange={handleChange}
                      placeholder="Enter complete address"
                      className="w-full pl-8 border border-gray-300 p-2.5 rounded-lg bg-white text-gray-800 text-sm font-medium placeholder-gray-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm min-h-[80px]"
                      required
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* ================= COURSE ================= */}
            <div className="mb-4">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-3">
                <span className="w-1.5 h-5 bg-indigo-500 rounded-full inline-block"></span>
                Academic Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-700">Select Course</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                      <span className="text-gray-400 text-sm">📚</span>
                    </div>
                    <select
                      name="course"
                      value={student.course}
                      onChange={handleChange}
                      className="w-full pl-8 border border-gray-300 p-2.5 rounded-lg bg-white text-gray-800 text-sm font-medium cursor-pointer focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm appearance-none"
                      required
                    >
                      <option value="" disabled className="text-gray-400">Choose Course</option>
                      {Array.isArray(courses) &&
                        courses.map((course) => (
                          <option key={course._id} value={course.courseName}>
                            {course.courseName}
                          </option>
                        ))}
                    </select>

                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-500 text-xs">
                      ▼
                    </div>
                  </div>
                </div>

                <Input label="Course Duration" name="duration" value={student.duration} readOnly placeholder="Auto-filled" icon="⏳" />
                <Input label="Course Fees" name="fees" value={student.fees} readOnly placeholder="Auto-filled" icon="₹" />

              </div>
            </div>

            {/* ================= BUTTONS ================= */}
            <div className="mt-8 pt-5 border-t border-gray-100 flex flex-col sm:flex-row justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate("/admindashboard/students")}
                className="w-full sm:w-auto px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold rounded-lg transition-all duration-200"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-bold rounded-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 transform"
              >
                Save Student
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

/* ================= INPUT ================= */
const Input = ({
  label,
  type = "text",
  name,
  placeholder,
  value,
  onChange,
  readOnly = false,
  icon,
  max,
  pattern,
  title
}) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-bold text-gray-700 flex justify-between">
      {label}
      {readOnly && (
        <span className="text-[9px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full uppercase tracking-wider font-extrabold border border-gray-200">
          Auto
        </span>
      )}
    </label>

    <div className="relative">
      {icon && (
        <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
          <span className="text-gray-400 text-sm">{icon}</span>
        </div>
      )}

      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        max={max}
        pattern={pattern}
        title={title}
        className={`w-full ${icon ? "pl-8" : "px-3"} border p-2.5 rounded-lg text-sm font-medium transition-all shadow-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
          readOnly
            ? "bg-gray-50 text-gray-500 border-gray-200 cursor-not-allowed shadow-inner"
            : "bg-white text-gray-800 border-gray-300 placeholder-gray-400"
        }`}
        required={!readOnly}
      />
    </div>
  </div>
);

export default AddStudent;