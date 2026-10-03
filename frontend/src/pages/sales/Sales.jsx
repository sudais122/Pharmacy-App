import React, { useEffect, useMemo, useState } from "react";

import PageHeader from "../../components/ui/PageHeaer";
import AddSale from "../../components/sales/AddSales";
import SaleTable from "../../components/sales/SalesTable";

import { getSales } from "../../api/sales";

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [hostel, setHostel] = useState("all");
  const [period, setPeriod] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddSale, setShowAddSale] = useState(false);

  // =========================
  // FETCH SALES
  // =========================

  const fetchSales = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getSales();

      console.log("Sales API response:", response);

      if (Array.isArray(response.sales)) {
        setSales(response.sales);
      } else if (Array.isArray(response.data)) {
        setSales(response.data);
      } else if (Array.isArray(response.data?.sales)) {
        setSales(response.data.sales);
      } else {
        setSales([]);
      }
    } catch (error) {
      console.error("Fetch sales error:", error);

      setError(
        error.message || "Failed to load sales"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOAD SALES
  // =========================

  useEffect(() => {
    fetchSales();
  }, []);

  // =========================
  // FILTER SALES
  // =========================

  const filteredSales = useMemo(() => {
    let result = [...sales];

    // =========================
    // HOSTEL FILTER
    // =========================

    if (hostel !== "all") {
      result = result.filter(
        (sale) =>
          String(sale.hostelNumber) ===
          String(hostel)
      );
    }

    // =========================
    // PERIOD FILTER
    // =========================

    if (period !== "all") {
      const now = new Date();

      const today = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      );

      result = result.filter((sale) => {
        if (!sale.date) {
          return false;
        }

        const saleDate = new Date(sale.date);

        const saleDay = new Date(
          saleDate.getFullYear(),
          saleDate.getMonth(),
          saleDate.getDate()
        );

        // TODAY
        if (period === "today") {
          return (
            saleDay.getTime() ===
            today.getTime()
          );
        }

        // LAST 7 DAYS
        if (period === "7days") {
          const sevenDaysAgo = new Date(today);

          sevenDaysAgo.setDate(
            today.getDate() - 6
          );

          return (
            saleDay >= sevenDaysAgo &&
            saleDay <= today
          );
        }

        // LAST 28 DAYS
        if (period === "28days") {
          const twentyEightDaysAgo =
            new Date(today);

          twentyEightDaysAgo.setDate(
            today.getDate() - 27
          );

          return (
            saleDay >= twentyEightDaysAgo &&
            saleDay <= today
          );
        }

        return true;
      });
    }

    // =========================
    // CUSTOMER NAME SEARCH
    // =========================

    const searchText = search
      .trim()
      .toLowerCase();

    if (searchText !== "") {
      result = result.filter((sale) => {
        const customerName = String(
          sale.name || ""
        )
          .trim()
          .toLowerCase();

        return customerName.includes(searchText);
      });
    }

    return result;
  }, [sales, hostel, period, search]);

  // =========================
  // SALE CREATED
  // =========================

  const handleSaleCreated = () => {
    setShowAddSale(false);

    fetchSales();
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* =========================
          HEADER
      ========================= */}

      <div className="flex items-center justify-between">
        <PageHeader
          title="Sales"
          description="Manage your pharmacy sales and transactions"
        />

        <button
          type="button"
          onClick={() => setShowAddSale(true)}
          className="rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-700 cursor-pointer"
        >
          + Add Sale
        </button>
      </div>

      {/* =========================
          SEARCH + FILTERS
      ========================= */}

      <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        {/* =========================
            SEARCH BAR
        ========================= */}

        <div className="w-full lg:max-w-md">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search customer..."
              className="h-11 w-full rounded-lg border border-gray-200 bg-white px-4 text-sm text-gray-700 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
            />
          </div>
        </div>

        {/* =========================
            FILTERS
        ========================= */}

        <div className="flex flex-col gap-3 sm:flex-row">

          {/* HOSTEL */}

          <select
            value={hostel}
            onChange={(e) =>
              setHostel(e.target.value)
            }
            className="h-11 min-w-[160px] rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
          >
            <option value="all">
              All Hostels
            </option>

            <option value="1">
              Hostel 1
            </option>

            <option value="2">
              Hostel 2
            </option>
          </select>

          {/* PERIOD */}

          <select
            value={period}
            onChange={(e) =>
              setPeriod(e.target.value)
            }
            className="h-11 min-w-[160px] rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
          >
            <option value="today">
              Today
            </option>

            <option value="7days">
              7 Days
            </option>

            <option value="28days">
              28 Days
            </option>

            <option value="all">
              All Time
            </option>
          </select>
        </div>
      </div>

      {/* =========================
          LOADING
      ========================= */}

      {loading && (
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-10 text-center">
          <p className="text-sm text-gray-500">
            Loading sales...
          </p>
        </div>
      )}

      {/* =========================
          ERROR
      ========================= */}

      {!loading && error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-5">

          <p className="text-sm text-red-600">
            {error}
          </p>

          <button
            type="button"
            onClick={fetchSales}
            className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 cursor-pointer"
          >
            Try Again
          </button>

        </div>
      )}

      {/* =========================
          SALES TABLE
      ========================= */}

      {!loading && !error && (
        <div className="mt-6">
          <SaleTable
            sales={filteredSales}
            onNewSale={() =>
              setShowAddSale(true)
            }
          />
        </div>
      )}

      {/* =========================
          ADD SALE
      ========================= */}

      {showAddSale && (
        <AddSale
          onClose={() =>
            setShowAddSale(false)
          }
          onCreated={handleSaleCreated}
        />
      )}

    </div>
  );
};

export default Sales;