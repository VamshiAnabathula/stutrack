import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function EditStudent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    dob: "",
    address: "",
    pincode: "",
    course: "",
    duration: "",
    reference: "",
    profileImage: "",
  });

  const [loading, setLoading] = useState(true);

  /* ================= FETCH STUDENT DATA ================= */
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/admissions/${id}`);
        if (res.data.success) {
          setFormData(res.data.data);
        } else {
          alert("Student not found");
          navigate("/admindashboard/students");
        }
      } catch (error) {
        console.error("Error fetching student details:", error);
        alert("Server Error");
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
  }, [id, navigate]);

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /* ================= HANDLE SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Extra manual validation
    if (!/^\d{10}$/.test(formData.mobile)) {
      alert("Mobile number must be exactly 10 digits.");
      return;
    }

    try {
      const res = await axios.put(`http://localhost:5000/api/admissions/${id}`, formData);
      if (res.data.success) {
        alert("Student details updated successfully ✅");
        navigate("/admindashboard/students");
      } else {
        alert("Failed to update student ❌");
      }
    } catch (error) {
      console.error("Error updating student:", error);
      alert("Server Error ❌");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 flex items-start justify-center">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg overflow-hidden mt-2 sm:mt-4 border border-gray-100">
        
        {/* HEADER SECTION */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-5 sm:p-6 text-white relative">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-3">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Edit Student Profile</h2>
              <p className="mt-1 text-indigo-100 text-sm font-medium">Update details for {formData.fullName}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-8">
          
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-3">
              <span className="w-1.5 h-5 bg-blue-500 rounded-full inline-block"></span>
              Personal & Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              
              {/* FULL NAME (Editable) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-700 flex justify-between">
                  Full Name 
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                     <span className="text-gray-400 text-sm">👤</span>
                  </div>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="w-full pl-8 border border-gray-300 p-2.5 rounded-lg bg-white text-gray-800 text-sm font-medium placeholder-gray-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm"
                  />
                </div>
              </div>

               {/* MOBILE (Editable + 10 digits) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-700">Mobile Number (10 Digits)</label>
                <div className="relative">
                   <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                     <span className="text-gray-400 text-sm">📞</span>
                  </div>
                  <input
                    type="tel"
                    name="mobile"
                    pattern="[0-9]{10}"
                    title="Mobile number must be exactly 10 digits"
                    value={formData.mobile}
                    onChange={handleChange}
                    required
                    className="w-full pl-8 border border-gray-300 p-2.5 rounded-lg bg-white text-gray-800 text-sm font-medium placeholder-gray-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm"
                  />
                </div>
              </div>

              {/* DOB (Locked) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-700 flex justify-between">
                  Date of Birth
                  <span className="text-[9px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full uppercase tracking-wider font-extrabold">Locked</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    disabled
                    className="w-full border border-gray-200 p-2.5 rounded-lg bg-gray-50 text-gray-500 text-sm font-medium cursor-not-allowed shadow-inner focus:outline-none"
                  />
                </div>
              </div>

              {/* EMAIL (Locked) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-700 flex justify-between">
                  Email Address
                  <span className="text-[9px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full uppercase tracking-wider font-extrabold">Locked</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                     <span className="text-gray-400 text-sm">✉️</span>
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled
                    className="w-full pl-8 border border-gray-200 p-2.5 rounded-lg bg-gray-50 text-gray-500 text-sm font-medium cursor-not-allowed shadow-inner focus:outline-none"
                  />
                </div>
              </div>

            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-3">
              <span className="w-1.5 h-5 bg-indigo-500 rounded-full inline-block"></span>
              Academic Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* COURSE (Locked) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-700 flex justify-between">
                  Course Enrolled
                  <span className="text-[9px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full uppercase tracking-wider font-extrabold">Locked</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                     <span className="text-gray-400 text-sm">📚</span>
                  </div>
                  <input
                    type="text"
                    name="course"
                    value={formData.course}
                    disabled
                    className="w-full pl-8 border border-gray-200 p-2.5 rounded-lg bg-gray-50 text-gray-500 text-sm font-medium cursor-not-allowed shadow-inner focus:outline-none"
                  />
                </div>
              </div>

              {/* DURATION (Locked) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-700 flex justify-between">
                  Course Duration
                  <span className="text-[9px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full uppercase tracking-wider font-extrabold">Locked</span>
                </label>
                <div className="relative">
                   <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                     <span className="text-gray-400 text-sm">⏳</span>
                  </div>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration?.replace("-", " ") || ""}
                    disabled
                    className="w-full pl-8 border border-gray-200 p-2.5 rounded-lg bg-gray-50 text-gray-500 text-sm font-medium cursor-not-allowed shadow-inner focus:outline-none capitalize"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="mt-8 pt-5 border-t border-gray-100 flex flex-col sm:flex-row justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate("/admindashboard/students")}
              className="w-full sm:w-auto px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold rounded-lg transition-all duration-200"
            >
              Cancel Edit
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-bold rounded-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 transform"
            >
              Save Changes
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
