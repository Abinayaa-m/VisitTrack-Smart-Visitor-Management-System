import { useEffect, useState } from "react";
import { FaUsers, FaClock } from "react-icons/fa";
import api from "../../api/axios";

export default function StaffDashboard() {
  const [dashboard, setDashboard] = useState({
    todayVisitors: 0,
    activeVisitors: 0,
  });

  const [insideVisitors, setInsideVisitors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [dashboardRes, insideRes] = await Promise.all([
          api.get("/staff/dashboard"),
          api.get("/staff/not-exited"),
        ]);

        setDashboard(dashboardRes.data);
        setInsideVisitors(insideRes.data);
      } catch (err) {
        console.error("Failed to load dashboard", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  return (
    <div className="space-y-8 animate-fadeIn">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
          Staff Dashboard
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Overview of your visitors and activity
        </p>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DashboardCard
          title="My Visitors Today"
          value={loading ? "--" : dashboard.todayVisitors}
          icon={<FaUsers />}
        />

        <DashboardCard
          title="Active Visitors"
          value={loading ? "--" : dashboard.activeVisitors}
          icon={<FaClock />}
        />
      </div>

      {/* NOT EXITED VISITORS */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
          Visitors Currently Inside
        </h3>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : insideVisitors.length === 0 ? (
          <p className="text-gray-500">No visitors inside currently</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b dark:border-slate-700">
                  <th className="py-2">Name</th>
                  <th>Purpose</th>
                  <th>Entry Time</th>
                </tr>
              </thead>
              <tbody>
                {insideVisitors.map((v) => (
                  <tr
                    key={v.id}
                    className="border-b dark:border-slate-700 text-gray-700 dark:text-gray-200"
                  >
                    <td className="py-2">{v.name}</td>
                    <td>{v.purpose}</td>
                    <td>
                      {new Date(v.entryTime).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function DashboardCard({ title, value, icon }) {
  return (
    <div
      className="bg-white dark:bg-slate-800 rounded-xl shadow p-5
      flex justify-between items-center
      transition-transform hover:-translate-y-1"
    >
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
        <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-100">
          {value}
        </h2>
      </div>
      <div className="p-3 rounded-full bg-gray-100 dark:bg-slate-700 text-xl text-gray-500 dark:text-gray-200">
        {icon}
      </div>
    </div>
  );
}
