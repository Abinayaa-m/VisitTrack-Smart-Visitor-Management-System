import { useState, useContext } from "react";
import api from "../../api/axios";
import { saveToken, getRoleFromToken } from "../../utils/auth";
import { useNavigate, Link } from "react-router-dom";
import { ThemeContext } from "../../App";
import { IoMoon, IoSunny } from "react-icons/io5";

export default function Login() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/login", {
        identifier,
        password,
      });

      saveToken(response.data.token);
      const role = getRoleFromToken();

      if (role === "ROLE_ADMIN") navigate("/admin/dashboard");
      else if (role === "ROLE_SECURITY") navigate("/security/dashboard");
      else if (role === "ROLE_STAFF") navigate("/staff/dashboard");
      else setError("Unauthorized role!");
    } catch {
      setError("Invalid credentials");
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center transition-colors duration-500
      ${theme === "dark"
        ? "bg-gradient-to-br from-slate-900 to-slate-800 text-white"
        : "bg-gradient-to-br from-gray-100 to-gray-200 text-gray-800"
      }`}
    >
      {/* THEME TOGGLE */}
      <button
        onClick={toggleTheme}
        className="fixed top-6 right-6 p-3 rounded-full shadow-lg
        bg-white/20 backdrop-blur hover:scale-110 transition"
      >
        {theme === "dark" ? <IoSunny size={18} /> : <IoMoon size={18} />}
      </button>

      <form
        onSubmit={handleLogin}
        className={`w-96 p-8 rounded-2xl shadow-2xl backdrop-blur-xl
        transition-all duration-500
        ${theme === "dark"
          ? "bg-slate-800/80 border border-slate-700"
          : "bg-white border border-gray-200"
        }`}
      >
        <h2 className="text-3xl font-bold text-center mb-2">
          Visitor Management System
        </h2>
        <p className="text-center text-sm mb-6 opacity-70">
          Login to continue
        </p>

        {error && (
          <p className="text-red-500 text-center text-sm mb-4">
            {error}
          </p>
        )}

        <input
          type="text"
          placeholder="Email or Username"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          required
          className={`w-full mb-4 px-4 py-3 rounded-lg border transition
          ${theme === "dark"
            ? "bg-slate-700 border-slate-600 text-white placeholder-gray-400"
            : "bg-gray-50 border-gray-300"
          }`}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={`w-full mb-6 px-4 py-3 rounded-lg border transition
          ${theme === "dark"
            ? "bg-slate-700 border-slate-600 text-white placeholder-gray-400"
            : "bg-gray-50 border-gray-300"
          }`}
        />

        <button
          className="w-full py-3 rounded-lg bg-blue-600 text-white font-semibold
          hover:bg-blue-700 hover:scale-[1.02] transition"
        >
          Login
        </button>

        <p className="text-center text-sm mt-6">
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="text-blue-500 font-semibold hover:underline"
          >
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
