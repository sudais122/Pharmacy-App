import React from "react";
import { Building2, TrendingUp } from "lucide-react";

const HostelSales = () => {
  // Dummy data for UI
  // Later this will come from getHostelSalesReport()

  const hostelData = [
    {
      id: 1,
      hostel: "Hostel A",
      orders: 18,
      sales: 4850,
    },
    {
      id: 2,
      hostel: "Hostel B",
      orders: 14,
      sales: 3620,
    },
    {
      id: 3,
      hostel: "Hostel C",
      orders: 11,
      sales: 2940,
    },
    {
      id: 4,
      hostel: "Hostel D",
      orders: 8,
      sales: 1840,
    },
  ];

  const totalSales = hostelData.reduce(
    (sum, hostel) => sum + hostel.sales,
    0
  );

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Hostel Sales
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Sales performance by hostel.
          </p>
        </div>

        <div className="rounded-lg bg-blue-100 p-2">
          <Building2 className="h-5 w-5 text-blue-600" />
        </div>
      </div>

      {/* Total */}
      <div className="mt-5 rounded-lg bg-gray-50 p-4">
        <p className="text-sm text-gray-500">Total Hostel Sales</p>

        <p className="mt-1 text-2xl font-bold text-gray-900">
          PKR {totalSales.toLocaleString()}
        </p>
      </div>

      {/* Hostel List */}
      <div className="mt-5 space-y-4">
        {hostelData.map((hostel) => {
          const percentage =
            totalSales > 0
              ? (hostel.sales / totalSales) * 100
              : 0;

          return (
            <div key={hostel.id}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {hostel.hostel}
                  </p>

                  <p className="text-xs text-gray-500">
                    {hostel.orders} orders
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    PKR {hostel.sales.toLocaleString()}
                  </p>

                  <p className="text-xs text-gray-500">
                    {percentage.toFixed(1)}%
                  </p>
                </div>
              </div>

              {/* Progress */}
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-blue-500"
                  style={{
                    width: `${percentage}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-5 flex items-center gap-2 border-t border-gray-100 pt-4">
        <TrendingUp className="h-4 w-4 text-green-600" />

        <span className="text-xs text-gray-500">
          Sales distribution across hostels
        </span>
      </div>
    </div>
  );
};

export default HostelSales;