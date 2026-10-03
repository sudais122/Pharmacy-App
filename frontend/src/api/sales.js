const API_URL = "http://localhost:5002/sales";

const getAccessToken = () => {
  return localStorage.getItem("accessToken");
};

// Create sale
export const createSale = async (saleData) => {
  const token = getAccessToken();

  const response = await fetch(`${API_URL}/create-sale`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
    body: JSON.stringify(saleData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create sale");
  }

  return data;
};

// Get all sales
export const getSales = async () => {
  const token = getAccessToken();

  const response = await fetch(`${API_URL}/getallsales`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch sales");
  }

  return data;
};

// Get sale by ID
export const getSaleById = async (id) => {
  const token = getAccessToken();

  const response = await fetch(`${API_URL}/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch sale");
  }

  return data;
};