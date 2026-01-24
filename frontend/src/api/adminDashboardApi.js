// src/api/adminDashboardApi.js
import api from "./axios"; // ✅ configured axios with baseURL + auth

/* ---------------- ADMIN DASHBOARD ---------------- */

export const getAdminDashboardAnalytics = (range) => {
  return api.get("/dashboard/analytics", {
    params: { range },
  });
};

/* ---------------- HOURLY VISITOR STATS ---------------- */

// ✅ Today hourly visitors (used by Security Dashboard chart)
export const getTodayHourlyStats = () => {
  return api.get("/visitors/stats/today-hourly");
};

// ✅ Hourly visitors by range (week / month / year)
export const getHourlyStatsByRange = (range) => {
  return api.get("/visitors/stats/hourly", {
    params: { range },
  });
};
