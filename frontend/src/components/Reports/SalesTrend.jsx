import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const SalesTrend = () => {
  // Dummy data for UI development
  const salesData = [
    { date: "Sep 28", sales: 1800 },
    { date: "Sep 29", sales: 2400 },
    { date: "Sep 30", sales: 2100 },
    { date: "Oct 01", sales: 3200 },
    { date: "Oct 02", sales: 2800 },
    { date: "Oct 03", sales: 3900 },
    { date: "Oct 04", sales: 4100 },
  ];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Sales Trend
          </h2>

          <p className="text-sm text-gray-500">
            Track your sales performance over time.
          </p>
        </div>

        <div className="rounded-lg bg-green-50 px-3 py-2">
          <span className="text-sm font-medium text-green-600">
            Last 7 days
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="mt-6 h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={salesData}
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 10,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e5e7eb"
            />

            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#6b7280",
                fontSize: 12,
              }}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#6b7280",
                fontSize: 12,
              }}
              tickFormatter={(value) =>
                `PKR ${value.toLocaleString()}`
              }
            />

            <Tooltip
              formatter={(value) => [
                `PKR ${Number(value).toLocaleString()}`,
                "Sales",
              ]}
              contentStyle={{
                borderRadius: "10px",
                border: "1px solid #e5e7eb",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              }}
            />

            <Line
              type="monotone"
              dataKey="sales"
              stroke="#16a34a"
              strokeWidth={3}
              dot={{
                r: 4,
                fill: "#16a34a",
                strokeWidth: 2,
                stroke: "#ffffff",
              }}
              activeDot={{
                r: 6,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
        <div>
          <p className="text-xs text-gray-500">Total sales</p>
          <p className="mt-1 text-base font-semibold text-gray-900">
            PKR 20,300
          </p>
        </div>

        <div className="text-right">
          <p className="text-xs text-gray-500">Average daily sales</p>
          <p className="mt-1 text-base font-semibold text-gray-900">
            PKR 2,900
          </p>
        </div>
      </div>
    </div>
  );
};

export default SalesTrend;