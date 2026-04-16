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
    bloodGroup: "",
  });

  const [fees, setFees] = useState({
    totalFees: 0,
    paidFees: 0,
    remainingFees: 0,
  });

  const [loading, setLoading] = useState(true);

  /* ================= FETCH STUDENT DATA ================= */
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/admissions/${id}`
        );

        if (res.data.success) {
          const data = res.data.data;

          setFormData({
            fullName: data.fullName || "",
            email: data.email || "",
            mobile: data.mobile || "",
            dob: data.dob || "",
            address: data.address || "",
            pincode: data.pincode || "",
            course: data.course || "",
            duration: data.duration || "",
            reference: data.reference || "",
            profileImage: data.profileImage || "",
            bloodGroup: data.bloodGroup || "",
          });

          // FETCH FEES FROM SEPARATE COLLECTION
          try {
            const feeRes = await axios.get(
              `http://localhost:5000/api/fees/${id}`
            );

            const feeData = feeRes.data.fees;

            setFees({
              totalFees: feeData.totalFees || 0,
              paidFees: feeData.paidFees || 0,
              remainingFees: feeData.remainingFees || 0,
            });
          } catch (err) {
            setFees({
              totalFees: 0,
              paidFees: 0,
              remainingFees: 0,
            });
          }
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
    const { name, value } = e.target;

    if (name === "paidFees") {
      const paid = Number(value || 0);
      const total = Number(fees.totalFees || 0);

      let remaining = total - paid;
      if (remaining < 0) remaining = 0;

      setFees({
        ...fees,
        paidFees: paid,
        remainingFees: remaining,
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  /* ================= HANDLE SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!/^\d{10}$/.test(formData.mobile)) {
      alert("Mobile number must be exactly 10 digits.");
      return;
    }

    try {
      // UPDATE STUDENT
      const res = await axios.put(
        `http://localhost:5000/api/admissions/${id}`,
        formData
      );

      // UPDATE FEES SEPARATELY
      await axios.put(`http://localhost:5000/api/fees/${id}`, {
        totalFees: fees.totalFees,
        paidFees: fees.paidFees,
      });

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
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Edit Student Profile
              </h2>
              <p className="mt-1 text-indigo-100 text-sm font-medium">
                Update details for {formData.fullName}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-8">

          {/* PERSONAL */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-3">
              <span className="w-1.5 h-5 bg-blue-500 rounded-full inline-block"></span>
              Personal & Contact Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-700">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2.5 rounded-lg"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-700">Mobile Number</label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2.5 rounded-lg"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-700">Blood Group</label>
                <select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2.5 rounded-lg"
                >
                  <option value="">Select Blood Group</option>
                  <option>A+</option>
                  <option>A-</option>
                  <option>B+</option>
                  <option>B-</option>
                  <option>AB+</option>
                  <option>AB-</option>
                  <option>O+</option>
                  <option>O-</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-700">Date of Birth</label>
                <input
                  type="date"
                  value={formData.dob}
                  disabled
                  className="w-full border border-gray-200 p-2.5 rounded-lg bg-gray-50"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-700">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full border border-gray-200 p-2.5 rounded-lg bg-gray-50"
                />
              </div>

            </div>
          </div>

          {/* ACADEMIC + FEES */}
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-3">
              <span className="w-1.5 h-5 bg-indigo-500 rounded-full inline-block"></span>
              Academic Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">

              <input
                type="text"
                value={formData.course}
                disabled
                className="w-full border border-gray-200 p-2.5 rounded-lg bg-gray-50"
              />

              <input
                type="text"
                value={formData.duration}
                disabled
                className="w-full border border-gray-200 p-2.5 rounded-lg bg-gray-50"
              />

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-700">
                  Total Fees (₹)
                </label>
                <input
                  type="number"
                  value={fees.totalFees}
                  disabled
                  className="w-full border border-gray-200 p-2.5 rounded-lg bg-gray-50"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-700">
                  Fees Paid (₹)
                </label>
                <input
                  type="number"
                  name="paidFees"
                  value={fees.paidFees}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2.5 rounded-lg"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-700">
                  Remaining Fees (₹)
                </label>
                <input
                  type="number"
                  value={fees.remainingFees}
                  readOnly
                  className="w-full border border-gray-300 p-2.5 rounded-lg bg-gray-100"
                />
              </div>

            </div>
          </div>

          {/* BUTTONS */}
          <div className="mt-8 pt-5 border-t flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate("/admindashboard/students")}
              className="px-6 py-2.5 bg-gray-100 rounded-lg"
            >
              Cancel Edit
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg"
            >
              Save Changes
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}