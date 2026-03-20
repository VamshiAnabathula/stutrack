"use client"; // optional in CRA
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // <-- React Router

export default function AdmissionForm() {
  const navigate = useNavigate(); // hook for redirection

  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    mobile: "",
    email: "",
    address: "",
    college: "",
    marks: "",
    passingYear: "",
    course: "",
    duration: "",
  });

  const [errors, setErrors] = useState({});

  const courseDurations = {
    "Web Development": "6 Months",
    "WordPress": "3 Months",
    "Fullstack Development": "12 Months",
    "Digital Marketing": "4 Months",
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "mobile") {
      if (/^\d{0,10}$/.test(value)) setFormData({ ...formData, [name]: value });
      return;
    }

    if (name === "course") {
      setFormData({ ...formData, course: value, duration: courseDurations[value] || "" });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName || formData.fullName.trim().length < 3)
      newErrors.fullName = "Full name must be at least 3 characters";
    if (!formData.dob) newErrors.dob = "Date of birth is required";
    if (!/^\d{10}$/.test(formData.mobile)) newErrors.mobile = "Mobile number must be exactly 10 digits";
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Please enter a valid email address";
    if (!formData.address || formData.address.trim().length < 5)
      newErrors.address = "Address must be at least 5 characters";
    if (!formData.college || formData.college.trim().length < 3)
      newErrors.college = "College name must be at least 3 characters";
    if (!formData.marks || isNaN(formData.marks) || formData.marks < 0 || formData.marks > 100)
      newErrors.marks = "Marks must be between 0 and 100";
    if (!formData.passingYear || !/^\d{4}$/.test(formData.passingYear) || formData.passingYear < 2000 || formData.passingYear > new Date().getFullYear() + 1)
      newErrors.passingYear = "Enter a valid passing year (e.g. 2025)";
    if (!formData.course) newErrors.course = "Please select a course";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const res = await fetch("http://localhost:5000/api/admissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setFormData({
          fullName: "",
          dob: "",
          mobile: "",
          email: "",
          address: "",
          college: "",
          marks: "",
          passingYear: "",
          course: "",
          duration: "",
        });
        setErrors({});

        // React Router redirect
        navigate("/login"); // <-- redirect to login page
      } else {
        alert("Error while submitting ❌");
      }
    } catch (error) {
      console.error(error);
      alert("Server Error ❌");
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-lg p-8 md:p-12">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-blue-700 mb-12">
          Course Admission Form
        </h2>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* ===== Basic Details ===== */}
          <SectionTitle title="Basic Personal Details" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Full Name"
              name="fullName"
              placeholder="Enter Full Name"
              value={formData.fullName}
              onChange={handleChange}
              error={errors.fullName}
            />
            <FormField
              label="Date of Birth"
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              error={errors.dob}
            />
            <FormField
              label="Mobile Number"
              type="tel"
              name="mobile"
              placeholder="Enter Mobile Number"
              value={formData.mobile}
              onChange={handleChange}
              error={errors.mobile}
              maxLength="10"
            />
            <FormField
              label="Email ID"
              type="email"
              name="email"
              placeholder="Enter Email ID"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
            />
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium mb-1">Address</label>
              <textarea
                name="address"
                placeholder="Enter Address"
                value={formData.address}
                onChange={handleChange}
                className={`w-full px-5 py-4 text-base border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  errors.address ? "border-red-400" : "border-gray-300"
                }`}
              />
              {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
            </div>
          </div>

          {/* ===== Educational Details ===== */}
          <SectionTitle title="Educational Details" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              label="College Name"
              name="college"
              placeholder="Enter College Name"
              value={formData.college}
              onChange={handleChange}
              error={errors.college}
            />
            <FormField
              label="Marks / Percentage"
              name="marks"
              placeholder="Enter Marks"
              value={formData.marks}
              onChange={handleChange}
              error={errors.marks}
            />
            <FormField
              label="Passing Year"
              name="passingYear"
              placeholder="Enter Passing Year"
              value={formData.passingYear}
              onChange={handleChange}
              error={errors.passingYear}
            />
          </div>

          {/* ===== Course Details ===== */}
          <SectionTitle title="Course Details" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Select Course</label>
              <select
                name="course"
                value={formData.course}
                onChange={handleChange}
                className={`w-full px-5 py-4 text-base border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  errors.course ? "border-red-400" : "border-gray-300"
                }`}
              >
                <option value="">Select Course</option>
                <option value="Web Development">Web Development</option>
                <option value="WordPress">WordPress</option>
                <option value="Fullstack Development">Fullstack Development</option>
                <option value="Digital Marketing">Digital Marketing</option>
              </select>
              {errors.course && <p className="text-red-500 text-sm mt-1">{errors.course}</p>}
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Course Duration</label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                readOnly
                placeholder="Course Duration"
                className="w-full px-5 py-4 text-base border border-gray-300 rounded-lg bg-gray-100"
              />
            </div>
          </div>

          {/* ===== Submit Button ===== */}
          <div className="text-center">
            <button
              type="submit"
              className="bg-blue-600 text-white font-medium text-lg px-12 py-3 rounded-lg hover:bg-blue-700 active:scale-95 transition duration-300 shadow-md"
            >
              Submit Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function SectionTitle({ title }) {
  return (
    <h3 className="text-xl md:text-2xl font-semibold text-gray-700 border-b border-gray-300 pb-2 mb-4">
      {title}
    </h3>
  );
}

function FormField({ label, type = "text", name, placeholder, value, onChange, error, maxLength }) {
  return (
    <div>
      <label className="block text-gray-700 font-medium mb-1">{label}</label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        className={`w-full px-5 py-4 text-base border rounded-lg focus:ring-2 focus:ring-blue-500 ${
          error ? "border-red-400" : "border-gray-300"
        }`}
        required
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}