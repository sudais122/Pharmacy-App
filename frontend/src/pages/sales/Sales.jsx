
import React, { useEffect, useState } from "react";

import PageHeader from "../../components/ui/PageHeaer";
import AddSale from "../../components/sales/AddSales";
import SaleTable from "../../components/sales/SalesTable";

import { getSales } from "../../api/sales";

const Sales = () => {
  const [sales, setSales] = useState([]);

  const [hostel, setHostel] = useState("all");
  const [period, setPeriod] = useState("all");
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showAddSale, setShowAddSale] = useState(false);

  const fetchSales = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getSales({
        page,
        limit,
        search: search.trim(),
        hostelNumber: hostel === "all" ? "" : hostel,
        period: period === "all" ? "" : period,
      });

      console.log("Sales API response:", response);

      setSales(
        Array.isArray(response.sales)
          ? response.sales
          : []
      );

      setTotal(Number(response.total) || 0);

      setTotalPages(
        Number(response.totalPages) || 1
      );
    } catch (error) {
      console.error("Fetch sales error:", error);

      setError(
        error.message || "Failed to load sales"
      );

      setSales([]);
      setTotal(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, [page, hostel, period]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  const handleHostelChange = (e) => {
    setHostel(e.target.value);
    setPage(1);
  };

  const handlePeriodChange = (e) => {
    setPeriod(e.target.value);
    setPage(1);
  };

  const handleSaleCreated = () => {
    setShowAddSale(false);
    setPage(1);
    fetchSales();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Sales"
          description="Manage your pharmacy sales and transactions"
        />

        <button
          type="button"
          onClick={() => setShowAddSale(true)}
          className="cursor-pointer rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-700"
        >
          + Add Sale
        </button>
      </div>

      <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="w-full lg:max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customer..."
            className="h-11 w-full rounded-lg border border-gray-200 bg-white px-4 text-sm text-gray-700 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <select
            value={hostel}
            onChange={handleHostelChange}
            className="h-11 min-w-[160px] rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
          >
            <option value="all">All Hostels</option>
            <option value="1">Hostel 1</option>
            <option value="2">Hostel 2</option>
          </select>

          <select
            value={period}
            onChange={handlePeriodChange}
            className="h-11 min-w-[160px] rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="7days">7 Days</option>
            <option value="28days">28 Days</option>
          </select>
        </div>
      </div>

      {!loading && !error && (
        <div className="mt-4">
          <p className="text-sm text-gray-500">
            {total} {total === 1 ? "sale" : "sales"}
          </p>
        </div>
      )}

      {loading && (
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-10 text-center">
          <p className="text-sm text-gray-500">
            Loading sales...
          </p>
        </div>
      )}

      {!loading && error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-5">
          <p className="text-sm text-red-600">
            {error}
          </p>

          <button
            type="button"
            onClick={fetchSales}
            className="mt-3 cursor-pointer rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && (
        <div className="mt-6">
          <SaleTable
            sales={sales}
            onNewSale={() => setShowAddSale(true)}
          />

          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between rounded-xl border border-gray-200 bg-white px-5 py-4">
              <button
                type="button"
                disabled={page === 1}
                onClick={() =>
                  setPage((prev) => prev - 1)
                }
                className="cursor-pointer rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>

              <div className="text-sm text-gray-600">
                Page{" "}
                <span className="font-semibold text-gray-900">
                  {page}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-900">
                  {totalPages}
                </span>
              </div>

              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() =>
                  setPage((prev) => prev + 1)
                }
                className="cursor-pointer rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {showAddSale && (
        <AddSale
          onClose={() => setShowAddSale(false)}
          onCreated={handleSaleCreated}
        />
      )}
    </div>
  );
};

export default Sales;
