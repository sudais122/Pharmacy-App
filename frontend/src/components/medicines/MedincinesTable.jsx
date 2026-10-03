import React, { useState } from "react";

import { Edit, Trash2 } from "lucide-react";

const MedicineTable = ({
  medicines = [],
  onEdit,
  onDelete,
}) => {
  const [selectedMedicine, setSelectedMedicine] = useState(null);

  const handleView = (medicine) => {
    setSelectedMedicine(
      selectedMedicine?._id === medicine._id
        ? null
        : medicine
    );
  };

  return (
    <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white">
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
                          className="inline-flex cursor-pointer items-center gap-1.5 font-medium text-blue-600 hover:text-blue-700"
                        >
                          <Edit className="h-4 w-4" />
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => onDelete?.(medicine)}
                          className="inline-flex cursor-pointer items-center gap-1.5 font-medium text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>

                        <button
                          type="button"
                          onClick={() => handleView(medicine)}
                          className="cursor-pointer font-medium text-green-600 hover:text-green-700"
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
                              {medicine.manufacturer}
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
    </div>
  );
};

export default MedicineTable;