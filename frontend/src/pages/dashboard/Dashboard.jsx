import React, { useEffect, useState } from "react";

import DashboardHeader from "../../components/dashboard/DashboardHeader";
import DashboardOverview from "../../components/dashboard/Dashboardoverview";
import RecentSales from "../../components/dashboard/RecentSales";
import RecentMedicines from "../../components/dashboard/RecentMedicines";

import dashboard from "../../api/dashboard.js";

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await dashboard();

        setDashboardData(response.data);
      } catch (error) {
        console.error("Dashboard fetch error:", error);
        setError(error.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

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
        <DashboardHeader />

        {/* Overview Cards */}
        <DashboardOverview
          overall={dashboardData.overall}
        />

        {/* Recent Sales - Top */}
        <div className="mt-6">
          <RecentSales
            sales={dashboardData.recentSales || []}
          />
        </div>

        {/* Recent Medicines - Bottom */}
        <div className="mt-6">
          <RecentMedicines
            medicines={dashboardData.recentMedicines || []}
          />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;