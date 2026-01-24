import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { IoLogOutOutline, IoMoon, IoSunny } from "react-icons/io5";
import { FaChartBar, FaUsers, FaUserTie } from "react-icons/fa";
import { logout } from "../../utils/auth";
import { useContext } from "react";
import { ThemeContext } from "../../App";

export default function AdminLayout() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useContext(ThemeContext);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // ✅ COMMON ACTIVE CLASS (same behavior for all links)
  const navClass = ({ isActive }) =>
    `block px-4 py-2 rounded transition-all ${
      isActive
        ? "bg-blue-600 text-white"
        : "hover:bg-slate-700 dark:hover:bg-slate-800"
    }`;

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-slate-900 transition-colors">

      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 dark:bg-slate-950 text-white flex flex-col p-6">
        <h2 className="text-xl font-bold mb-8">Admin Panel</h2>

        <nav className="flex-1 space-y-2">
          <NavLink to="/admin/dashboard" className={navClass}>
            <FaChartBar className="inline mr-2" />
            Dashboard
          </NavLink>

          <NavLink to="/admin/visitors" className={navClass}>
            <FaUsers className="inline mr-2" />
            All Visitors
          </NavLink>

          <NavLink to="/admin/staff" className={navClass}>
            <FaUserTie className="inline mr-2" />
            Staff Management
          </NavLink>

          <NavLink to="/admin/profile" className={navClass}>
             Profile
          </NavLink>
        </nav>

        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 p-3 rounded flex items-center justify-center gap-2"
        >
          <IoLogOutOutline />
          Logout
        </button>
      </aside>

      {/* MAIN */}
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

        {/* CONTENT */}
        <div className="flex-1 p-6 overflow-y-auto bg-gray-100 dark:bg-slate-900 transition-colors">
          <Outlet />
        </div>

      </main>
    </div>
  );
}
