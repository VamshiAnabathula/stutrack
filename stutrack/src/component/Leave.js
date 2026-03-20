import { useState, useEffect } from "react";
import axios from "axios";

export default function Leave({ email, name }) {

  const studentEmail = email || "";

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reason, setReason] = useState("");
  const [leaveList, setLeaveList] = useState([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // 👉 Tomorrow date
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

  /* ================= FETCH ================= */

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

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (studentEmail) fetchLeaves();
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

    try {
      const res = await axios.post(
        "http://localhost:5000/api/leave/apply",
        { email: studentEmail, fromDate, toDate, reason }
      );

      setLeaveList([res.data, ...leaveList]);

      setFromDate("");
      setToDate("");
      setReason("");

    } catch (error) {
      alert(error.response?.data?.message || "Error submitting leave");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-2xl shadow-lg mb-6">
          <div className="flex flex-col md:flex-row md:justify-between items-center">

            <div>
              <h1 className="text-3xl font-bold mb-2">
                Leave Application
              </h1>

              <p className="text-blue-100">
                <span className="font-semibold text-white">Name:</span> {name || "Student"}
              </p>

              <p className="text-blue-100">
                <span className="font-semibold text-white">Email:</span> {studentEmail}
              </p>
            </div>

            {/* ✅ VIEW HISTORY BUTTON BACK */}
            <button
              onClick={() => setShowHistoryModal(true)}
              className="mt-4 md:mt-0 bg-white text-blue-700 px-5 py-2.5 rounded-full shadow font-semibold hover:bg-gray-100"
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

            {/* FROM DATE */}
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

            {/* TO DATE */}
            <div>
              <label>To Date</label>
              <input
                type="date"
                value={toDate}
                min={getNextDay(fromDate)}
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

      {/* ================= MODAL ================= */}

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
                      {leaveList.map((leave, index) => {

                        const start = new Date(leave.fromDate);
                        const end = new Date(leave.toDate);
                        const total =
                          Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

                        return (
                          <tr
                            key={leave._id}
                            className={`border-b hover:bg-gray-50 ${
                              index % 2 === 0 ? "bg-white" : "bg-gray-50"
                            }`}
                          >

                            <td className="p-3">{start.toLocaleDateString()}</td>
                            <td className="p-3">{end.toLocaleDateString()}</td>
                            <td className="p-3">{leave.reason}</td>

                            <td className="p-3 text-center">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold
                                ${
                                  leave.status === "Approved"
                                    ? "bg-green-100 text-green-700"
                                    : leave.status === "Rejected"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-yellow-100 text-yellow-700"
                                }`}
                              >
                                {leave.status}
                              </span>
                            </td>

                            <td className="p-3 text-center">{total} Days</td>

                          </tr>
                        );
                      })}
                    </tbody>

                  </table>
                </div>
              )}
            </div>

            <div className="p-4 border-t text-right bg-gray-50">
              <button
                onClick={() => setShowHistoryModal(false)}
                className="bg-gray-200 hover:bg-gray-300 px-5 py-2 rounded-lg"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}