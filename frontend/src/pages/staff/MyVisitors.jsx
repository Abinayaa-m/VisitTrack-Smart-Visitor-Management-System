import { useEffect, useState, useContext } from "react";
import api from "../../api/axios";
import { ThemeContext } from "../../App";

export default function MyVisitors() {
  const { theme } = useContext(ThemeContext);

  const [visitors, setVisitors] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // 🔥 NEW: status filter
  const [status, setStatus] = useState("");

  const size = 6; // small size to clearly see pagination

  useEffect(() => {
    loadVisitors();
  }, [page, status]);

  const loadVisitors = async () => {
    try {
      setLoading(true);

      const res = await api.get("/visitors/my-visitors", {
        params: {
          page,
          size,
          status: status || undefined, // 👈 important
        },
      });

      setVisitors(res.data.content || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("Failed to load visitors", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* TITLE */}
      <div>
        <h2 className="text-3xl font-bold">My Visitors</h2>
        <p className="text-gray-400">
          Visitors who came to meet you today
        </p>
      </div>

      {/* FILTER */}
      <div className="flex justify-end">
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(0); // reset page on filter change
          }}
          className="px-4 py-2 rounded bg-slate-700 text-white focus:outline-none"
        >
          <option value="">All</option>
          <option value="ACTIVE">Active</option>
          <option value="EXITED">Exited</option>
        </select>
      </div>

      {/* TABLE CARD */}
      <div
        className={`rounded-2xl shadow-xl p-6 transition
        ${theme === "dark" ? "bg-slate-800 text-white" : "bg-white"}`}
      >
        {loading ? (
          <div className="text-center py-10 text-gray-400">
            Loading visitors...
          </div>
        ) : visitors.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            No visitors found
          </div>
        ) : (
          <>
            {/* TABLE */}
            <table className="w-full border-collapse">
              <thead>
                <tr
                  className={`text-left ${
                    theme === "dark" ? "bg-slate-700" : "bg-gray-100"
                  }`}
                >
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Entry</th>
                  <th className="p-3">Exit</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {visitors.map((v) => (
                  <tr
                    key={v.id}
                    className={`border-t transition ${
                      theme === "dark"
                        ? "hover:bg-slate-700"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <td className="p-3">{v.name}</td>
                    <td className="p-3">{v.email}</td>
                    <td className="p-3">{v.phone}</td>
                    <td className="p-3">
                      {new Date(v.entryTime).toLocaleString()}
                    </td>
                    <td className="p-3">
                      {v.exitTime
                        ? new Date(v.exitTime).toLocaleString()
                        : "—"}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold
                        ${
                          v.status === "ACTIVE"
                            ? "bg-green-600 text-white"
                            : "bg-gray-500 text-white"
                        }`}
                      >
                        {v.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-6">
                <button
                  disabled={page === 0 || loading}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-4 py-2 rounded bg-gray-300 dark:bg-slate-700 disabled:opacity-50"
                >
                  Previous
                </button>

                <span className="text-sm text-gray-400">
                  Page {page + 1} of {totalPages}
                </span>

                <button
                  disabled={page >= totalPages - 1 || loading}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-4 py-2 rounded bg-gray-300 dark:bg-slate-700 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
