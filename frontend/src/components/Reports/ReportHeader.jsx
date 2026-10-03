import React from "react";
import PageHeader from "../ui/PageHeaer";

const Reportheader = ({
  period,
  fromDate,
  toDate,
  onPeriodChange,
  onFromDateChange,
  onToDateChange,
}) => {
  return (
    <div className="flex flex-col gap-4 rounded-xl xl:flex-row xl:items-end xl:justify-between">
      {/* Page Header */}
      <div className="pt-2">
        <PageHeader
          title="Reports"
          description="View sales, profit, stock, and payment reports."
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        {/* Period */}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">
            Period
          </label>

          <select
            value={period}
            onChange={(e) => onPeriodChange(e.target.value)}
            className="h-10 min-w-[140px] rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
          >
            <option value="7days">Today</option>
            <option value="7days">Last 7 days</option>
            <option value="28days">Last 28 days</option>
            <option value="all">All time</option>
          </select>
        </div>

        {/* Start Date */}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">
            Start date
          </label>

          <input
            type="date"
            value={fromDate}
            onChange={(e) => onFromDateChange(e.target.value)}
            className="h-10 rounded-lg border border-gray-300 px-3 text-sm text-gray-700 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
          />
        </div>

        {/* End Date */}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">
            End date
          </label>

          <input
            type="date"
            value={toDate}
            min={fromDate || undefined}
            onChange={(e) => onToDateChange(e.target.value)}
            className="h-10 rounded-lg border border-gray-300 px-3 text-sm text-gray-700 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
          />
        </div>
      </div>
    </div>
  );
};

export default Reportheader;
