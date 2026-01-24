import React, { useEffect, useState, useContext } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { getHourlyStatsByRange } from "../../api/adminDashboardApi";
import { ThemeContext } from "../../App";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function HourlyVisitorsChart({ range = "today" }) {
  const { theme } = useContext(ThemeContext);

  const [labels, setLabels] = useState([]);
  const [counts, setCounts] = useState([]);
  const [peak, setPeak] = useState({ hour: "", value: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [range]);

  const formatHour = (hour) => {
    if (hour === 0) return "12 AM";
    if (hour === 12) return "12 PM";
    if (hour > 12) return `${hour - 12} PM`;
    return `${hour} AM`;
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await getHourlyStatsByRange(range);
      const raw = res.data || {};

      // 🔥 ALWAYS BUILD 24 HOURS
      const hours = [];
      for (let i = 0; i < 24; i++) {
        hours.push({
          hour: i,
          count: raw[i] || 0,
        });
      }

      const peakItem = hours.reduce((max, curr) =>
        curr.count > max.count ? curr : max
      );

      setLabels(hours.map((h) => formatHour(h.hour)));
      setCounts(hours.map((h) => h.count));

      setPeak({
        hour: formatHour(peakItem.hour),
        value: peakItem.count,
      });
    } catch (err) {
      console.error("Hourly chart error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow p-6">
        <p className="text-gray-500 dark:text-gray-400">Loading hourly visitors…</p>
      </div>
    );
  }

  return (
    <div
      className={`
        rounded-2xl shadow-xl p-6 mt-6
        ${theme === "dark"
          ? "bg-gradient-to-br from-slate-900 to-slate-800"
          : "bg-white"}
      `}
    >
      {/* TITLE */}
      <h3 className="text-xl font-semibold text-purple-600 mb-2">
        Today&apos;s Hourly Visitors
      </h3>

      {/* PEAK */}
      <div className="mb-4 flex items-center gap-2 text-sm">
        <span className="text-gray-600 dark:text-gray-300 font-medium">
          Peak Hour:
        </span>
        <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 font-semibold">
          {peak.hour} • {peak.value} visitors
        </span>
      </div>

      {/* CHART */}
      <div className="relative h-[320px] w-full">
        <Bar
          data={{
            labels,
            datasets: [
              {
                data: counts,
                backgroundColor: counts.map((v) =>
                  v === peak.value && v > 0
                    ? "rgba(251,146,60,0.9)"
                    : "rgba(99,102,241,0.7)"
                ),
                borderRadius: 8,

                // 🔥 KEEP BARS CLOSE (OLD STYLE)
                categoryPercentage: 1.0,
                barPercentage: 0.9,
                barThickness: 14,
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: {
                callbacks: {
                  label: (ctx) => `${ctx.parsed.y} visitors`,
                },
              },
            },
            scales: {
              x: {
                ticks: {
                  autoSkip: false, // 🔥 SHOW ALL HOURS
                  maxRotation: 45,
                  minRotation: 45,
                  color: theme === "dark" ? "#cbd5f5" : "#374151",
                  font: { size: 11 },
                },
                grid: { display: false },
              },
              y: {
                beginAtZero: true,
                ticks: {
                  stepSize: 1,
                  color: theme === "dark" ? "#cbd5f5" : "#374151",
                },
                grid: {
                  color:
                    theme === "dark"
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(0,0,0,0.08)",
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
}
