const API_BASE_URL = "http://localhost:5002";

const getAuthHeaders = () => {
  const accessToken = localStorage.getItem("accessToken");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  };
};

// Build query string (skips empty values)
const buildQuery = (params = {}) => {
  const cleanParams = {};

  Object.keys(params).forEach((key) => {
    if (
      params[key] !== undefined &&
      params[key] !== null &&
      params[key] !== ""
    ) {
      cleanParams[key] = params[key];
    }
  });

  const query = new URLSearchParams(cleanParams).toString();

  return query ? `?${query}` : "";
};

// Get report summary
export const getReportSummary = async (params = {}) => {
  const response = await fetch(
    `${API_BASE_URL}/reports/summary${buildQuery(params)}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
      credentials: "include",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch report summary");
  }

  return data;
};

// Get sales trend
export const getSalesTrend = async (params = {}) => {
  const response = await fetch(
    `${API_BASE_URL}/reports/sales-trend${buildQuery(params)}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
      credentials: "include",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch sales trend");
  }

  return data;
};

// Get top selling medicines
export const getTopMedicines = async (params = {}) => {
  const response = await fetch(
    `${API_BASE_URL}/reports/top-medicines${buildQuery(params)}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
      credentials: "include",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch top medicines");
  }

  return data;
};

// Get sales report
export const getSalesReport = async (params = {}) => {
  const response = await fetch(
    `${API_BASE_URL}/reports/sales${buildQuery(params)}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
      credentials: "include",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch sales report");
  }

  return data;
};

// Get medicine sales report
export const getMedicineSalesReport = async (params = {}) => {
  const response = await fetch(
    `${API_BASE_URL}/reports/medicine-sales${buildQuery(params)}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
      credentials: "include",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch medicine sales report");
  }

  return data;
};

// Get stock report
export const getStockReport = async (params = {}) => {
  const response = await fetch(
    `${API_BASE_URL}/reports/stock${buildQuery(params)}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
      credentials: "include",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch stock report");
  }

  return data;
};

// Get hostel sales report
export const getHostelSalesReport = async (params = {}) => {
  const response = await fetch(
    `${API_BASE_URL}/reports/hostel-sales${buildQuery(params)}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
      credentials: "include",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch hostel sales report");
  }

  return data;
};

// Get payment report
export const getPaymentReport = async (params = {}) => {
  const response = await fetch(
    `${API_BASE_URL}/reports/payment${buildQuery(params)}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
      credentials: "include",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch payment report");
  }

  return data;
};