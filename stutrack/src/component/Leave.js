import { useState, useEffect } from "react";
import axios from "axios";

export default function Leave({ email }) {

  const studentEmail = email || "";

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reason, setReason] = useState("");
  const [leaveList, setLeaveList] = useState([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [studentName, setStudentName] = useState("");

  /* ================= DATE HELPERS ================= */

  const getTomorrow = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  };

  const minFromDate = getTomorrow();

  const getNextDay = (date) => {
    if (!date) return minFromDate;
    const d = new Date(date);
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  };

  const getMaxToDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    d.setDate(d.getDate() + 10);
    return d.toISOString().split("T")[0];
  };

  /* ================= FETCH LEAVES ================= */

  const fetchLeaves = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        "http://localhost:5000/api/leave/all"
      );

      const myLeaves = res.data.filter(
        (leave) => leave.email === studentEmail
      );

      setLeaveList(myLeaves);

      // 🔥 SET NAME FROM DB (NO EXTRA API)
      if (myLeaves.length > 0) {
        setStudentName(myLeaves[0].fullName);
      } else {
        setStudentName("Student");
      }

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /* ================= USE EFFECT ================= */

  useEffect(() => {
    if (studentEmail) {
      fetchLeaves();
    }
  }, [studentEmail]);

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fromDate || !toDate || !reason) {
      alert("Please fill all fields");
      return;
    }

    if (fromDate === toDate) {
      alert("From and To date cannot be same");
      return;
    }

    const start = new Date(fromDate);
    const end = new Date(toDate);

    const diffDays =
      (end - start) / (1000 * 60 * 60 * 24);

    if (diffDays > 10) {
      alert("Maximum 10 days leave allowed");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/leave/apply",
        { email: studentEmail, fromDate, toDate, reason }
      );

      setLeaveList([res.data, ...leaveList]);

      // 🔥 Update name instantly after first leave
      if (!studentName) {
        setStudentName(res.data.fullName);
      }

      setFromDate("");
      setToDate("");
      setReason("");

      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
      }, 2000);

    } catch (error) {
      alert(error.response?.data?.message || "Error submitting leave");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="max-w-5xl mx-auto">

        {/* 🔥 HEADER */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-2xl shadow-lg mb-6">

          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">

            <div>
              <h1 className="text-3xl font-bold mb-4">
                Leave Application
              </h1>

              <p className="text-lg">
                <b>Name:</b> {studentName || "Student"}
              </p>

              <p className="text-lg">
                <b>Email:</b> {studentEmail || "N/A"}
              </p>
            </div>

            <button
              onClick={() => setShowHistoryModal(true)}
              className="bg-white text-blue-700 px-5 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              View History
            </button>

          </div>

        </div>

        {/* FORM */}
        <div className="bg-white p-6 rounded-2xl shadow-md">

          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">

            <div className="col-span-2">
              <label className="font-medium">Email</label>
              <input
                type="email"
                value={studentEmail}
                disabled
                className="w-full border p-2 rounded bg-gray-100"
              />
            </div>

            <div>
              <label>From Date</label>
              <input
                type="date"
                value={fromDate}
                min={minFromDate}
                onChange={(e) => {
                  setFromDate(e.target.value);
                  setToDate("");
                }}
                className="w-full border p-2 rounded-lg"
              />
            </div>

            <div>
              <label>To Date</label>
              <input
                type="date"
                value={toDate}
                min={getNextDay(fromDate)}
                max={getMaxToDate(fromDate)}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full border p-2 rounded-lg"
              />
            </div>

            <div className="col-span-2">
              <label>Reason</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full border p-2 rounded-lg"
              />
            </div>

            <div className="col-span-2 text-right">
              <button
                type="submit"
                className="px-6 py-2 text-white rounded-lg bg-blue-600 hover:bg-blue-700"
              >
                Submit
              </button>
            </div>

          </form>
        </div>

      </div>

      {/* SUCCESS POPUP */}
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl text-center">
            <h2 className="text-2xl font-bold text-green-600 mb-2">
              ✅ Success
            </h2>
            <p className="text-gray-600">
              Your leave has been submitted!
            </p>
          </div>
        </div>
      )}

      {/* HISTORY MODAL */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-3 z-50">
          <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-xl">

            <div className="flex justify-between items-center p-4 border-b bg-gray-50">
              <h2 className="text-xl font-bold text-gray-800">
                Leave History
              </h2>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="text-gray-500 hover:text-red-500 text-lg"
              >
                ✕
              </button>
            </div>

            <div className="p-5 overflow-y-auto">
              {loading ? (
                <p className="text-center text-gray-500">Loading...</p>
              ) : leaveList.length === 0 ? (
                <p className="text-center text-gray-400">
                  No leave history found
                </p>
              ) : (
                <div className="overflow-x-auto rounded-xl border">

                  <table className="w-full text-sm text-left">
                    <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                      <tr>
                        <th className="p-3">From</th>
                        <th className="p-3">To</th>
                        <th className="p-3">Reason</th>
                        <th className="p-3 text-center">Status</th>
                        <th className="p-3 text-center">Days</th>
                      </tr>
                    </thead>

                    <tbody>
                      {leaveList.map((leave) => {
                        const start = new Date(leave.fromDate);
                        const end = new Date(leave.toDate);
                        const total =
                          Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

                        return (
                          <tr key={leave._id} className="border-b">
                            <td className="p-3">{start.toLocaleDateString()}</td>
                            <td className="p-3">{end.toLocaleDateString()}</td>
                            <td className="p-3">{leave.reason}</td>
                            <td className="p-3 text-center">{leave.status}</td>
                            <td className="p-3 text-center">{total} Days</td>
                          </tr>
                        );
                      })}
                    </tbody>

                  </table>

                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}