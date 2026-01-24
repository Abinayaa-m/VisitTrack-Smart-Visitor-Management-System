import { useEffect, useState, useContext } from "react";  // 🔥 add useContext
import { getTodayStats } from "../../api/visitorApi";
import { FaUserPlus, FaUsers, FaDoorOpen } from "react-icons/fa";
import { getUsernameFromToken } from "../../utils/auth";
import HourlyVisitorsChart from "../../components/Charts/HourlyVisitorsChart";

// 🔥 import ThemeContext
import { ThemeContext } from "../../App";

export default function SecurityDashboard() {
  // 🔥 access theme
  const { theme } = useContext(ThemeContext);

  const [stats, setStats] = useState({
    totalVisitorsToday: 0,
    activeVisitors: 0,
    exitedVisitors: 0,
  });

  const username = getUsernameFromToken();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const res = await getTodayStats();
      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 space-y-10 animate-fadeIn">

      {/* HEADER */}
      <h2
  className={`text-5xl font-semibold tracking-tight transition-all duration-300
    font-sans
    ${theme === "dark"
      ? "text-white"
      : "bg-gradient-to-r from-slate-700 to-slate-900 text-transparent bg-clip-text"
    }
  `}
>
  Welcome {username}
</h2>



      {/* GLASSMORPHIC STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Card 1 */}
        <div className="
          glass-card p-8 rounded-2xl shadow-xl text-white 
          bg-blue-500/70 hover:scale-105 transition-all flex flex-col items-center">
          
          <FaUserPlus size={40} className="drop-shadow-md" />
          <p className="mt-3 text-lg opacity-90">Visitors Today</p>
          <h3 className="text-5xl font-extrabold mt-1 drop-shadow">
            {stats.totalVisitorsToday}
          </h3>
        </div>

        {/* Card 2 */}
        <div className="
          glass-card p-8 rounded-2xl shadow-xl text-white 
          bg-green-500/70 hover:scale-105 transition-all flex flex-col items-center">

          <FaUsers size={40} className="drop-shadow-md" />
          <p className="mt-3 text-lg opacity-90">Active Visitors</p>
          <h3 className="text-5xl font-extrabold mt-1 drop-shadow">
            {stats.activeVisitors}
          </h3>
        </div>

        {/* Card 3 */}
        <div className="
          glass-card p-8 rounded-2xl shadow-xl text-white 
          bg-yellow-400/70 hover:scale-105 transition-all flex flex-col items-center">

          <FaDoorOpen size={40} className="drop-shadow-md" />
          <p className="mt-3 text-lg opacity-90">Exited Visitors</p>
          <h3 className="text-5xl font-extrabold mt-1 drop-shadow">
            {stats.exitedVisitors}
          </h3>
        </div>
      </div>

      {/* HOURLY VISITORS CHART */}
      <HourlyVisitorsChart />
    </div>
  );
}



