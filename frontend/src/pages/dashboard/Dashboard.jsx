import React, { useCallback, useEffect, useState } from "react";

import DashboardHeader from "../../components/dashboard/DashboardHeader";
import DashboardOverview from "../../components/dashboard/Dashboardoverview";
import RecentSales from "../../components/dashboard/RecentSales";
import RecentMedicines from "../../components/dashboard/RecentMedicines";
import AddMedicine from "../../components/medicines/AddMedicine";
import AddSale from "../../components/sales/AddSales.jsx";

import dashboard from "../../api/dashboard.js";

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddMedicine, setShowAddMedicine] = useState(false);
  const [showAddSale, setShowAddSale] = useState(false);

  const fetchDashboard = useCallback(async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);
      setError("");

      const response = await dashboard();
      setDashboardData(response.data);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError(err.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <p className="text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <p className="text-gray-500">No dashboard data available.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div>
        <DashboardHeader
          onAddMedicine={() => setShowAddMedicine(true)}
          onAddSale={() => setShowAddSale(true)}
        />

        <DashboardOverview overall={dashboardData.overall} />

        <div className="mt-6">
          <RecentSales sales={dashboardData.recentSales || []} />
        </div>

        <div className="mt-6">
          <RecentMedicines medicines={dashboardData.recentMedicines || []} />
        </div>

        {showAddMedicine && (
          <AddMedicine
            onClose={() => setShowAddMedicine(false)}
            onCreated={() => {
              setShowAddMedicine(false);
              fetchDashboard(false);
            }}
          />
        )}

        {showAddSale && (
          <AddSale
            onClose={() => setShowAddSale(false)}
            onCreated={() => {
              setShowAddSale(false);
              fetchDashboard(false);
            }}
          />
        )}
      </div>
    </div>
  );
}

export default Dashboard;