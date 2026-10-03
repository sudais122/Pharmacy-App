const API_URL = "http://localhost:5002/reports";

// Helper function
const fetchApi = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

// Report Summary
export const getReportSummary = async (params = {}) => {
  const query = new URLSearchParams(params).toString();

  return fetchApi(`/summary${query ? `?${query}` : ""}`);
};

// Sales Trend
export const getSalesTrend = async (params = {}) => {
  const query = new URLSearchParams(params).toString();

  return fetchApi(`/sales-trend${query ? `?${query}` : ""}`);
};

// Top Selling Medicines
export const getTopMedicines = async (params = {}) => {
  const query = new URLSearchParams(params).toString();

  return fetchApi(`/top-medicines${query ? `?${query}` : ""}`);
};

// Sales Report
export const getSalesReport = async (params = {}) => {
  const query = new URLSearchParams(params).toString();

  return fetchApi(`/sales${query ? `?${query}` : ""}`);
};

// Medicine Sales Report
export const getMedicineSalesReport = async (params = {}) => {
  const query = new URLSearchParams(params).toString();

  return fetchApi(`/medicine-sales${query ? `?${query}` : ""}`);
};

// Stock Report
export const getStockReport = async (params = {}) => {
  const query = new URLSearchParams(params).toString();

  return fetchApi(`/stock${query ? `?${query}` : ""}`);
};

// Hostel Sales Report
export const getHostelSalesReport = async (params = {}) => {
  const query = new URLSearchParams(params).toString();

  return fetchApi(`/hostel-sales${query ? `?${query}` : ""}`);
};

// Payment Report
export const getPaymentReport = async (params = {}) => {
  const query = new URLSearchParams(params).toString();

  return fetchApi(`/payment${query ? `?${query}` : ""}`);
};
