import React, { useEffect, useState, useCallback } from "react";

import { Reportheader } from "../../components/Reports/ReportHeader";
import Card from "../../components/ui/Card";

import { getReportSummary } from "../../api/reports";

const DEFAULT_SUMMARY = {
  totalSales: 0,
  totalOrders: 0,
  totalProfit: 0,
  medicinesSold: 0,
};

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

const Reports = () => {
  const [period, setPeriod] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [summary, setSummary] = useState(DEFAULT_SUMMARY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadSummary = useCallback(async (isCancelled) => {
    // Validate date range before calling the API
    if (fromDate && toDate && fromDate > toDate) {
      setError("'From' date cannot be later than 'To' date");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const params = {};
      if (period && period !== "all") params.period = period;
      if (fromDate) params.fromDate = fromDate;
      if (toDate) params.toDate = toDate;

      const response = await getReportSummary(params);

      console.log(response);
      if (isCancelled()) return; // ignore outdated responses

      if (response?.success) {
        // Merge with defaults so missing fields never break the UI
        setSummary({ ...DEFAULT_SUMMARY, ...(response.data || {}) });
      } else {
        setSummary(DEFAULT_SUMMARY);
        setError(response?.message || "Failed to load report summary");
      }
    } catch (err) {
      if (isCancelled()) return;
      console.error("Failed to load report summary:", err);
      setSummary(DEFAULT_SUMMARY);
      setError(err.message || "Failed to load report summary");
    } finally {
      if (!isCancelled()) setLoading(false);
    }
  }, [period, fromDate, toDate]);

  useEffect(() => {
    let cancelled = false;
    loadSummary(() => cancelled);
    return () => {
      cancelled = true;
    };
  }, [loadSummary]);

  const cards = [
    {
      label: "Total Sales",
      value: formatCurrency(summary.totalSales),
      icon: "💰",
      color: "bg-green-100",
    },
    {
      label: "Total Orders",
      value: summary.totalOrders,
      icon: "🛒",
      color: "bg-blue-100",
    },
    {
      label: "Total Profit",
      value: formatCurrency(summary.totalProfit),
      icon: "📈",
      color: "bg-purple-100",
    },
    {
      label: "Medicines Sold",
      value: summary.medicinesSold,
      icon: "💊",
      color: "bg-orange-100",
    },
  ];

  return (
    <div className="space-y-6">
      <Reportheader
        period={period}
        fromDate={fromDate}
        toDate={toDate}
        onPeriodChange={setPeriod}
        onFromDateChange={setFromDate}
        onToDateChange={setToDate}
      />

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.label}>
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {card.label}
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-gray-900">
                    {loading ? "..." : card.value}
                  </h2>
                </div>
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-lg text-xl ${card.color}`}
                >
                  {card.icon}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Reports;
