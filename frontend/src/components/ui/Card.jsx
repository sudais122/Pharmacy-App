import React, { useEffect, useState, useCallback } from "react";
import { DollarSign, ShoppingCart, TrendingUp, Pill } from "lucide-react";

import { Reportheader } from "../../components/reports/Reportheader";
import Card from "../../components/ui/Card";

import { getReportSummary } from "../../api/Reports";

const DEFAULT_SUMMARY = {
  totalSales: 0,
  totalOrders: 0,
  totalProfit: 0,
  medicinesSold: 0,
  paymentBreakdown: {
    cash: 0,
    easypaisa: 0,
    jazzcash: 0,
    bankTransfer: 0,
    other: 0,
  },
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

  const loadSummary = useCallback(
    async (isCancelled) => {
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

        if (isCancelled()) return;

        if (response?.success) {
          setSummary({
            ...DEFAULT_SUMMARY,
            ...(response.data || {}),
            paymentBreakdown: {
              ...DEFAULT_SUMMARY.paymentBreakdown,
              ...(response.data?.paymentBreakdown || {}),
            },
          });
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
    },
    [period, fromDate, toDate]
  );

  useEffect(() => {
    let cancelled = false;
    loadSummary(() => cancelled);
    return () => {
      cancelled = true;
    };
  }, [loadSummary]);

  const cards = [
    {
      title: "Total Sales",
      value: formatCurrency(summary.totalSales),
      icon: DollarSign,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Total Orders",
      value: summary.totalOrders,
      icon: ShoppingCart,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Total Profit",
      value: formatCurrency(summary.totalProfit),
      icon: TrendingUp,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      title: "Medicines Sold",
      value: summary.medicinesSold,
      icon: Pill,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
  ];

  const paymentLabels = {
    cash: "Cash",
    easypaisa: "Easypaisa",
    jazzcash: "JazzCash",
    bankTransfer: "Bank Transfer",
    other: "Other",
  };

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

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Card
            key={card.title}
            title={card.title}
            value={loading ? "..." : card.value}
            icon={card.icon}
            iconBg={card.iconBg}
            iconColor={card.iconColor}
          />
        ))}
      </div>

      {/* Payment breakdown */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {Object.entries(summary.paymentBreakdown).map(([method, amount]) => (
          <Card
            key={method}
            title={paymentLabels[method] || method}
            value={loading ? "..." : formatCurrency(amount)}
          />
        ))}
      </div>
    </div>
  );
};

export default Reports;