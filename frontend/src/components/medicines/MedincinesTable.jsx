import React, { useState } from "react";
import { Edit, Trash2 } from "lucide-react";

const MedicineTable = ({
  medicines = [],
  pagination,
  onPageChange,
  onEdit,
  onDelete,
}) => {
  const [selectedMedicine, setSelectedMedicine] = useState(null);

  const handleView = (medicine) => {
    setSelectedMedicine(
      selectedMedicine?._id === medicine._id ? null : medicine
    );
  };

  const currentPage = pagination?.currentPage || 1;
  const limit = pagination?.limit || medicines.length;
  const totalMedicines = pagination?.totalMedicines || medicines.length;
  const totalPages = pagination?.totalPages || 1;

  const start =
    totalMedicines === 0
      ? 0
      : (currentPage - 1) * limit + 1;

  const end = Math.min(
    currentPage * limit,
    totalMedicines
  );

  return (
    <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-6 py-3 text-left font-semibold text-gray-600">
                Medicine
              </th>

              <th className="px-6 py-3 text-left font-semibold text-gray-600">
                Generic Name
              </th>

              <th className="px-6 py-3 text-right font-semibold text-gray-600">
                Stock
              </th>

              <th className="px-6 py-3 text-left font-semibold text-gray-600">
                Category
              </th>

              <th className="px-6 py-3 text-center font-semibold text-gray-600">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {medicines.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-10 text-center text-gray-500"
                >
                  No medicines found
                </td>
              </tr>
            )}

            {medicines.map((medicine) => {
              const isSelected =
                selectedMedicine?._id === medicine._id;

              const stock = Number(medicine.stock || 0);

              const minimumStock = Number(
                medicine.minimumStock || 0
              );

              const stockStatus =
                stock === 0
                  ? "Out of Stock"
                  : stock <= minimumStock
                  ? "Low Stock"
                  : "In Stock";

              const stockStatusClass =
                stock === 0
                  ? "bg-red-100 text-red-600"
                  : stock <= minimumStock
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-green-100 text-green-600";

              return (
                <React.Fragment key={medicine._id}>
                  <tr className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      {medicine.name}
                    </td>

                    <td className="px-6 py-4 text-gray-500">
                      {medicine.genericName}
                    </td>

                    <td className="px-6 py-4 text-right font-medium text-gray-900">
                      {stock}
                    </td>

                    <td className="px-6 py-4 text-gray-500">
                      {medicine.category}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          type="button"
                          onClick={() => onEdit?.(medicine)}
                          className="inline-flex items-center gap-1.5 font-medium text-blue-600 hover:text-blue-700"
                        >
                          <Edit className="h-4 w-4" />
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => onDelete?.(medicine)}
                          className="inline-flex items-center gap-1.5 font-medium text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>

                        <button
                          type="button"
                          onClick={() => handleView(medicine)}
                          className="font-medium text-green-600 hover:text-green-700"
                        >
                          {isSelected ? "Hide" : "View"}
                        </button>
                      </div>
                    </td>
                  </tr>

                  {isSelected && (
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <td
                        colSpan="5"
                        className="px-6 py-5"
                      >
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                          <div>
                            <p className="text-xs text-gray-500">
                              Manufacturer
                            </p>
                            <p className="mt-1 font-medium text-gray-900">
                              {medicine.manufacturer || "-"}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-gray-500">
                              Purchase Price
                            </p>
                            <p className="mt-1 font-medium text-gray-900">
                              Rs.{" "}
                              {Number(
                                medicine.purchasePrice || 0
                              ).toLocaleString()}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-gray-500">
                              Selling Price
                            </p>
                            <p className="mt-1 font-medium text-gray-900">
                              Rs.{" "}
                              {Number(
                                medicine.sellingPrice || 0
                              ).toLocaleString()}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-gray-500">
                              Minimum Stock
                            </p>
                            <p className="mt-1 font-medium text-gray-900">
                              {minimumStock}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-gray-500">
                              Stock Status
                            </p>

                            <span
                              className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${stockStatusClass}`}
                            >
                              {stockStatus}
                            </span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col gap-4 border-t border-gray-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Showing X - Y of Z */}
        <p className="text-sm text-gray-500">
          Showing{" "}
          <span className="font-medium text-gray-900">
            {start}
          </span>{" "}
          -{" "}
          <span className="font-medium text-gray-900">
            {end}
          </span>{" "}
          of{" "}
          <span className="font-medium text-gray-900">
            {totalMedicines}
          </span>{" "}
          medicines
        </p>

        {/* Pagination Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={
              currentPage === 1 ||
              !onPageChange
            }
            onClick={() =>
              onPageChange(currentPage - 1)
            }
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>

          {/* Page Numbers */}
          {Array.from(
            { length: totalPages },
            (_, index) => index + 1
          ).map((pageNumber) => (
            <button
              key={pageNumber}
              type="button"
              onClick={() =>
                onPageChange?.(pageNumber)
              }
              className={`h-9 min-w-9 rounded-lg px-3 text-sm font-medium ${
                currentPage === pageNumber
                  ? "bg-green-600 text-white"
                  : "border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {pageNumber}
            </button>
          ))}

          <button
            type="button"
            disabled={
              currentPage === totalPages ||
              !onPageChange
            }
            onClick={() =>
              onPageChange(currentPage + 1)
            }
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default MedicineTable;