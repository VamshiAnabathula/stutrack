import { useState, useEffect } from "react";
import axios from "axios";

const LeaveApprovals = () => {

  const [leaves, setLeaves] = useState([]);
  const [selectedLeave, setSelectedLeave] = useState(null);

  // ✅ Default All (smart logic apply later)
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [fromFilter, setFromFilter] = useState("");
  const [toFilter, setToFilter] = useState("");

  // Fetch Leaves
  const fetchLeaves = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/leave/all");
      setLeaves(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  // 🔥 SMART FILTER AUTO APPLY
  useEffect(() => {
    if (leaves.length > 0) {
      const hasPending = leaves.some(l => l.status === "Pending");

      if (hasPending) {
        setStatusFilter("Pending");
      } else {
        setStatusFilter("All");
      }
    }
  }, [leaves]);

  // Update Status
  const updateStatus = async (id, status) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/leave/update/${id}`,
        { status }
      );

      setLeaves(
        leaves.map((leave) =>
          leave._id === id ? res.data : leave
        )
      );

      setSelectedLeave(null);

    } catch (error) {
      console.error(error);
    }
  };

  // Filter Logic
  const filteredLeaves = leaves.filter((leave) => {

    const matchesSearch =
      leave.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      leave.name?.toLowerCase().includes(search.toLowerCase()) ||
      leave.email?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || leave.status === statusFilter;

    const leaveFrom = leave.fromDate?.split("T")[0];

    const matchesFrom =
      !fromFilter || leaveFrom >= fromFilter;

    const matchesTo =
      !toFilter || leaveFrom <= toFilter;

    return matchesSearch && matchesStatus && matchesFrom && matchesTo;
  });

  return (
    <div className="p-6">

      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        Leave Approvals
      </h2>

      {/* FILTER BAR */}
      <div className="bg-white p-4 rounded-xl shadow mb-4 flex flex-wrap gap-3 items-center">

        <input
          type="text"
          placeholder="Search name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded-lg w-64"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border px-3 py-2 rounded-lg"
        >
          <option>All</option>
          <option>Pending</option>
          <option>Approved</option>
          <option>Rejected</option>
        </select>

        <input
          type="date"
          value={fromFilter}
          onChange={(e) => setFromFilter(e.target.value)}
          className="border px-3 py-2 rounded-lg"
        />

        <input
          type="date"
          value={toFilter}
          onChange={(e) => setToFilter(e.target.value)}
          className="border px-3 py-2 rounded-lg"
        />

        {/* 🔥 SMART RESET */}
        <button
          onClick={() => {
            setSearch("");
            setFromFilter("");
            setToFilter("");

            const hasPending = leaves.some(l => l.status === "Pending");
            setStatusFilter(hasPending ? "Pending" : "All");
          }}
          className="bg-gray-200 px-4 py-2 rounded-lg"
        >
          Reset
        </button>

      </div>

      {/* TABLE */}
      <div className="bg-white shadow-xl rounded-xl overflow-hidden">

        <table className="w-full text-left">

          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-4">Student Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">From</th>
              <th className="p-4">To</th>
              <th className="p-4">Reason</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredLeaves.length > 0 ? (
              filteredLeaves.map((leave) => (
                <tr key={leave._id} className="border-b hover:bg-gray-50">

                  <td className="p-4 font-medium">
                    {leave.fullName || leave.name || "Student"}
                  </td>

                  <td className="p-4 text-gray-600">
                    {leave.email}
                  </td>

                  <td className="p-4 text-gray-600">
                    {leave.fromDate?.split("T")[0]}
                  </td>

                  <td className="p-4 text-gray-600">
                    {leave.toDate?.split("T")[0]}
                  </td>

                  <td className="p-4 text-gray-600">
                    {leave.reason?.length > 25
                      ? leave.reason.slice(0, 25) + "..."
                      : leave.reason}
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold
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

                  <td className="p-4">
                    <div className="flex justify-center gap-2 flex-wrap">

                      <button
                        onClick={() => setSelectedLeave(leave)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded-full text-sm"
                      >
                        View
                      </button>

                      {leave.status === "Pending" && (
                        <>
                          <button
                            onClick={() =>
                              updateStatus(leave._id, "Approved")
                            }
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 rounded-full text-sm"
                          >
                            Approve
                          </button>

                          <button
                            onClick={() =>
                              updateStatus(leave._id, "Rejected")
                            }
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-full text-sm"
                          >
                            Reject
                          </button>
                        </>
                      )}

                    </div>
                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center p-8 text-gray-500">
                  No matching results
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>

      {/* MODAL */}
      {selectedLeave && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">

          <div className="bg-white rounded-2xl shadow-2xl w-[420px] p-6 relative">

            <button
              onClick={() => setSelectedLeave(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
            >
              ✖
            </button>

            <h2 className="text-2xl font-bold text-center mb-5">
              Leave Details
            </h2>

            <div className="space-y-3 text-sm">

              <div className="flex justify-between border-b pb-2">
                <span>Name</span>
                <span>{selectedLeave.fullName || selectedLeave.name}</span>
              </div>

              <div className="flex justify-between border-b pb-2">
                <span>Email</span>
                <span>{selectedLeave.email}</span>
              </div>

              <div className="flex justify-between border-b pb-2">
                <span>From</span>
                <span>{selectedLeave.fromDate?.split("T")[0]}</span>
              </div>

              <div className="flex justify-between border-b pb-2">
                <span>To</span>
                <span>{selectedLeave.toDate?.split("T")[0]}</span>
              </div>

              <div>
                <span>Reason</span>
                <div className="bg-gray-100 p-2 rounded">
                  {selectedLeave.reason}
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default LeaveApprovals;