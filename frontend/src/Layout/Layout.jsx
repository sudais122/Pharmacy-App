import React from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/global/Sidebar";
import Header from "../components/global/Header";

function DashboardLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Area */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header */}
        <Header />

        {/* Scrollable Content */}
        <main className="min-h-0 flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;