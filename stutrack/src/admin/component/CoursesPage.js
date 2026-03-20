import { useEffect, useState } from "react";
import axios from "axios";

const CoursesPage = () => {

  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [course, setCourse] = useState({
    courseName: "",
    duration: "",
    fees: ""
  });

  /* ================= FETCH COURSES ================= */

  const fetchCourses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/courses");
      setCourses(res.data.data);
    } catch (error) {
      console.log("Error fetching courses");
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  /* ================= INPUT CHANGE ================= */

  const handleChange = (e) => {
    setCourse({
      ...course,
      [e.target.name]: e.target.value
    });
  };

  /* ================= ADD COURSE ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newCourseName = course.courseName
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();

    const isDuplicate = courses.some((c) => {
      const existingCourse = c.courseName
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim();

      return existingCourse === newCourseName;
    });

    if (isDuplicate) {
      alert("Course already exists ❌");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/courses/add",
        course
      );

      alert("Course added successfully");

      setCourse({
        courseName: "",
        duration: "",
        fees: ""
      });

      setShowModal(false);
      fetchCourses();

    } catch (error) {
      alert("Error adding course");
    }
  };

  /* ================= SEARCH FILTER ================= */

  const filteredCourses = courses.filter((c) =>
    c.courseName.toLowerCase().includes(search.toLowerCase()) ||
    c.duration.toLowerCase().includes(search.toLowerCase()) ||
    c.fees.toString().includes(search)
  );

  return (
    <div className="p-10">

      {/* ================= HEADER ================= */}

      <div className="flex justify-between items-center mb-8">

        <h1 className="text-3xl font-bold text-gray-800">
          Courses
        </h1>

        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow"
        >
          + Add Course
        </button>

      </div>

      {/* ================= SEARCH ================= */}

      <input
        type="text"
        placeholder="Search course name, duration or fees..."
        className="w-full mb-6 border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* ================= TABLE ================= */}

      <div className="bg-white rounded-xl shadow overflow-hidden">

        <table className="w-full text-left">

          {/* 🔥 BLUE HEADER */}
          <thead className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
            <tr>
              <th className="p-4 font-semibold">Course Name</th>
              <th className="p-4 font-semibold">Duration</th>
              <th className="p-4 font-semibold">Fees</th>
            </tr>
          </thead>

          <tbody>

            {filteredCourses.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center p-6 text-gray-500">
                  No courses found
                </td>
              </tr>
            ) : (
              filteredCourses.map((course) => (
                <tr
                  key={course._id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="p-4 font-medium">
                    {course.courseName}
                  </td>

                  <td className="p-4">
                    {course.duration}
                  </td>

                  <td className="p-4 font-semibold text-blue-600">
                    ₹{course.fees}
                  </td>
                </tr>
              ))
            )}

          </tbody>

        </table>

      </div>

      {/* ================= MODAL ================= */}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">

          <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-lg">

            <h2 className="text-2xl font-bold mb-6">
              Add Course
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">

              <input
                type="text"
                name="courseName"
                placeholder="Course Name"
                value={course.courseName}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg"
                required
              />

              <input
                type="text"
                name="duration"
                placeholder="Duration"
                value={course.duration}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg"
                required
              />

              <input
                type="number"
                name="fees"
                placeholder="Fees"
                value={course.fees}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg"
                required
              />

              <div className="flex justify-end gap-3 pt-2">

                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-blue-600 text-white px-5 py-2 rounded-lg"
                >
                  Save
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
};

export default CoursesPage;