import React from "react";
import {
  DollarSign,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";

import Card from "../ui/Card";

const DashboardOverview = ({ overall }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card
        title="Total Money"
        value={`Rs. ${Number(
          overall?.totalRevenue || 0
        ).toLocaleString()}`}
        icon={DollarSign}
      />

      <Card
        title="Total Profit"
        value={`Rs. ${Math.max(
          0,
          Number(overall?.totalProfit || 0)
        ).toLocaleString()}`}
        icon={TrendingUp}
      />

      <Card
        title="Total Low Stock"
        value={overall?.totalLowStockMedicines || 0}
        icon={AlertTriangle}
        iconBg="bg-red-100"
        iconColor="text-red-600"
      />
    </div>
  );
};

export default DashboardOverview;