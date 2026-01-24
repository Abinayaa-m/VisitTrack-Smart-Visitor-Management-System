import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { IoLogOutOutline, IoMoon, IoSunny } from "react-icons/io5";
import { FaHome, FaUsers, FaUser } from "react-icons/fa";
import { logout } from "../../utils/auth";
import { useContext } from "react";
import { ThemeContext } from "../../App";

export default function StaffLayout() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useContext(ThemeContext);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-slate-900 transition-colors">

      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 dark:bg-slate-950 text-white flex flex-col p-6">
        <h2 className="text-xl font-bold mb-8">Staff Panel</h2>

        <nav className="flex-1 space-y-2">
          {/* Dashboard */}
          <NavLink
            to="/staff/dashboard"
            className={({ isActive }) =>
              `block px-4 py-2 rounded ${
                isActive
                  ? "bg-blue-600"
                  : "hover:bg-slate-700 dark:hover:bg-slate-800"
              }`
            }
          >
            <FaHome className="inline mr-2" />
            Dashboard
          </NavLink>

          {/* My Visitors */}
          <NavLink
            to="/staff/my-visitors"
            className={({ isActive }) =>
              `block px-4 py-2 rounded ${
                isActive
                  ? "bg-blue-600"
                  : "hover:bg-slate-700 dark:hover:bg-slate-800"
              }`
            }
          >
            <FaUsers className="inline mr-2" />
            My Visitors
          </NavLink>

          {/* My Profile */}
          <NavLink
            to="/staff/my-profile"
            className={({ isActive }) =>
              `block px-4 py-2 rounded ${
                isActive
                  ? "bg-blue-600"
                  : "hover:bg-slate-700 dark:hover:bg-slate-800"
              }`
            }
          >
            <FaUser className="inline mr-2" />
            My Profile
          </NavLink>
        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 p-3 rounded flex items-center justify-center gap-2"
        >
          <IoLogOutOutline />
          Logout
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col">

        {/* TOP BAR */}
        <header className="bg-white dark:bg-slate-800 shadow px-6 py-4 flex justify-between items-center">
          <h1 className="font-semibold text-gray-800 dark:text-gray-100">
            Visitor Management System
          </h1>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-white"
          >
            {theme === "dark" ? <IoSunny /> : <IoMoon />}
          </button>
        </header>

        {/* PAGE CONTENT */}
        <div className="flex-1 p-6 overflow-y-auto bg-gray-100 dark:bg-slate-900 transition-colors">
          <Outlet />
        </div>

      </main>
    </div>
  );
}
