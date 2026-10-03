const API_BASE_URL = "http://localhost:5002";

const getAuthHeaders = () => {
  const accessToken = localStorage.getItem("accessToken");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  };
};

// Get all medicines
const API_URL = "http://localhost:5002/medicines";

const getAccessToken = () => {
  return localStorage.getItem("accessToken");
};

export const getMedicines = async () => {
  const token = getAccessToken();

  const response = await fetch(API_URL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch medicines");
  }

  return data;
};

// Get medicine by ID
export const getMedicineById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/medicines/${id}`, {
    method: "GET",
    headers: getAuthHeaders(),
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch medicine");
  }

  return data;
};

// Create medicine
export const createMedicine = async (medicineData) => {
  const response = await fetch(`${API_BASE_URL}/medicines`, {
    method: "POST",
    headers: getAuthHeaders(),
    credentials: "include",
    body: JSON.stringify(medicineData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create medicine");
  }

  return data;
};

// Update medicine
export const updateMedicine = async (id, medicineData) => {
  const response = await fetch(`${API_BASE_URL}/medicines/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    credentials: "include",
    body: JSON.stringify(medicineData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update medicine");
  }

  return data;
};

// Update medicine status
export const updateMedicineStatus = async (id, isActive) => {
  const response = await fetch(
    `${API_BASE_URL}/medicines/${id}/status`,
    {
      method: "PATCH",
      headers: getAuthHeaders(),
      credentials: "include",
      body: JSON.stringify({
        isActive,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update medicine status");
  }

  return data;
};

// Update medicine stock
export const updateMedicineStock = async (id, stock) => {
  const response = await fetch(
    `${API_BASE_URL}/medicines/${id}/stock`,
    {
      method: "PATCH",
      headers: getAuthHeaders(),
      credentials: "include",
      body: JSON.stringify({
        stock,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update medicine stock");
  }

  return data;
};


export const deleteMedicine = async (id) => {
  const accessToken = localStorage.getItem("accessToken");

  const response = await fetch(
    `${API_BASE_URL}/medicines/${id}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: "include",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete medicine");
  }

  return data;
};