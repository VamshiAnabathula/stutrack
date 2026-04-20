import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function FeesManagement() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [search, setSearch] = useState("");

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [feesData, setFeesData] = useState(null);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  /* ================= FETCH STUDENTS ================= */
  useEffect(() => {
    fetch("http://localhost:5000/api/admissions")
      .then((res) => res.json())
      .then((data) => {
        const list = data.data || [];
        setStudents(list);
        setFilteredStudents(list);
      })
      .catch(() => {
        setStudents([]);
        setFilteredStudents([]);
      });
  }, []);

  /* ================= SEARCH ================= */
  useEffect(() => {
    const filtered = students.filter((s) =>
      s.fullName?.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredStudents(filtered);
  }, [search, students]);

  /* ================= SELECT STUDENT ================= */
  const handleSelect = async (student) => {
    setSelectedStudent(student);
    setFeesData(null);

    try {
      const res = await fetch(
        `http://localhost:5000/api/fees/${student._id}`
      );
      const data = await res.json();

      if (data.success) {
        setFeesData(data.fees);
      }
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= PAY FUNCTION ================= */
  const handlePay = async () => {
    const payAmount = Number(amount);

    if (!payAmount || payAmount <= 0) {
      alert("Enter valid amount");
      return;
    }

    if (payAmount > (feesData?.remainingFees || 0)) {
      alert(`Max allowed: ₹${feesData?.remainingFees}`);
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `http://localhost:5000/api/fees/pay/${selectedStudent._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: payAmount }),
        }
      );

      const data = await res.json();

      if (data.success) {
        setFeesData(data.fees);
        setAmount("");
        alert("Payment Successful ✅");
      } else {
        alert(data.message || "Payment failed ❌");
      }
    } catch (err) {
      console.error(err);
      alert("Server error ❌");
    } finally {
      setLoading(false);
    }
  };

  /* ================= PDF FUNCTION ================= */
  const handleDownloadPDF = () => {
    if (!selectedStudent || !feesData) {
      alert("No data available");
      return;
    }

    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.text("Fees Receipt", 14, 20);

    // Student Info
    doc.setFontSize(12);
    doc.text(`Name: ${selectedStudent.fullName}`, 14, 35);
    doc.text(`Email: ${selectedStudent.email}`, 14, 45);

    // Table
    doc.autoTable({
      startY: 55,
      head: [["Total Fees", "Paid Fees", "Remaining Fees"]],
      body: [
        [
          `₹${feesData.totalFees || 0}`,
          `₹${feesData.paidFees || 0}`,
          `₹${feesData.remainingFees || 0}`,
        ],
      ],
    });

    // Footer
    doc.text("Thank you!", 14, doc.lastAutoTable.finalY + 20);

    // Save
    doc.save(`${selectedStudent.fullName}_fees_receipt.pdf`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-200 via-gray-100 to-blue-100 p-6">
      
      {/* HEADER */}
      <h1 className="text-3xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        💰 Fees Management
      </h1>

      {/* SEARCH */}
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="🔍 Search student..."
        className="w-full mb-6 px-5 py-3 rounded-xl bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <div className="grid md:grid-cols-3 gap-6">
        
        {/* LEFT - STUDENT LIST */}
        <div className="bg-gray-100/70 backdrop-blur-md rounded-2xl shadow-inner p-4 h-[420px] overflow-y-auto border border-gray-200">
          <h2 className="font-semibold text-lg mb-4 text-gray-700">
            Students
          </h2>

          {filteredStudents.length === 0 ? (
            <p className="text-gray-400 text-center mt-10">
              No students found
            </p>
          ) : (
            filteredStudents.map((s) => (
              <div
                key={s._id}
                onClick={() => handleSelect(s)}
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer mb-2 transition-all
                ${
                  selectedStudent?._id === s._id
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-gray-50 hover:bg-blue-50"
                }`}
              >
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-full font-bold
                  ${
                    selectedStudent?._id === s._id
                      ? "bg-white text-blue-600"
                      : "bg-blue-100 text-blue-600"
                  }`}
                >
                  {s.fullName?.charAt(0)}
                </div>

                <div className="flex flex-col">
                  <span className="font-medium">{s.fullName}</span>
                  <span
                    className={`text-xs ${
                      selectedStudent?._id === s._id
                        ? "text-blue-100"
                        : "text-gray-500"
                    }`}
                  >
                    {s.email || "No email"}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* RIGHT - DETAILS */}
        <div className="md:col-span-2 bg-gray-50 rounded-2xl shadow-lg p-6 min-h-[420px] border border-gray-200">
          
          {!selectedStudent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="h-full flex flex-col items-center justify-center text-center"
            >
              <div className="bg-blue-100 text-blue-600 p-5 rounded-full mb-4 text-3xl shadow-inner">
                👨‍🎓
              </div>

              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                No Student Selected
              </h2>

              <p className="text-gray-500">
                Select a student to view fees details.
              </p>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                {selectedStudent.fullName}
              </h2>

              {/* FEES CARDS */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-blue-500 text-white p-4 rounded-xl">
                  <p>Total</p>
                  <h3>₹{feesData?.totalFees || 0}</h3>
                </div>

                <div className="bg-green-500 text-white p-4 rounded-xl">
                  <p>Paid</p>
                  <h3>₹{feesData?.paidFees || 0}</h3>
                </div>

                <div className="bg-red-500 text-white p-4 rounded-xl">
                  <p>Remaining</p>
                  <h3>₹{feesData?.remainingFees || 0}</h3>
                </div>
              </div>

              <p className="text-sm text-gray-500 mb-2">
                Max Payable: ₹{feesData?.remainingFees || 0}
              </p>

              {/* ACTION */}
              <div className="flex gap-3">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="flex-1 px-4 py-2 border rounded-lg"
                />

                <button
                  onClick={handlePay}
                  disabled={
                    loading ||
                    !amount ||
                    Number(amount) <= 0 ||
                    Number(amount) > (feesData?.remainingFees || 0)
                  }
                  className={`px-5 py-2 rounded-lg text-white transition ${
                    loading ||
                    !amount ||
                    Number(amount) <= 0 ||
                    Number(amount) > (feesData?.remainingFees || 0)
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-500 hover:bg-green-600"
                  }`}
                >
                  {loading ? "Processing..." : "Pay"}
                </button>

                {/* PDF BUTTON */}
                <button
                  onClick={handleDownloadPDF}
                  className="bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2 rounded-lg"
                >
                  Download PDF
                </button>
              </div>

            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}