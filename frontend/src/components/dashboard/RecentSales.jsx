
import React from "react";

import { useNavigate } from "react-router-dom";

import { ArrowRight } from "lucide-react";

import PageHeader from "../ui/PageHeaer";

const RecentSales = ({ sales = [] }) => {
  const navigate = useNavigate();

  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 px-5 py-2">
        <PageHeader
          title="Recent Sales"
          description="Latest sales transactions from today"
          titleClassName="text-lg"
          descriptionClassName="text-xs"
        />

        <button
          type="button"
          onClick={() => navigate("/sales")}
          className="flex cursor-pointer items-center gap-2 text-sm font-medium text-green-600 hover:text-green-700"
        >
          View All
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-6 py-3 text-left font-semibold text-gray-600">
                Invoice
              </th>

              <th className="px-6 py-3 text-left font-semibold text-gray-600">
                Date
              </th>

              <th className="px-6 py-3 text-left font-semibold text-gray-600">
                Time
              </th>

              <th className="px-6 py-3 text-right font-semibold text-gray-600">
                Total
              </th>

              <th className="px-6 py-3 text-center font-semibold text-gray-600">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {sales.map((sale) => (
              <tr
                key={sale.invoiceNumber}
                className="border-b border-gray-100 transition-colors last:border-0 hover:bg-gray-50"
              >
                <td className="px-6 py-4">
                  <span className="font-semibold text-gray-900">
                    {sale.invoiceNumber}
                  </span>
                </td>

                <td className="px-6 py-4 text-gray-500">
                  {sale.date
                    ? new Date(sale.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "-"}
                </td>

                <td className="px-6 py-4 text-gray-500">
                  {sale.time || "-"}
                </td>

                <td className="px-6 py-4 text-right font-semibold text-gray-900">
                  Rs. {Number(sale.total || 0).toLocaleString()}
                </td>

                <td className="px-6 py-4 text-center">
                  <button
                    type="button"
                    onClick={() =>
                      navigate(`/sales/${sale.invoiceNumber}`)
                    }
                    className="cursor-pointer text-sm font-medium text-green-600 hover:text-green-700"
                  >
                    View Invoice
                  </button>
                </td>
              </tr>
            ))}

            {sales.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-8 text-center text-gray-500"
                >
                  No sales today
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentSales;
