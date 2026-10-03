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
export const getSales = async ({
  page = 1,
  limit = 10,
  search = "",
  hostelNumber = "",
  roomNumber = "",
  period = "",
  startDate = "",
  endDate = "",
} = {}) => {
  const token = getAccessToken();

  const params = new URLSearchParams();

  params.append("page", page);
  params.append("limit", limit);

  if (search.trim()) {
    params.append("search", search.trim());
  }

  if (hostelNumber !== "") {
    params.append("hostelNumber", hostelNumber);
  }

  if (roomNumber.trim()) {
    params.append("roomNumber", roomNumber.trim());
  }

  if (period) {
    params.append("period", period);
  }

  if (startDate) {
    params.append("startDate", startDate);
  }

  if (endDate) {
    params.append("endDate", endDate);
  }

  const response = await fetch(
    `${API_URL}/getallsales?${params.toString()}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    }
  );

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