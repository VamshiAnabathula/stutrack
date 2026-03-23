import { useEffect, useState } from "react";
import axios from "axios";

const AdminAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAttendance();
  }, []);

  useEffect(() => {
    filterData();
  }, [search, selectedDate, attendance]);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/attendance/all");

      if (Array.isArray(res.data)) {
        setAttendance(res.data);
        setFilteredData(res.data);
      } else {
        setAttendance([]);
        setFilteredData([]);
      }
    } catch (error) {
      console.error("Error fetching attendance", error);
      setAttendance([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  /* Filter Logic */
  const filterData = () => {
    let data = [...attendance];

    // Date Filter
    if (selectedDate) {
      data = data.filter((a) => {
        const recordDate = new Date(a.date).toISOString().split("T")[0];
        return recordDate === selectedDate;
      });
    }

    // Search Filter
    if (search) {
      data = data.filter((a) =>
        `${a.fullName} ${a.email} ${a.course}`
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    setFilteredData(data);
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedDate("");
    setFilteredData(attendance);
  };

  /* Hours Calculation (Hours + Minutes) */
  const calculateHours = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return "--";

    const start = new Date(checkIn);
    const end = new Date(checkOut);

    const diffMs = end - start;

    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="p-4 md:p-6 bg-gray-100 min-h-screen">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold">📊 Student Attendance</h1>

        <button
          onClick={fetchAttendance}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* FILTERS */}
      <div className="bg-white p-4 rounded-xl shadow mb-6">
        <div className="grid md:grid-cols-4 gap-4">

          {/* SEARCH */}
          <input
            type="text"
            placeholder="Search name / email / course..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded-lg w-full"
          />

          {/* DATE */}
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border p-2 rounded-lg w-full"
          />

          {/* CLEAR */}
          <button
            onClick={clearFilters}
            className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition"
          >
            Clear Filters
          </button>

          {/* RECORD COUNT */}
          <div className="flex items-center font-medium text-gray-700">
            Records: {filteredData.length}
          </div>

        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white shadow-lg rounded-xl overflow-auto">

        <table className="w-full text-left min-w-[850px]">

          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Course</th>
              <th className="p-3">Date</th>
              <th className="p-3">Check In</th>
              <th className="p-3">Check Out</th>
              <th className="p-3">Hours</th>
            </tr>
          </thead>

          <tbody>

            {filteredData.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-4 text-center text-gray-500">
                  No attendance found
                </td>
              </tr>
            ) : (
              filteredData.map((a) => (
                
                <tr key={a._id} className="border-t hover:bg-gray-50">

                  <td className="p-3 font-medium">
                    {a.fullName || "--"}
                  </td>

                  <td className="p-3">
                    {a.email || "--"}
                  </td>

                  <td className="p-3">
                    {a.course || "--"}
                  </td>

                  <td className="p-3">
                    {a.date
                      ? new Date(a.date).toLocaleDateString()
                      : "--"}
                  </td>

                  <td className="p-3">
                    {a.checkIn
                      ? new Date(a.checkIn).toLocaleTimeString()
                      : "--"}
                  </td>

                  <td className="p-3">
                    {a.checkOut
                      ? new Date(a.checkOut).toLocaleTimeString()
                      : "--"}
                  </td>

                  <td className="p-3 text-green-600 font-semibold">
                    {calculateHours(a.checkIn, a.checkOut)}
                  </td>

                </tr>
              ))
            )}

          </tbody>
        </table>

      </div>

    </div>
  );
};

export default AdminAttendance;