import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/global/Sidebar";
import Header from "../components/global/Header";

function DashboardLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        <Header />

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;