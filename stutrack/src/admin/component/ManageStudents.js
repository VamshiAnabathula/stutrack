import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ManageStudents() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const studentsPerPage = 5;

  /* ================= FETCH STUDENTS ================= */
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/admissions");
        const result = await res.json();

        if (result.success) {
          setStudents(result.data);
        } else {
          setStudents([]);
        }
      } catch (error) {
        console.error("Error fetching students:", error);
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  /* ================= SEARCH FILTER ================= */
  const filteredStudents = students.filter((s) => {
    const term = searchTerm.toLowerCase();

    return (
      s.fullName?.toLowerCase().includes(term) ||
      s.email?.toLowerCase().includes(term) ||
      s.mobile?.toString().includes(term) ||
      s.address?.toLowerCase().includes(term) ||
      s.course?.toLowerCase().includes(term) ||
      s.duration?.toLowerCase().includes(term)
    );
  });

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  const indexOfLast = currentPage * studentsPerPage;
  const indexOfFirst = indexOfLast - studentsPerPage;

  const currentStudents = filteredStudents.slice(indexOfFirst, indexOfLast);

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/admissions/${id}`, {
        method: "DELETE",
      });

      const result = await res.json();

      if (result.success) {
        setStudents((prev) => prev.filter((s) => s._id !== id));
        alert("Student deleted successfully ✅");
      } else {
        alert("Delete failed ❌");
      }
    } catch (error) {
      console.error(error);
      alert("Server error ❌");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-10 px-2 sm:px-6 w-full">
      <div className="w-full max-w-7xl mx-auto bg-white p-4 sm:p-8 rounded-xl shadow-lg border border-gray-100">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8 gap-4">
          <h2 className="text-xl sm:text-3xl font-bold text-gray-800 text-center sm:text-left w-full sm:w-auto">
            Manage Students
          </h2>

          <button
            onClick={() => navigate("/admindashboard/addstudent")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow w-full sm:w-auto transition-colors font-medium text-sm sm:text-base"
          >
            + Add Student
          </button>
        </div>

        {/* SEARCH */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by name, email, mobile, course..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm sm:text-base bg-gray-50 hover:bg-white"
          />
        </div>

        {/* TABLE WRAPPER */}
        <div className="overflow-x-auto w-full bg-white rounded-lg border border-gray-200 shadow-sm">
          {loading ? (
            <p className="text-center py-10 text-gray-500">Loading...</p>
          ) : currentStudents.length === 0 ? (
            <p className="text-center py-10 text-gray-500">
              No student records found.
            </p>
          ) : (
            <table className="w-full border-collapse whitespace-nowrap min-w-max">
              <thead className="bg-blue-600 text-white text-sm sm:text-base">
                <tr>
                  <th className="p-3 text-left font-semibold">#</th>
                  <th className="p-3 text-left font-semibold">Full Name</th>
                  <th className="p-3 text-left font-semibold">Email</th>
                  <th className="p-3 text-left font-semibold">Mobile</th>
                  <th className="p-3 text-left font-semibold">Course</th>
                  <th className="p-3 text-left font-semibold">Duration</th>
                  <th className="p-3 text-left font-semibold tracking-wide">Admission Time</th>
                  <th className="p-3 text-center font-semibold tracking-wide">Actions</th>
                </tr>
              </thead>

              <tbody>
                {currentStudents.map((s, index) => (
                  <tr
                    key={s._id}
                    className={`border-b ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-blue-50`}
                  >
                    <td className="p-3 text-sm">{indexOfFirst + index + 1}</td>
                    <td className="p-3 text-sm font-medium text-gray-800">{s.fullName}</td>
                    <td className="p-3 text-sm text-gray-600">{s.email}</td>
                    <td className="p-3 text-sm text-gray-600">{s.mobile}</td>
                    <td className="p-3 text-sm text-gray-600">{s.course}</td>
                    <td className="p-3 text-sm text-gray-600">{s.duration}</td>

                    <td className="p-3 text-sm text-gray-500">
                      {s.createdAt
                        ? new Date(s.createdAt).toLocaleString()
                        : "N/A"}
                    </td>

                    <td className="p-3 flex justify-center gap-2">
                       <button
                        onClick={() =>
                          navigate(`/admindashboard/editstudent/${s._id}`)
                        }
                        className="bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 px-3 py-1.5 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                      >
                        ✏ Edit
                      </button>

                      <button
                        onClick={() => handleDelete(s._id)}
                        className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-3 py-1.5 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                      >
                        🗑 Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex flex-wrap justify-center items-center gap-2 mt-6 p-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base border border-gray-300 shadow-sm"
            >
              Prev
            </button>

            <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`min-w-[32px] sm:min-w-[40px] px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg font-medium text-sm sm:text-base transition-colors shadow-sm ${
                    currentPage === i + 1
                      ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base border border-gray-300 shadow-sm"
            >
              Next
            </button>
          </div>
        )}

      </div>
    </div>
  );
}