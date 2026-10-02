const API_BASE_URL = "http://localhost:5002";

const getDashboard = async () => {
  const accessToken = localStorage.getItem("accessToken");

  const response = await fetch(`${API_BASE_URL}/dashboard`, {
    method: "GET",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },

    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to load dashboard");
  }

  return data;
};

export default getDashboard;