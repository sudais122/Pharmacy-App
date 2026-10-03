import React, { useState } from "react";

const SaleTable = ({ sales = [], onNewSale }) => {
  const [selectedSale, setSelectedSale] = useState(null);

  // =========================
  // FORMAT DATE
  // =========================

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =========================
  // FORMAT FULL DATE
  // =========================

  const formatFullDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  // =========================
  // PAYMENT METHOD
  // =========================

  const formatPaymentMethod = (paymentMethod) => {
    if (!paymentMethod) return "-";

    const paymentMethods = {
      cash: "Cash",
      easypaisa: "Easypaisa",
      jazzcash: "JazzCash",
      banktransfer: "Bank Transfer",
      other: "Other",
    };

    return (
      paymentMethods[paymentMethod] ||
      paymentMethod.charAt(0).toUpperCase() +
        paymentMethod.slice(1)
    );
  };

  // =========================
  // INVOICE DETAIL VIEW
  // =========================

  if (selectedSale) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white">

        {/* =========================
            INVOICE HEADER
        ========================= */}

        <div className="border-b border-gray-200 p-6">
          <div className="flex items-start justify-between">

            <div>
              <h2 className="text-xl font-bold text-gray-900">
                My Pharmacy
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Invoice
              </p>
            </div>

            <div className="text-right">
              <p className="text-lg font-bold text-gray-900">
                {selectedSale.invoiceNumber || "-"}
              </p>

              <p className="mt-1 text-sm text-gray-500">
                {formatFullDate(selectedSale.date)}
              </p>
            </div>

          </div>
        </div>

        {/* =========================
            CUSTOMER DETAILS
        ========================= */}

        <div className="grid grid-cols-2 gap-4 border-b border-gray-200 p-6 sm:grid-cols-4">

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Customer
            </p>

            <p className="mt-1 text-sm font-medium text-gray-900">
              {selectedSale.name || "-"}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Hostel
            </p>

            <p className="mt-1 text-sm font-medium text-gray-900">
              {selectedSale.hostelNumber
                ? `Hostel ${selectedSale.hostelNumber}`
                : "-"}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Room
            </p>

            <p className="mt-1 text-sm font-medium text-gray-900">
              {selectedSale.roomNumber || "-"}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Payment
            </p>

            <p className="mt-1 text-sm font-medium text-gray-900">
              {formatPaymentMethod(
                selectedSale.paymentMethod
              )}
            </p>
          </div>

        </div>

        {/* =========================
            MEDICINES TABLE
        ========================= */}

        <div className="p-6">

          <div className="overflow-x-auto">
            <table className="w-full">

              <thead>
                <tr className="border-b border-gray-200">

                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Medicine
                  </th>

                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                    Qty
                  </th>

                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                    Purchase Price
                  </th>

                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                    Selling Price
                  </th>

                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                    Profit
                  </th>

                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                    Total
                  </th>

                </tr>
              </thead>

              <tbody>
                {(selectedSale.items || []).map(
                  (item, index) => {

                    const purchasePrice = Number(
                      item.purchasePrice || 0
                    );

                    const sellingPrice = Number(
                      item.sellingPrice || 0
                    );

                    const quantity = Number(
                      item.quantity || 0
                    );

                    const profit =
                      (sellingPrice - purchasePrice) *
                      quantity;

                    return (
                      <tr
                        key={
                          item._id ||
                          item.medicineId ||
                          index
                        }
                        className="border-b border-gray-100"
                      >

                        {/* Medicine */}

                        <td className="px-4 py-4 text-sm font-medium text-gray-900">
                          {item.medicineName || "-"}
                        </td>

                        {/* Quantity */}

                        <td className="px-4 py-4 text-right text-sm text-gray-700">
                          {quantity}
                        </td>

                        {/* Purchase Price */}

                        <td className="px-4 py-4 text-right text-sm text-gray-700">
                          Rs.{" "}
                          {purchasePrice.toFixed(0)}
                        </td>

                        {/* Selling Price */}

                        <td className="px-4 py-4 text-right text-sm text-gray-700">
                          Rs.{" "}
                          {sellingPrice.toFixed(0)}
                        </td>

                        {/* Profit */}

                        <td className="px-4 py-4 text-right text-sm font-medium">
                          Rs.{" "}
                          {profit.toFixed(0)}
                        </td>

                        {/* Total */}

                        <td className="px-4 py-4 text-right text-sm font-semibold text-gray-900">
                          Rs.{" "}
                          {Number(
                            item.total || 0
                          ).toFixed(0)}
                        </td>

                      </tr>
                    );
                  }
                )}
              </tbody>

            </table>
          </div>

          {/* =========================
              INVOICE SUMMARY
          ========================= */}

          <div className="mt-6 flex justify-end">

            <div className="w-full max-w-sm space-y-3">

              {/* Subtotal */}

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">
                  Subtotal
                </span>

                <span className="font-medium text-gray-900">
                  Rs.{" "}
                  {Number(
                    selectedSale.subtotal || 0
                  ).toFixed(0)}
                </span>
              </div>

              {/* Discount */}

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">
                  Discount
                </span>

                <span className="font-medium text-gray-900">
                  Rs.{" "}
                  {Number(
                    selectedSale.discount || 0
                  ).toFixed(0)}
                </span>
              </div>

              {/* Total */}

              <div className="border-t border-gray-200 pt-3">

                <div className="flex items-center justify-between">

                  <span className="text-base font-semibold text-gray-900">
                    Total
                  </span>

                  <span className="text-lg font-bold text-gray-900">
                    Rs.{" "}
                    {Number(
                      selectedSale.total || 0
                    ).toFixed(0)}
                  </span>

                </div>

              </div>

              {/* Payment */}

              <div className="flex items-center justify-between pt-2">

                <span className="text-sm text-gray-500">
                  Payment
                </span>

                <span className="text-sm font-semibold text-gray-900">
                  {formatPaymentMethod(
                    selectedSale.paymentMethod
                  )}
                </span>

              </div>

            </div>

          </div>

        </div>

        {/* =========================
            ACTIONS
        ========================= */}

        <div className="flex flex-col-reverse gap-3 border-t border-gray-200 p-6 sm:flex-row sm:justify-end">

          <button
            type="button"
            onClick={() => setSelectedSale(null)}
            className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 cursor-pointer"
          >
            Back
          </button>

          <button
            type="button"
            onClick={onNewSale}
            className="rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-700 cursor-pointer"
          >
            New Sale
          </button>

        </div>

      </div>
    );
  }

  // =========================
  // SALES TABLE
  // =========================

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Invoice
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Customer
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Date
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Hostel
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Room
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Payment
              </th>

              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                Total
              </th>

            </tr>
          </thead>

          <tbody>

            {sales.length === 0 ? (

              <tr>
                <td
                  colSpan="7"
                  className="px-6 py-12 text-center"
                >
                  <p className="text-sm text-gray-500">
                    No sales found.
                  </p>
                </td>
              </tr>

            ) : (

              sales.map((sale) => (

                <tr
                  key={sale._id}
                  onClick={() =>
                    setSelectedSale(sale)
                  }
                  className="cursor-pointer border-b border-gray-100 transition-colors hover:bg-gray-50"
                >

                  {/* Invoice */}

                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-gray-900">
                      {sale.invoiceNumber || "-"}
                    </span>
                  </td>

                  {/* Customer */}

                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-900">
                      {sale.name || "-"}
                    </span>
                  </td>

                  {/* Date */}

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {formatDate(sale.date)}
                  </td>

                  {/* Hostel */}

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {sale.hostelNumber
                      ? `Hostel ${sale.hostelNumber}`
                      : "-"}
                  </td>

                  {/* Room */}

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {sale.roomNumber || "-"}
                  </td>

                  {/* Payment */}

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {formatPaymentMethod(
                      sale.paymentMethod
                    )}
                  </td>

                  {/* Total */}

                  <td className="px-6 py-4 text-right">
                    <span className="text-sm font-semibold text-gray-900">
                      Rs.{" "}
                      {Number(
                        sale.total || 0
                      ).toFixed(0)}
                    </span>
                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default SaleTable;