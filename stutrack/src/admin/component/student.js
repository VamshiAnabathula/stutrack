import { useState } from "react";

const Students = () => {
  const [students] = useState([
    { id: 1, name: "Rahul Sharma", field: "Web Development", attendance: 82 },
    { id: 2, name: "Priya Patel", field: "Web Development", attendance: 75 },
    { id: 3, name: "Amit Shah", field: "Full Stack", attendance: 90 },
    { id: 4, name: "Sneha Joshi", field: "WordPress", attendance: 68 },
    { id: 5, name: "Arjun Kumar", field: "Digital Marketing", attendance: 85 },
    { id: 6, name: "Meera Singh", field: "Full Stack", attendance: 79 },
    { id: 7, name: "Dev Patel", field: "Digital Marketing", attendance: 92 },
    { id: 8, name: "Simran Kaur", field: "WordPress", attendance: 67 },
    { id: 9, name: "Vamshi Anabathula", field: "Digital Marketing", attendance: 92 },
    { id: 10, name: "Srinath Kota", field: "Full Stack", attendance: 72 },
    { id: 11, name: "Raju Penta", field: "WordPress", attendance: 73 },
    { id: 12, name: "Mihir Pawar", field: "Full Stack", attendance: 81 },
    { id: 13, name: "Yash Kota", field: "Web Development", attendance: 68 },
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Students</h1>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Field</th>
              <th className="p-3">Attendance</th>
            </tr>
          </thead>

          <tbody>
            {students.map((s) => (
              <tr key={s.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{s.name}</td>
                <td className="p-3">{s.field}</td>
                <td className="p-3">{s.attendance}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Students;