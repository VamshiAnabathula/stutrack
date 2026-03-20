import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function Results() {
  const [view, setView] = useState("comparison");

  // ✅ SINGLE COURSE DATA (Subjects wise)
  const data = [
    { subject: "HTML", midterm: 75, final: 85 },
    { subject: "CSS", midterm: 80, final: 88 },
    { subject: "JavaScript", midterm: 78, final: 90 },
    { subject: "React", midterm: 85, final: 92 },
    { subject: "Node.js", midterm: 70, final: 80 },
  ];

  // ✅ DOWNLOAD
  const downloadReport = () => {
    const element = document.createElement("a");

    const content = `
Web Development Result Report
-----------------------------
Midterm Avg: 78%
Final Avg: 87%
Overall Grade: A

Subject-wise:
HTML: 75 / 85
CSS: 80 / 88
JavaScript: 78 / 90
React: 85 / 92
Node.js: 70 / 80
`;

    const file = new Blob([content], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "ResultReport.txt";
    document.body.appendChild(element);
    element.click();
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">
        Web Development Results 📊
      </h1>

      {/* Buttons */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex gap-4 flex-wrap">
        <button
          onClick={() => setView("comparison")}
          className={`px-4 py-2 rounded ${
            view === "comparison"
              ? "bg-blue-600 text-white"
              : "bg-gray-200"
          }`}
        >
          Midterm vs Final
        </button>

        <button
          onClick={() => setView("final")}
          className={`px-4 py-2 rounded ${
            view === "final"
              ? "bg-green-600 text-white"
              : "bg-gray-200"
          }`}
        >
          Final Only
        </button>

        <button
          onClick={downloadReport}
          className="ml-auto bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Download Report
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <StatCard title="Midterm Average" value="78%" color="text-blue-600" />
        <StatCard title="Final Average" value="87%" color="text-green-600" />
        <StatCard title="Overall Grade" value="A" color="text-purple-600" />
      </div>

      {/* Chart + Subject List */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <XAxis dataKey="subject" />
              <YAxis />
              <Tooltip />
              <Legend />

              {view === "comparison" ? (
                <>
                  <Bar dataKey="midterm" fill="#3b82f6" />
                  <Bar dataKey="final" fill="#22c55e" />
                </>
              ) : (
                <Bar dataKey="final" fill="#22c55e" />
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Subject-wise Results */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            Subject-wise Results
          </h2>

          <ul className="space-y-4 text-gray-700 text-lg">
            {data.map((item, index) => (
              <li key={index} className="flex justify-between">
                <span>{item.subject}</span>
                <span className="font-semibold">
                  {item.midterm} / {item.final}
                </span>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}

// ✅ Stat Card
function StatCard({ title, value, color }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h3 className="text-gray-500">{title}</h3>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
} 