import { useState, useContext } from "react";
import api from "../../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { ThemeContext } from "../../App";
import { IoMoon, IoSunny } from "react-icons/io5";

export default function Register() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!role) {
      setMessage("Please select a role");
      return;
    }

    try {
      const res = await api.post("/auth/register", {
        username,
        email,
        password,
        role,
      });

      if (res.data === "registered") {
        setMessage("Registration successful! Redirecting...");
        setTimeout(() => navigate("/login"), 1500);
      } else if (res.data === "username_exists") {
        setMessage("Username already exists");
      } else if (res.data === "email_exists") {
        setMessage("Email already exists");
      }
    } catch {
      setMessage("Registration failed");
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
        onSubmit={handleRegister}
        className={`w-96 p-8 rounded-2xl shadow-2xl backdrop-blur-xl
        transition-all duration-500
        ${theme === "dark"
          ? "bg-slate-800/80 border border-slate-700"
          : "bg-white border border-gray-200"
        }`}
      >
        <h2 className="text-3xl font-bold text-center mb-2">
          Create Account
        </h2>
        <p className="text-center text-sm mb-6 opacity-70">
          Register a new user
        </p>

        {message && (
          <p className="text-center text-sm mb-4 text-red-500">
            {message}
          </p>
        )}

        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className={`w-full mb-4 px-4 py-3 rounded-lg border transition
          ${theme === "dark"
            ? "bg-slate-700 border-slate-600 text-white"
            : "bg-gray-50 border-gray-300"
          }`}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={`w-full mb-4 px-4 py-3 rounded-lg border transition
          ${theme === "dark"
            ? "bg-slate-700 border-slate-600 text-white"
            : "bg-gray-50 border-gray-300"
          }`}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={`w-full mb-4 px-4 py-3 rounded-lg border transition
          ${theme === "dark"
            ? "bg-slate-700 border-slate-600 text-white"
            : "bg-gray-50 border-gray-300"
          }`}
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
          className={`w-full mb-6 px-4 py-3 rounded-lg border transition
          ${theme === "dark"
            ? "bg-slate-700 border-slate-600 text-white"
            : "bg-gray-50 border-gray-300"
          }`}
        >
          <option value="">Select Role</option>
          <option value="ROLE_ADMIN">Admin</option>
          <option value="ROLE_SECURITY">Security</option>
          <option value="ROLE_STAFF">Staff</option>
        </select>

        <button
          className="w-full py-3 rounded-lg bg-green-600 text-white font-semibold
          hover:bg-green-700 hover:scale-[1.02] transition"
        >
          Register
        </button>

        <p className="text-center text-sm mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-500 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

