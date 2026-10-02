import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const RecentMedicines = ({ medicines = [] }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white border border-gray-200 rounded-xl">

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Medicines
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Recently added medicines
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/medicines")}
          className="flex items-center gap-2 text-sm font-medium text-green-600 hover:text-green-700 cursor-pointer"
        >
          View All
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">

          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">

              <th className="px-6 py-3 text-left font-semibold text-gray-600">
                Medicine
              </th>

              <th className="px-6 py-3 text-left font-semibold text-gray-600">
                Category
              </th>

              <th className="px-6 py-3 text-right font-semibold text-gray-600">
                Stock
              </th>

              <th className="px-6 py-3 text-center font-semibold text-gray-600">
                Status
              </th>

            </tr>
          </thead>

          <tbody>
            {medicines.map((medicine) => {
              const isLowStock =
                medicine.stock <= medicine.minimumStock;

              return (
                <tr
                  key={medicine._id}
                  className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
                >

                  <td className="px-6 py-4">
                    <span className="font-semibold text-gray-900">
                      {medicine.name}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-gray-500">
                    {medicine.category}
                  </td>

                  <td className="px-6 py-4 text-right font-medium text-gray-900">
                    {medicine.stock}
                  </td>

                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        isLowStock
                          ? "bg-red-100 text-red-600"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      {isLowStock ? "Low Stock" : "In Stock"}
                    </span>
                  </td>

                </tr>
              );
            })}

            {medicines.length === 0 && (
              <tr>
                <td
                  colSpan="4"
                  className="px-6 py-8 text-center text-gray-500"
                >
                  No medicines found
                </td>
              </tr>
            )}

          </tbody>

        </table>
      </div>
    </div>
  );
};

export default RecentMedicines;