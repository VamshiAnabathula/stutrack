import React, { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Reports() {
  const [reportType, setReportType] = useState("weekly");

  // ✅ WEEKLY (4 WEEKS)
  const weeklyData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Days Present",
        data: [5, 4, 6, 5], // max 6 per week
        backgroundColor: "#3b82f6",
      },
    ],
  };

  // ✅ 6 MONTH DATA
  const sixMonthData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Avg Attendance (out of 6)",
        data: [5, 4, 6, 3, 5, 4],
        backgroundColor: "#10b981",
      },
    ],
  };

  // ✅ DOWNLOAD
  const downloadPDF = () => {
    const element = document.createElement("a");
    const content = `
Attendance Report
------------------------
Weekly Avg: 5/6
6 Month Avg: 4.5/6
`;
    const file = new Blob([content], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "AttendanceReport.txt";
    document.body.appendChild(element);
    element.click();
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Attendance Reports</h1>

      {/* Buttons */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex gap-4 flex-wrap">
        <button
          onClick={() => setReportType("weekly")}
          className={`px-4 py-2 rounded ${
            reportType === "weekly"
              ? "bg-blue-600 text-white"
              : "bg-gray-200"
          }`}
        >
          Weekly Report
        </button>

        <button
          onClick={() => setReportType("sixMonth")}
          className={`px-4 py-2 rounded ${
            reportType === "sixMonth"
              ? "bg-green-600 text-white"
              : "bg-gray-200"
          }`}
        >
          6 Month Report
        </button>

        <button
          onClick={downloadPDF}
          className="ml-auto bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Download PDF
        </button>
      </div>

      {/* Chart + Web Dev */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="h-[300px]">
            <Bar
              data={reportType === "weekly" ? weeklyData : sixMonthData}
              options={{
                responsive: true,
                maintainAspectRatio: false,

                scales: {
                  y: {
                    beginAtZero: true,
                    max: 6,
                    ticks: {
                      stepSize: 1,
                    },
                  },
                },

                plugins: {
                  legend: { position: "top" },
                  title: {
                    display: true,
                    text:
                      reportType === "weekly"
                        ? "Weekly Attendance (4 Weeks Overview)"
                        : "6 Month Attendance (Avg out of 6)",
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Web Development Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            Web Development Attendance
          </h2>

          <ul className="space-y-4 text-gray-700 text-lg">
            <li className="flex justify-between">
              <span>HTML</span>
              <span className="font-semibold">5/6</span>
            </li>
            <li className="flex justify-between">
              <span>CSS</span>
              <span className="font-semibold">4/6</span>
            </li>
            <li className="flex justify-between">
              <span>JavaScript</span>
              <span className="font-semibold">5/6</span>
            </li>
            <li className="flex justify-between">
              <span>React</span>
              <span className="font-semibold">6/6</span>
            </li>
            <li className="flex justify-between">
              <span>Node.js</span>
              <span className="font-semibold">4/6</span>
            </li>
          </ul>
        </div>

      </div>
    </div>
  );
}