import api from "./axios";

// ⭐ EXISTING FEATURES
export const getTodayStats = () => {
  return api.get("/visitors/stats/today");
};

export const addVisitor = (data) => {
  return api.post("/visitors", data);
};

// ⭐ BASIC SEARCH (name, email, phone)
export const searchVisitors = (keyword, page = 0, size = 10) => {
  return api.get("/visitors/search", {
    params: { keyword, page, size },
  });
};

// ⭐ EXIT VISITOR
export const exitVisitor = (visitorId) => {
  return api.post("/visitors/exit", { visitorId });
};

// ⭐ FILTER — TODAY VISITORS
export const filterTodayVisitors = (page = 0, size = 10) => {
  return api.get("/visitors/filter/today", {
    params: { page, size },
  });
};

// ⭐ FILTER — BY DATE RANGE
export const filterVisitorsByDate = (from, to, page = 0, size = 10) => {
  return api.get("/visitors/filter/date", {
    params: { from, to, page, size },
  });
};

// ⭐ FILTER — BY STATUS
export const filterVisitorsByStatus = (status, page = 0, size = 10) => {
  return api.get("/visitors/filter/status", {
    params: { value: status, page, size },
  });
};

// ⭐ ADVANCED SEARCH — MULTIPLE FILTERS + PAGINATION
export const advancedSearchVisitors = (params) => {
  return api.get("/visitors/advanced-search", { params });
};

export const scanVisitorQR = (data) => {
  return api.get("/visitors/scan", {
    params: { data },
  });
};

export const getTodayHourlyStats = () =>
  api.get("/visitors/stats/today-hourly");

export const getHourlyStatsByRange = (range) =>
  api.get("/visitors/stats/hourly", { params: { range } });


export const exportVisitorsCSV = (params) => {
  return api.get("/visitors/export/csv", {
    params,
    responseType: "blob",
  });
};

export const exportVisitorsExcel = (params) => {
  return api.get("/visitors/export/excel", {
    params,
    responseType: "blob",
  });
};





