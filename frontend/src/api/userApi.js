import api from "./axios";

// 👤 Get logged-in user profile
export const getMyProfile = () => {
  return api.get("/users/me");
};

// ✏️ Update profile
export const updateProfile = (data) => {
  return api.put("/users/me", data);
};

// 🔑 Change password
export const changePassword = (data) => {
  return api.put("/users/change-password", data);
};
