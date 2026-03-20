import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserShield, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Please fill all fields");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      if (username === "admin" && password === "admin123") {
        localStorage.setItem("adminLoggedIn", "true");
        navigate("/admindashboard");
      } else {
        setError("Invalid Admin Credentials");
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-400 via-blue-500 to-blue-700 p-4">
      
      <form
        onSubmit={handleLogin}
        className="bg-white/20 backdrop-blur-lg border border-white/30 shadow-2xl rounded-2xl w-full max-w-md p-8 text-white"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3 text-4xl">
            <FaUserShield />
          </div>
          <h2 className="text-2xl font-bold tracking-wide">
            Admin Login
          </h2>
          <p className="text-sm text-blue-100 mt-1">
            Secure access to Admin Panel
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/80 text-white text-sm p-2 rounded-lg mb-4 text-center">
            {error}
          </div>
        )}

        {/* Username */}
        <div className="relative mb-4">
          <FaUserShield className="absolute top-3 left-3 text-blue-200" />
          <input
            type="text"
            placeholder="Admin Username"
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/30 border border-white/40 placeholder-blue-100 focus:outline-none focus:ring-2 focus:ring-white transition"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        {/* Password */}
        <div className="relative mb-4">
          <FaLock className="absolute top-3 left-3 text-blue-200" />
          <input
            type={showPass ? "text" : "password"}
            placeholder="Password"
            className="w-full pl-10 pr-10 py-2 rounded-lg bg-white/30 border border-white/40 placeholder-blue-100 focus:outline-none focus:ring-2 focus:ring-white transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span
            className="absolute top-3 right-3 cursor-pointer text-blue-200"
            onClick={() => setShowPass(!showPass)}
          >
            {showPass ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-white text-blue-700 font-semibold py-2 rounded-lg shadow-md hover:bg-blue-100 transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Demo Credentials */}
        
      </form>
    </div>
  );
}