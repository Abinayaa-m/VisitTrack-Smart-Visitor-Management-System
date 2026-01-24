import React, { useState, useContext } from "react";
import {
  advancedSearchVisitors,
  exitVisitor,
  exportVisitorsCSV,
  exportVisitorsExcel,
} from "../../api/visitorApi";
import { ThemeContext } from "../../App";
import { getRoleFromToken } from "../../utils/auth";

export default function SearchVisitors() {
  const { theme } = useContext(ThemeContext);

  // 🔐 ROLE CHECK
  const role = getRoleFromToken();
  const isSecurity = role === "ROLE_SECURITY";
  const isAdmin = role === "ROLE_ADMIN";

  const [filters, setFilters] = useState({
    name: "",
    email: "",
    phone: "",
    status: "",
    from: "",
    to: "",
  });

  const [results, setResults] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const size = 10;

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const buildParams = (newPage = page) => {
    const params = { page: newPage, size };
    Object.keys(filters).forEach((k) => {
      if (filters[k]) params[k] = filters[k];
    });
    return params;
  };

  const applyFilters = async (newPage = 0) => {
    try {
      setLoading(true);
      setPage(newPage);

      const res = await advancedSearchVisitors(buildParams(newPage));
      setResults(res.data.content || []);
      setTotalPages(res.data.totalPages || 1);
      setMessage("");
    } catch {
      setMessage("Error applying filters");
    } finally {
      setLoading(false);
    }
  };

  // 🔐 SECURITY ONLY
  const handleExit = async (id) => {
    try {
      await exitVisitor(id);
      setMessage("Visitor marked as exited!");
      applyFilters(page);
    } catch {
      setMessage("Failed to exit visitor");
    }
  };

  // 🧾 ADMIN EXPORTS
  const downloadFile = (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleExportCSV = async () => {
    const res = await exportVisitorsCSV(buildParams(0));
    downloadFile(res.data, "visitors.csv");
  };

  const handleExportExcel = async () => {
    const res = await exportVisitorsExcel(buildParams(0));
    downloadFile(res.data, "visitors.xlsx");
  };

  const LoadingSpinner = () => (
    <div className="flex justify-center py-6">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-purple-600 border-t-transparent"></div>
    </div>
  );

  return (
    <div
      className={`p-6 min-h-screen transition-colors duration-500 ${
        theme === "dark"
          ? "bg-gradient-to-b from-slate-900 to-slate-800 text-white"
          : "bg-gray-100"
      }`}
    >
      <div
        className={`max-w-6xl mx-auto p-6 rounded-2xl shadow-xl
        animate-fadeIn transition-all duration-500 ${
          theme === "dark"
            ? "bg-slate-800 border border-slate-700"
            : "bg-white"
        }`}
      >
        <h2
          className={`text-4xl font-bold mb-8 flex items-center gap-2 animate-fadeIn ${
            theme === "dark" ? "text-purple-300" : "text-purple-700"
          }`}
        >
          Advanced Visitor Search 🔍
        </h2>

        {/* FILTERS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {[
            { label: "Name", name: "name", placeholder: "Enter visitor name" },
            { label: "Email", name: "email", placeholder: "Enter email" },
            { label: "Phone", name: "phone", placeholder: "Enter phone number" },
          ].map((f) => (
            <div
              key={f.name}
              className={`p-4 rounded-xl border shadow transform transition-all duration-300
              hover:shadow-lg hover:-translate-y-1 ${
                theme === "dark"
                  ? "bg-slate-700 border-slate-600"
                  : "bg-gray-50"
              }`}
            >
              <label className="block font-semibold mb-1">{f.label}</label>
              <input
                type="text"
                name={f.name}
                value={filters[f.name]}
                onChange={handleChange}
                placeholder={f.placeholder}
                className={`w-full p-2 rounded border transition ${
                  theme === "dark"
                    ? "bg-slate-800 text-white border-slate-600"
                    : "bg-white"
                }`}
              />
            </div>
          ))}

          {/* STATUS */}
          <div
            className={`p-4 rounded-xl border shadow transform transition-all duration-300
            hover:shadow-lg hover:-translate-y-1 ${
              theme === "dark"
                ? "bg-slate-700 border-slate-600"
                : "bg-gray-50"
            }`}
          >
            <label className="block font-semibold mb-1">Status</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleChange}
              className={`w-full p-2 rounded border ${
                theme === "dark"
                  ? "bg-slate-800 text-white border-slate-600"
                  : "bg-white"
              }`}
            >
              <option value="">Any</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="EXITED">EXITED</option>
              <option value="OVERDUE">OVERDUE</option>
            </select>
          </div>

          {/* DATES */}
          {["from", "to"].map((d) => (
            <div
              key={d}
              className={`p-4 rounded-xl border shadow transform transition-all duration-300
              hover:shadow-lg hover:-translate-y-1 ${
                theme === "dark"
                  ? "bg-slate-700 border-slate-600"
                  : "bg-gray-50"
              }`}
            >
              <label className="block font-semibold mb-1">
                {d === "from" ? "From Date" : "To Date"}
              </label>
              <input
                type="date"
                name={d}
                value={filters[d]}
                onChange={handleChange}
                className={`w-full p-2 rounded border ${
                  theme === "dark"
                    ? "bg-slate-800 text-white border-slate-600"
                    : "bg-white"
                }`}
              />
            </div>
          ))}
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex gap-4 flex-wrap mb-4">
          <button
            onClick={() => applyFilters(0)}
            className="px-8 py-3 bg-purple-600 text-white rounded-lg
            font-semibold shadow-md transform transition-all duration-300
            hover:bg-purple-700 hover:scale-105"
          >
            Apply Filters
          </button>

          {isAdmin && (
            <>
              <button
                onClick={handleExportCSV}
                className="px-6 py-3 bg-green-600 text-white rounded-lg
                transform transition-all duration-300 hover:bg-green-700 hover:scale-105"
              >
                Export CSV
              </button>
              <button
                onClick={handleExportExcel}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg
                transform transition-all duration-300 hover:bg-blue-700 hover:scale-105"
              >
                Export Excel
              </button>
            </>
          )}
        </div>

        {message && (
          <div className="text-green-400 font-semibold animate-fadeIn">
            {message}
          </div>
        )}

        {loading && <LoadingSpinner />}

        {/* TABLE */}
        {!loading && (
          <div className="mt-6 animate-fadeIn">
            <table className="w-full border-collapse rounded-lg overflow-hidden shadow-lg">
              <thead className={theme === "dark" ? "bg-purple-900/40" : "bg-purple-100"}>
                <tr>
                  {["Name","Email","Phone","Purpose","Staff","Entry","Exit","Status","Action"].map(h => (
                    <th key={h} className="p-3 border">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {results.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center p-4 text-gray-400">
                      No results found
                    </td>
                  </tr>
                ) : (
                  results.map(v => (
                    <tr key={v.id} className={theme === "dark" ? "hover:bg-slate-700" : "hover:bg-purple-50"}>
                      <td className="border p-2">{v.name}</td>
                      <td className="border p-2">{v.email}</td>
                      <td className="border p-2">{v.phone}</td>
                      <td className="border p-2">{v.purpose}</td>
                      <td className="border p-2">{v.staffUsername}</td>
                      <td className="border p-2">{new Date(v.entryTime).toLocaleString()}</td>
                      <td className="border p-2">{v.exitTime ? new Date(v.exitTime).toLocaleString() : "—"}</td>
                      <td className="border p-2">{v.status}</td>
                      <td className="border p-2 text-center">
                        {isSecurity && v.status === "ACTIVE" ? (
                          <button
                            onClick={() => handleExit(v.id)}
                            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                          >
                            Exit
                          </button>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* ✅ PAGINATION */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-6 animate-fadeIn">
                <button
                  disabled={page === 0}
                  onClick={() => applyFilters(page - 1)}
                  className={`px-4 py-2 rounded ${
                    page === 0
                      ? "bg-gray-500 cursor-not-allowed"
                      : "bg-slate-700 text-white hover:bg-slate-600"
                  }`}
                >
                  Previous
                </button>

                <span className="font-semibold">
                  Page {page + 1} of {totalPages}
                </span>

                <button
                  disabled={page + 1 >= totalPages}
                  onClick={() => applyFilters(page + 1)}
                  className={`px-4 py-2 rounded ${
                    page + 1 >= totalPages
                      ? "bg-gray-500 cursor-not-allowed"
                      : "bg-slate-700 text-white hover:bg-slate-600"
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
