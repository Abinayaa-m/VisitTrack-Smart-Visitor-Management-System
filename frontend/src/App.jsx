import { createContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import StaffManagement from "./pages/admin/StaffManagement";
import AdminProfile from "./pages/admin/AdminProfile";

import SecurityLayout from "./pages/security/SecurityLayout";
import SecurityDashboard from "./pages/security/SecurityDashboard";
import AddVisitor from "./pages/security/AddVisitor";
import SearchVisitors from "./pages/security/SearchVisitors";
import ScanAndVerify from "./pages/security/ScanAndVerify";

import StaffLayout from "./pages/staff/StaffLayout";
import StaffDashboard from "./pages/staff/StaffDashboard";
import SetupProfile from "./pages/staff/SetupProfile";
import MyVisitors from "./pages/staff/MyVisitors";
import MyProfile from "./pages/staff/MyProfile";


import ProtectedRoute from "./components/ProtectedRoute";

// 🌗 Theme Context
export const ThemeContext = createContext();

function App() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved) setTheme(saved);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    theme === "dark"
      ? root.classList.add("dark")
      : root.classList.remove("dark");

    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme(theme === "light" ? "dark" : "light");

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <Router>
        <Routes>
          {/* ================= PUBLIC ================= */}
          <Route path="/" element={<Register />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* ================= ADMIN ================= */}
          <Route element={<ProtectedRoute allowedRoles={["ROLE_ADMIN"]} />}>
          <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="visitors" element={<SearchVisitors />} />
          <Route path="staff" element={<StaffManagement />} />   
          <Route path="/admin/profile" element={<AdminProfile />}/>

          </Route>
          </Route>


          <Route element={<ProtectedRoute allowedRoles={["ROLE_STAFF"]} />}>
            <Route path="/staff" element={<StaffLayout />}>
            <Route path="dashboard" element={<StaffDashboard />} />
            <Route path="setup-profile" element={<SetupProfile />} />
            <Route path="my-visitors" element={<MyVisitors />} />
            <Route path="my-profile" element={<MyProfile />} />
         </Route>
         </Route>






          {/* ================= SECURITY ================= */}
          <Route element={<ProtectedRoute allowedRoles={["ROLE_SECURITY"]} />}>
            <Route path="/security" element={<SecurityLayout />}>
              <Route path="dashboard" element={<SecurityDashboard />} />
              <Route path="add-visitor" element={<AddVisitor />} />
              <Route path="search" element={<SearchVisitors />} />
              <Route path="scan" element={<ScanAndVerify />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </ThemeContext.Provider>
  );
}

export default App;
