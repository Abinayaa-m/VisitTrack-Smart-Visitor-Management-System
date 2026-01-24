import { useEffect, useState } from "react";
import { getAdminDashboardAnalytics } from "../../api/adminDashboardApi";
import DailyVisitorTrendChart from "../../components/Charts/DailyVisitorTrendChart";
import VisitorStatusPieChart from "../../components/Charts/VisitorStatusPieChart";
import HourlyVisitorsChart from "../../components/Charts/HourlyVisitorsChart";

import {
  FaUsers,
  FaUserCheck,
  FaUserTimes,
  FaExclamationTriangle
} from "react-icons/fa";

export default function AdminDashboard() {
  const [range, setRange] = useState("today");
  const [loading, setLoading] = useState(true);

  const [data, setData] = useState({
    summary: { total: 0, active: 0, exited: 0, overstayed: 0 },
    dailyTrend: [],
    statusDistribution: [],
  });

  useEffect(() => {
    loadDashboard();
  }, [range]);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const res = await getAdminDashboardAnalytics(range);
      setData(prev => ({
        ...prev,
        ...res.data,
        summary: { ...prev.summary, ...(res.data?.summary || {}) }
      }));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center text-gray-500 dark:text-gray-400">
        Loading analytics...
      </div>
    );
  }

  const summary = data.summary;

  return (
    <div className="space-y-8 px-2 lg:px-0">

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
            Admin Analytics Dashboard
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Real-time visitor insights & operational overview
          </p>
        </div>

        {/* RANGE FILTER */}
        <div className="inline-flex bg-white dark:bg-slate-800 rounded-xl shadow-sm border dark:border-slate-700 overflow-hidden">
          {["today", "week", "month", "6months", "year"].map(r => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-5 py-2 text-sm font-medium transition-all duration-200 ${
                range === r
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
              }`}
            >
              {r.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KpiCard title="Total Visitors" value={summary.total} icon={<FaUsers />} accent="border-blue-500" />
        <KpiCard title="Active Visitors" value={summary.active} icon={<FaUserCheck />} accent="border-green-500" />
        <KpiCard title="Exited Visitors" value={summary.exited} icon={<FaUserTimes />} accent="border-gray-400" />
        <KpiCard title="Overstayed" value={summary.overstayed} icon={<FaExclamationTriangle />} accent="border-red-500" />
      </div>

      {/* ANALYTICS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="lg:col-span-2">
          <AnalyticsBox title="Daily Visitor Trend">
            <DailyVisitorTrendChart data={data.dailyTrend} />
          </AnalyticsBox>
        </div>

        <AnalyticsBox title="Visitor Status Distribution">
          <VisitorStatusPieChart data={data.statusDistribution} />
        </AnalyticsBox>

        <AnalyticsBox title="Peak Visiting Hours">
          <HourlyVisitorsChart range={range} />
        </AnalyticsBox>

      </div>
    </div>
  );
}

/* ---------------- COMPONENTS ---------------- */

function KpiCard({ title, value, icon, accent }) {
  return (
    <div
      className={`bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border-l-4 ${accent}
      transition-transform duration-300 hover:-translate-y-1 hover:shadow-md`}
    >
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <h2 className="text-3xl font-semibold text-gray-800 dark:text-white mt-1">
            {value}
          </h2>
        </div>
        <div className="p-3 rounded-full bg-gray-100 dark:bg-slate-700 text-xl text-gray-500 dark:text-gray-300">
          {icon}
        </div>
      </div>
    </div>
  );
}

function AnalyticsBox({ title, children }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-5 h-[380px] flex flex-col">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
        {title}
      </h3>
      <div className="flex-1 relative">{children}</div>
    </div>
  );
}
