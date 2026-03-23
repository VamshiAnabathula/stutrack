import { useState, useEffect } from "react";
import axios from "axios";

export default function Attendance({ email }) {

  const [attendance, setAttendance] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [studentName, setStudentName] = useState("");

  const fetchAttendance = async () => {
    if (!email) return;

    try {
      const res = await axios.get(
        `http://localhost:5000/api/attendance/student/${email}`
      );

      if (Array.isArray(res.data)) {
        setAttendance(res.data);
        setFilteredData(res.data);

        if (res.data.length > 0) {
          setStudentName(res.data[0].fullName);
        }
      } else {
        setAttendance([]);
        setFilteredData([]);
      }

    } catch (error) {
      console.error("Error fetching attendance:", error);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [email]);

  useEffect(() => {
    let data = [...attendance];

    if (selectedDate) {
      data = data.filter((a) => {
        const d = new Date(a.date).toISOString().split("T")[0];
        return d === selectedDate;
      });
    }

    setFilteredData(data);
  }, [selectedDate, attendance]);

  const clearFilters = () => {
    setSelectedDate("");
    setFilteredData(attendance);
  };

  const calculateHours = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return "--";

    const start = new Date(checkIn);
    const end = new Date(checkOut);

    const diff = (end - start) / (1000 * 60 * 60);
    return diff.toFixed(2) + " hrs";
  };

  const totalHours = filteredData.reduce((acc, a) => {
    if (!a.checkIn || !a.checkOut) return acc;
    const start = new Date(a.checkIn);
    const end = new Date(a.checkOut);
    return acc + (end - start) / (1000 * 60 * 60);
  }, 0).toFixed(2);

  return (

    <div className="min-h-screen bg-gray-100 p-6">

      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-2xl shadow-lg mb-6">
          <h1 className="text-3xl font-bold mb-4">
            Student Information
          </h1>

          <p className="text-lg">
            <b>Name:</b> {studentName || "Student"}
          </p>

          <p className="text-lg">
            <b>Email:</b> {email || "N/A"}
          </p>
        </div>

        {/* FILTER */}
        <div className="bg-white p-4 rounded-xl shadow mb-6 grid md:grid-cols-3 gap-4">

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          />

          <button
            onClick={clearFilters}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 transition"
          >
            Clear
          </button>

          <div
            className={`flex items-center justify-center text-white rounded-lg font-semibold ${
              totalHours < 5 ? "bg-red-500" : "bg-blue-600"
            }`}
          >
            Total Hours: {totalHours} hrs
          </div>

        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl shadow overflow-hidden">

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-gray-700">

              {/* 🔥 BLUE HEADER */}
              <thead className="bg-blue-600 text-white text-sm uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3 text-center font-bold">Date</th>
                  <th className="px-6 py-3 text-center font-bold">Check In</th>
                  <th className="px-6 py-3 text-center font-bold">Check Out</th>
                  <th className="px-6 py-3 text-center font-bold">Hours</th>
                </tr>
              </thead>

              <tbody>

                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-6 text-gray-500">
                      No Data
                    </td>
                  </tr>
                ) : (

                  filteredData.map((a, index) => (

                    <tr
                      key={a._id}
                      className={`border-t ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-blue-50`}
                    >

                      <td className="px-6 py-4 text-center font-medium whitespace-nowrap">
                        {new Date(a.date).toLocaleDateString("en-GB")}
                      </td>

                      <td className="px-6 py-4 text-center text-black whitespace-nowrap">
                        {a.checkIn
                          ? new Date(a.checkIn).toLocaleTimeString()
                          : "--"}
                      </td>

                      <td className="px-6 py-4 text-center text-black whitespace-nowrap">
                        {a.checkOut
                          ? new Date(a.checkOut).toLocaleTimeString()
                          : "--"}
                      </td>

                      <td className="px-6 py-4 text-center font-semibold text-green-600 whitespace-nowrap">
                        {calculateHours(a.checkIn, a.checkOut)}
                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>
          </div>

        </div>

      </div>

    </div>
  );
}