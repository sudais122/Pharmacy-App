import React from "react";
import PageHeader from "../ui/PageHeaer";

export const Reportheader = ({
  period = "all",
  fromDate = "",
  toDate = "",
  onPeriodChange,
  onFromDateChange,
  onToDateChange,
}) => {
  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <PageHeader
        title="Reports"
        description="View and analyze your pharmacy sales and inventory reports"
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        {/* Period */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-gray-600">
            Period
          </label>

          <select
            value={period}
            onChange={(e) => onPeriodChange?.(e.target.value)}
            className="h-10 min-w-[150px] rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
          >
            <option value="today">Today</option>
            <option value="7days">7 Days</option>
            <option value="28days">28 Days</option>
            <option value="all">All Time</option>
          </select>
        </div>

        {/* From Date */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-gray-600">
            From
          </label>

          <input
            type="date"
            value={fromDate}
            onChange={(e) => onFromDateChange?.(e.target.value)}
            className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
          />
        </div>

        {/* To Date */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-gray-600">
            To
          </label>

          <input
            type="date"
            value={toDate}
            onChange={(e) => onToDateChange?.(e.target.value)}
            className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
          />
        </div>
      </div>
    </div>
  );
};
