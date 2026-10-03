import React from "react";
import { Pill, TrendingUp } from "lucide-react";

const TopMedicines = () => {
  // Dummy data for UI
  // Later this will come from getTopMedicines()

  const medicines = [
    {
      id: 1,
      name: "Panadol 500mg",
      quantitySold: 85,
      revenue: 2550,
      profit: 850,
    },
    {
      id: 2,
      name: "Augmentin 625mg",
      quantitySold: 62,
      revenue: 6200,
      profit: 1240,
    },
    {
      id: 3,
      name: "Brufen 400mg",
      quantitySold: 54,
      revenue: 2160,
      profit: 720,
    },
    {
      id: 4,
      name: "Disprin",
      quantitySold: 48,
      revenue: 960,
      profit: 320,
    },
    {
      id: 5,
      name: "Cetrizine 10mg",
      quantitySold: 41,
      revenue: 1230,
      profit: 410,
    },
  ];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Top Selling Medicines
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Best performing medicines by quantity sold.
          </p>
        </div>

        <div className="rounded-lg bg-green-100 p-2">
          <TrendingUp className="h-5 w-5 text-green-600" />
        </div>
      </div>

      {/* Table */}
      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[650px]">
          <thead>
            <tr className="border-b border-gray-200 text-left">
              <th className="pb-3 text-xs font-medium uppercase tracking-wide text-gray-500">
                Medicine
              </th>

              <th className="pb-3 text-right text-xs font-medium uppercase tracking-wide text-gray-500">
                Quantity Sold
              </th>

              <th className="pb-3 text-right text-xs font-medium uppercase tracking-wide text-gray-500">
                Revenue
              </th>

              <th className="pb-3 text-right text-xs font-medium uppercase tracking-wide text-gray-500">
                Profit
              </th>
            </tr>
          </thead>

          <tbody>
            {medicines.map((medicine, index) => (
              <tr
                key={medicine.id}
                className="border-b border-gray-100 last:border-0"
              >
                {/* Medicine */}
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-100">
                      <Pill className="h-4 w-4 text-green-600" />
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {medicine.name}
                      </p>

                      <p className="text-xs text-gray-500">
                        #{index + 1} best seller
                      </p>
                    </div>
                  </div>
                </td>

                {/* Quantity */}
                <td className="py-4 text-right">
                  <span className="text-sm font-semibold text-gray-900">
                    {medicine.quantitySold}
                  </span>
                </td>

                {/* Revenue */}
                <td className="py-4 text-right">
                  <span className="text-sm font-medium text-gray-900">
                    PKR {medicine.revenue.toLocaleString()}
                  </span>
                </td>

                {/* Profit */}
                <td className="py-4 text-right">
                  <span className="text-sm font-semibold text-green-600">
                    PKR {medicine.profit.toLocaleString()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="mt-4 border-t border-gray-100 pt-4">
        <p className="text-xs text-gray-500">
          Showing top {medicines.length} selling medicines
        </p>
      </div>
    </div>
  );
};

export default TopMedicines;