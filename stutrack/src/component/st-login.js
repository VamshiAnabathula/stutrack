import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState(""); // ✅ NEW
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [forgotMode, setForgotMode] = useState(false); // ✅ NEW

  /* ================= SEND OTP ================= */
  const handleSendOtp = async () => {
    if (!email) {
      alert("Please enter email first");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (data.success) {
        setOtpSent(true);
        alert("OTP Sent Successfully 📩");
      } else {
        alert(data.message);
      }
    } catch {
      alert("Server Error ❌");
    } finally {
      setLoading(false);
    }
  };

  /* ================= MOBILE → EMAIL OTP ================= */
  const handleSendOtpMobile = async () => {
    if (!mobile) {
      alert("Please enter mobile number");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/auth/mobile-send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile }),
      });

      const data = await res.json();

      if (data.success) {
        setEmail(data.email); // ✅ backend thi email
        setOtpSent(true);
        alert("OTP sent to your email 📩");
      } else {
        alert(data.message);
      }
    } catch {
      alert("Server Error ❌");
    } finally {
      setLoading(false);
    }
  };

  /* ================= VERIFY OTP ================= */
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!otp) {
      alert("Please enter OTP");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("student", JSON.stringify(data.student));
        localStorage.setItem("studentEmail", data.student.email);

        alert("Login Successful ✅");
        navigate("/studentdashboard");
      } else {
        alert(data.message);
      }
    } catch {
      alert("Server Error ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">

      <div className="w-full max-w-5xl bg-gray-900 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row">

        {/* ================= LEFT SIDE ================= */}
        <div className="w-full md:w-1/2 p-8 md:p-12 text-white flex flex-col justify-center">

          <h2 className="text-2xl md:text-3xl font-semibold mb-2">Login</h2>

          <p className="text-gray-400 mb-8 text-sm md:text-base">
            Enter your account details
          </p>

          <form onSubmit={handleLogin} className="space-y-6">

            {/* EMAIL OR MOBILE */}
            <div>
              <label className="text-sm text-gray-400">
                {forgotMode ? "Mobile Number" : "Email"}
              </label>

              <input
                type={forgotMode ? "text" : "email"}
                placeholder={forgotMode ? "Enter mobile number" : "Enter your email"}
                className="w-full mt-2 px-4 py-3 bg-gray-700 rounded-md focus:outline-none"
                value={forgotMode ? mobile : email}
                onChange={(e) =>
                  forgotMode
                    ? setMobile(e.target.value)
                    : setEmail(e.target.value)
                }
                required
              />
            </div>

            {/* SEND OTP */}
            {!otpSent && (
              <>
                <button
                  type="button"
                  onClick={forgotMode ? handleSendOtpMobile : handleSendOtp}
                  disabled={loading}
                  className="w-full bg-purple-600 py-3 rounded-md hover:bg-purple-700 transition disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Send OTP"}
                </button>
              </>
            )}

            {/* OTP SECTION */}
            {otpSent && (
              <>
                <div>
                  <label className="text-sm text-gray-400">OTP</label>

                  <input
                    type="text"
                    placeholder="Enter OTP"
                    className="w-full mt-2 px-4 py-3 bg-gray-700 rounded-md focus:outline-none"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-purple-600 py-3 rounded-md hover:bg-purple-700 transition disabled:opacity-50"
                >
                  {loading ? "Verifying..." : "Verify & Login"}
                </button>
              </>
            )}
          </form>

          {/* ✅ ONLY THIS ADDED */}
          <p className="text-center text-gray-400 text-sm mt-4">
            {forgotMode ? "Remember email?" : "Forgot email?"}{" "}
            <span
              onClick={() => {
                setForgotMode(!forgotMode);
                setOtpSent(false);
                setEmail("");
                setMobile("");
                setOtp("");
              }}
              className="text-purple-400 cursor-pointer hover:underline"
            >
              Click here
            </span>
          </p>

        </div>

        {/* ================= RIGHT SIDE ================= */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-purple-500 to-purple-700 p-8 md:p-12 text-white flex flex-col justify-center items-center">
          
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-center">
            Welcome to <br /> Student Portal
          </h2>

          <p className="mb-6 text-center">
            Login to access your account
          </p>

          <div className="bg-white p-4 rounded-lg shadow-lg">
            <img
              src="/image/student.png"
              alt="Student"
              className="w-[200px] lg:w-[250px] object-contain"
            />
          </div>

        </div>

      </div>
    </div>
  );
}