import React from "react";

import {
  Banknote,
  ShoppingCart,
  TrendingUp,
  Pill,
} from "lucide-react";

import Reportheader from "../../components/reports/Reportheader";
import SalesTrend from "../../components/Reports/SalesTrend";
import PaymentBreakdown from "../../components/Reports/PaymentBreakdown";
import TopMedicines from "../../components/Reports/TopMedicines";
import HostelSales from "../../components/Reports/HostelSales";
import Card from "../../components/ui/Card";

const Reports = () => {
  // Dummy data for now
  // Later this will come from getReportSummary()
  const reportSummary = {
    totalSales: 13856,
    totalOrders: 5,
    totalProfit: 4180,
    medicinesSold: 41,
  };

  const handleCardClick = (type) => {
    console.log(`Clicked: ${type}`);
  };

  return (
    <div className="space-y-6">
      {/* Header + Filters */}
      <Reportheader />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card
          title="Total Sales"
          value={`PKR ${reportSummary.totalSales.toLocaleString()}`}
          icon={Banknote}
          iconBg="bg-green-100"
          iconColor="text-green-600"
          onClick={() => handleCardClick("Total Sales")}
        />

        <Card
          title="Total Orders"
          value={reportSummary.totalOrders.toLocaleString()}
          icon={ShoppingCart}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
          onClick={() => handleCardClick("Total Orders")}
        />

        <Card
          title="Total Profit"
          value={`PKR ${reportSummary.totalProfit.toLocaleString()}`}
          icon={TrendingUp}
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
          onClick={() => handleCardClick("Total Profit")}
        />

        <Card
          title="Medicines Sold"
          value={reportSummary.medicinesSold.toLocaleString()}
          icon={Pill}
          iconBg="bg-orange-100"
          iconColor="text-orange-600"
          onClick={() => handleCardClick("Medicines Sold")}
        />
      </div>

      {/* Sales Trend + Payment Breakdown */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Sales Trend */}
        <div className="lg:col-span-2">
          <SalesTrend />
        </div>

        {/* Payment Breakdown */}
        <div>
          <PaymentBreakdown />
        </div>
      </div>

      {/* Top Selling Medicines */}
      <div>
        <TopMedicines />
      </div>

      {/* Hostel Sales */}
      <div>
        <HostelSales />
      </div>
    </div>
  );
};

export default Reports;