import { useOutletContext } from "react-router-dom";
import { useMemo } from "react";

const DashboardCards = () => {

  /* ================= CONTEXT DATA ================= */

  const { students = [], leaves = [] } = useOutletContext() || {};



  /* ================= PRESENT COUNT ================= */

  const presentCount = useMemo(() => {
    return students.filter((s) => Number(s.attendance) >= 75).length;
  }, [students]);



  /* ================= ABSENT COUNT ================= */

  const absentCount = students.length - presentCount;



  /* ================= FIELD WISE COUNT ================= */

  const fieldCounts = useMemo(() => {

    return students.reduce((acc, curr) => {

      if (!curr?.field) return acc;

      acc[curr.field] = (acc[curr.field] || 0) + 1;

      return acc;

    }, {});

  }, [students]);



  /* ================= ATTENDANCE % ================= */

  const attendancePercentage = useMemo(() => {

    if (students.length === 0) return 0;

    return Math.round((presentCount / students.length) * 100);

  }, [students, presentCount]);



  return (

    <div>

      {/* ================= DASHBOARD TITLE ================= */}

      <h2 className="text-2xl font-bold mb-6 text-gray-700">
        Dashboard Overview
      </h2>



      {/* ================= TOP CARDS ================= */}

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

        <Card title="Total Students" value={students.length} color="blue" />

        <Card title="Present Students" value={presentCount} color="green" />

        <Card title="Absent Students" value={absentCount} color="red" />

        <Card title="Leave Requests" value={leaves.length} color="yellow" />

      </div>



      {/* ================= ATTENDANCE PROGRESS ================= */}

      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 mb-8">

        <h3 className="font-semibold mb-3 text-gray-700">
          Overall Attendance
        </h3>

        <div className="w-full bg-gray-200 rounded-full h-4">

          <div
            className="bg-blue-600 h-4 rounded-full transition-all duration-500"
            style={{ width: `${attendancePercentage}%` }}
          />

        </div>

        <p className="mt-2 text-sm text-gray-600">
          {attendancePercentage}% Students Present
        </p>

      </div>



      {/* ================= STUDENTS BY FIELD ================= */}

      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 mb-8">

        <h3 className="font-semibold mb-4 text-gray-700">
          Students by Field
        </h3>

        {Object.keys(fieldCounts).length === 0 ? (

          <p className="text-gray-500">No data available</p>

        ) : (

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">

            {Object.entries(fieldCounts).map(([field, count]) => (

              <div
                key={field}
                className="bg-gray-100 rounded-2xl p-4 text-center border border-gray-200 hover:shadow-md transition"
              >

                <p className="text-gray-500 text-sm">
                  {field}
                </p>

                <p className="text-xl font-bold text-blue-600">
                  {count}
                </p>

              </div>

            ))}

          </div>

        )}

      </div>



      {/* ================= RECENT STUDENTS ================= */}

      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 mb-8">

        <h3 className="font-semibold mb-4 text-gray-700">
          Recent Students
        </h3>

        {students.length === 0 ? (

          <p className="text-gray-500">
            No students found
          </p>

        ) : (

          <div className="overflow-hidden rounded-2xl border border-gray-200">

            <table className="w-full text-left border-collapse">

              <thead className="bg-blue-600 text-white">

                <tr>

                  <th className="p-3">Name</th>

                  <th className="p-3">Field</th>

                  <th className="p-3">Attendance</th>

                </tr>

              </thead>



              <tbody className="bg-white">

                {students.slice(0, 5).map((s, index) => (

                  <tr
                    key={s._id || index}
                    className="border-t hover:bg-gray-50 transition"
                  >

                    <td className="p-3">
                      {s.name || "N/A"}
                    </td>

                    <td className="p-3">
                      {s.field || "N/A"}
                    </td>

                    <td className="p-3 font-medium text-blue-600">
                      {s.attendance || 0}%
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>

  );

};



/* ================= REUSABLE CARD ================= */

const Card = ({ title, value, color }) => {

  const colors = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    red: "from-red-500 to-red-600",
    yellow: "from-yellow-500 to-yellow-600",
  };

  return (

    <div
      className={`bg-gradient-to-r ${colors[color]} text-white rounded-2xl p-6 shadow-lg`}
    >

      <h3 className="text-sm opacity-80">
        {title}
      </h3>

      <p className="text-3xl font-bold mt-2">
        {value}
      </p>

    </div>

  );

};

export default DashboardCards;