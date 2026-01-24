import api from "./axios"; // use interceptor axios

export const searchStaff = (query, page = 0, size = 5) => {
  if (!query) return Promise.resolve({ data: { content: [] } });

  return api.get(`/staff/search?q=${query}&page=${page}&size=${size}`);
};

