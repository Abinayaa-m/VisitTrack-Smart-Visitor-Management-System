const TOKEN_KEY = "vms_token";

export const saveToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const getRoleFromToken = () => {
  const token = getToken();
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));

    let authorities = payload.authorities;

    if (typeof authorities === "string") {
      authorities = JSON.parse(authorities);
    }

    if (!authorities || authorities.length === 0) return null;

    return authorities[0]; // ROLE_ADMIN / ROLE_SECURITY / ROLE_STAFF
  } catch {
    return null;
  }
};

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const getUsernameFromToken = () => {
  const token = getToken();
  if (!token) return null;

  const payload = JSON.parse(atob(token.split(".")[1]));
  return payload.sub || payload.username || "User";
};


