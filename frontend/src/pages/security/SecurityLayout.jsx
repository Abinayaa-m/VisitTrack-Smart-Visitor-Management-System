import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { IoLogOutOutline } from "react-icons/io5";
import { FaUserShield, FaUserPlus, FaSearch, FaUsers, FaQrcode } from "react-icons/fa";
import { logout } from "../../utils/auth";
import { ThemeContext } from "../../App";
import { useContext } from "react";
import { BsSun, BsMoonStars } from "react-icons/bs";

export default function SecurityLayout() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useContext(ThemeContext);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
  { to: "/security/dashboard", label: "Dashboard", icon: <FaUserShield /> },
  { to: "/security/add-visitor", label: "Add Visitor", icon: <FaUserPlus /> },
  { to: "/security/search", label: "Search Visitors", icon: <FaSearch /> },
  { to: "/security/scan", label: "Scan & Verify", icon: <FaQrcode /> },
];


  return (
    <div className={`flex h-screen transition-all duration-500 ${theme === "dark" ? "bg-[#0f172a]" : "bg-gray-100"}`}>

      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white flex flex-col p-6 shadow-xl">
        <h2 className="text-2xl font-bold mb-10 flex items-center gap-2">
          <FaUserShield /> Security Panel
        </h2>

        <nav className="flex-1 space-y-3">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 p-2 rounded-lg transition ${
                  isActive ? "bg-blue-700" : "hover:bg-blue-800"
                }`
              }
            >
              {item.icon} {item.label}
            </NavLink>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 p-3 rounded-lg flex items-center justify-center gap-2"
        >
          <IoLogOutOutline /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 flex flex-col transition-all duration-500 
        ${theme === "dark" ? "bg-gradient-to-br from-[#0f172a] to-[#1e293b]" : "bg-white"}`}>

        {/* Top Navbar */}
        <header className={`shadow flex justify-between items-center px-8 py-4 transition 
          ${theme === "dark" ? "bg-white/10 backdrop-blur-md text-white" : "bg-white text-blue-900"}`}>
          
          <h1 className="text-xl font-semibold">
            Visitor Management System
          </h1>

          {/* 🌗 THEME TOGGLE BUTTON */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 
            shadow-md transition flex items-center justify-center"
          >
            {theme === "dark" ? (
              <BsSun className="text-yellow-300" size={22} />
            ) : (
              <BsMoonStars className="text-blue-700" size={22} />
            )}
          </button>

        </header>

        {/* Dynamic Page Content */}
        <div className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
