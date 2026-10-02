const API_BASE_URL = "http://localhost:5002";

// LOGIN
const loginUser = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    credentials: "include",

    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  return data;
};


// GET CURRENT USER
const getCurrentUser = async () => {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    throw new Error("No access token found");
  }

  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    method: "GET",

    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },

    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to get current user");
  }

  return data;
};

// LOGOUT
const logoutUser = async () => {
  const accessToken = localStorage.getItem("accessToken");

  try {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",

      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },

      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Logout failed");
    }

    return data;
  } finally {
    // Always remove frontend authentication data
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
  }
};


export {
  loginUser,
  getCurrentUser,
  logoutUser,
};

export default loginUser;