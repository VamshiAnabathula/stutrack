import React, { useState } from "react";

export default function AdminMarks() {
  const [subject, setSubject] = useState("Web Development");
  const [studentsData, setStudentsData] = useState([]);

  const studentList = [
    { id: 1, name: "Ravi Patel", subject: "Web Development" },
    { id: 2, name: "Nisha Shah", subject: "Web Development" },
    { id: 3, name: "Amit Shah", subject: "Full Stack" },
    { id: 4, name: "Sneha Joshi", subject: "WordPress" },
    { id: 5, name: "Arjun Kumar", subject: "Digital Marketing" },
  ];

  const [formData, setFormData] = useState({
    studentId: "",
    midterm: "",
    final: "",
  });

  const filteredStudents = studentList.filter(
    (student) => student.subject === subject
  );

  const calculateGrade = (avg) => {
    if (avg >= 80) return "A";
    if (avg >= 60) return "B";
    if (avg >= 40) return "C";
    return "Fail";
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const selectedStudent = studentList.find(
      (s) => s.id === Number(formData.studentId)
    );

    if (!selectedStudent) return;

    const mid = Number(formData.midterm);
    const fin = Number(formData.final);
    const avg = ((mid + fin) / 2).toFixed(2);
    const grade = calculateGrade(avg);

    const newEntry = {
      id: Date.now(),
      name: selectedStudent.name,
      midterm: mid,
      final: fin,
      average: avg,
      grade,
    };

    setStudentsData([...studentsData, newEntry]);
    setFormData({ studentId: "", midterm: "", final: "" });
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      {/* HEADER */}
      <h1 className="text-3xl font-bold mb-6">
        Upload Marks 📊
      </h1>

      {/* SUBJECT SELECT */}
      <div className="bg-white p-4 rounded-xl shadow-md mb-6 flex justify-between items-center">
        <h2 className="font-semibold text-gray-700">Select Course</h2>

        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="border px-3 py-2 rounded-lg"
        >
          <option>Web Development</option>
          <option>Full Stack</option>
          <option>WordPress</option>
          <option>Digital Marketing</option>
        </select>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <StatCard title="Total Students" value={studentsData.length} color="text-blue-600" />
        <StatCard
          title="Average Marks"
          value={
            studentsData.length
              ? (
                  studentsData.reduce((a, b) => a + Number(b.average), 0) /
                  studentsData.length
                ).toFixed(1)
              : 0
          }
          color="text-green-600"
        />
        <StatCard
          title="Top Grade"
          value={
            studentsData.length
              ? studentsData.reduce((prev, curr) =>
                  prev.average > curr.average ? prev : curr
                ).grade
              : "-"
          }
          color="text-purple-600"
        />
      </div>

      {/* FORM */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-6">
        <h2 className="text-lg font-semibold mb-4">
          Add Student Marks
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid md:grid-cols-4 gap-4"
        >

          <select
            value={formData.studentId}
            onChange={(e) =>
              setFormData({ ...formData, studentId: e.target.value })
            }
            required
            className="border p-2 rounded-lg"
          >
            <option value="">Select Student</option>
            {filteredStudents.map((student) => (
              <option key={student.id} value={student.id}>
                {student.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Midterm"
            value={formData.midterm}
            onChange={(e) =>
              setFormData({ ...formData, midterm: e.target.value })
            }
            className="border p-2 rounded-lg"
            required
          />

          <input
            type="number"
            placeholder="Final"
            value={formData.final}
            onChange={(e) =>
              setFormData({ ...formData, final: e.target.value })
            }
            className="border p-2 rounded-lg"
            required
          />

          <button className="bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Add Marks
          </button>

        </form>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-md overflow-x-auto">
        <table className="w-full text-left">

          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Midterm</th>
              <th className="p-3">Final</th>
              <th className="p-3">Average</th>
              <th className="p-3">Grade</th>
            </tr>
          </thead>

          <tbody>
            {studentsData.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center p-6 text-gray-500">
                  No Data
                </td>
              </tr>
            ) : (
              studentsData.map((s) => (
                <tr key={s.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{s.name}</td>
                  <td className="p-3">{s.midterm}</td>
                  <td className="p-3">{s.final}</td>
                  <td className="p-3">{s.average}</td>
                  <td className="p-3 font-bold">{s.grade}</td>
                </tr>
              ))
            )}
          </tbody>

        </table>
      </div>

    </div>
  );
}

/* STAT CARD */
function StatCard({ title, value, color }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-md">
      <h3 className="text-gray-500 text-sm">{title}</h3>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}