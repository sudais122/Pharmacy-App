
import React, { useEffect, useMemo, useState } from "react";
import { X, Search, Plus, Trash2 } from "lucide-react";

import { getMedicines } from "../../api/medicines";
import { createSale } from "../../api/sales";

const inputClass =
  "w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100";

const AddSale = ({ onClose, onCreated }) => {
  const [medicines, setMedicines] = useState([]);
  const [search, setSearch] = useState("");
  const [items, setItems] = useState([]);

  const [name, setName] = useState("");
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [hostelNumber, setHostelNumber] = useState("");
  const [roomNumber, setRoomNumber] = useState("");

  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("cash");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load medicines
  useEffect(() => {
    const loadMedicines = async () => {
      try {
        const response = await getMedicines();

        const list = Array.isArray(response)
          ? response
          : response?.medicines ||
            response?.data?.medicines ||
            response?.data ||
            [];

        setMedicines(Array.isArray(list) ? list : []);
      } catch (err) {
        console.error("Failed to load medicines:", err);
        setError(err.message || "Failed to load medicines");
      }
    };

    loadMedicines();
  }, []);

  // Search medicines
  const filteredMedicines = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    if (!searchText) {
      return medicines.slice(0, 8);
    }

    return medicines
      .filter((medicine) => {
        const medicineName = String(medicine.name || "").toLowerCase();
        const genericName = String(
          medicine.genericName || ""
        ).toLowerCase();

        return (
          medicineName.includes(searchText) ||
          genericName.includes(searchText)
        );
      })
      .slice(0, 8);
  }, [medicines, search]);

  // Add medicine to invoice
  const handleAddMedicine = (medicine) => {
    setError("");

    if (Number(medicine.stock) <= 0) {
      setError(`${medicine.name} is out of stock`);
      return;
    }

    const existingItem = items.find(
      (item) => item.medicineId === medicine._id
    );

    if (existingItem) {
      if (existingItem.quantity >= Number(medicine.stock)) {
        setError(
          `Only ${medicine.stock} units of ${medicine.name} are available`
        );
        return;
      }

      setItems((previousItems) =>
        previousItems.map((item) =>
          item.medicineId === medicine._id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        )
      );

      setSearch("");
      return;
    }

    setItems((previousItems) => [
      ...previousItems,
      {
        medicineId: medicine._id,
        medicineName: medicine.name,
        purchasePrice: Number(medicine.purchasePrice) || 0,
        sellingPrice: Number(medicine.sellingPrice) || 0,
        stock: Number(medicine.stock) || 0,
        quantity: 1,
      },
    ]);

    setSearch("");
  };

  // Update quantity
  const handleQuantityChange = (medicineId, value) => {
    const quantity = Number(value);

    setItems((previousItems) =>
      previousItems.map((item) => {
        if (item.medicineId !== medicineId) {
          return item;
        }

        if (quantity > item.stock) {
          return {
            ...item,
            quantity: item.stock,
          };
        }

        return {
          ...item,
          quantity: quantity < 1 ? 1 : quantity,
        };
      })
    );
  };

  // Remove medicine
  const handleRemoveItem = (medicineId) => {
    setItems((previousItems) =>
      previousItems.filter(
        (item) => item.medicineId !== medicineId
      )
    );
  };

  // Calculate subtotal
  const subtotal = items.reduce(
    (sum, item) =>
      sum +
      Number(item.sellingPrice || 0) *
        Number(item.quantity || 0),
    0
  );

  const discountAmount = Math.max(
    0,
    Number(discount || 0)
  );

  const total = Math.max(
    0,
    subtotal - discountAmount
  );

  // Submit sale
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!name.trim()) {
      return setError("Customer name is required");
    }

    if (!date) {
      return setError("Please select a date");
    }

    if (!hostelNumber) {
      return setError("Please select a hostel");
    }

    if (!roomNumber) {
      return setError("Please enter room number");
    }

    if (items.length === 0) {
      return setError("Please add at least one medicine");
    }

    if (Number(discount) < 0) {
      return setError("Discount cannot be negative");
    }

    try {
      setLoading(true);

      const saleData = {
        name: name.trim(),
        date,
        hostelNumber: Number(hostelNumber),
        roomNumber: String(roomNumber),

        items: items.map((item) => ({
          medicineId: item.medicineId,
          quantity: Number(item.quantity),
        })),

        discount: Number(discount),
        paymentMethod,
      };

      console.log("Creating sale:", saleData);

      await createSale(saleData);

      onCreated();
    } catch (err) {
      console.error("Create sale error:", err);

      setError(
        err.message || "Failed to create sale"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-5xl rounded-xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Add Sale
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Create a new pharmacy sale
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-lg p-2 text-gray-500 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="max-h-[75vh] overflow-y-auto px-6 py-6">
            {/* Error */}
            {error && (
              <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-sm text-red-600">
                  {error}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* LEFT SIDE */}
              <div className="space-y-5">
                {/* Customer */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Customer Name
                    </label>

                    <input
                      type="text"
                      value={name}
                      onChange={(e) =>
                        setName(e.target.value)
                      }
                      placeholder="Enter customer name"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Date
                    </label>

                    <input
                      type="date"
                      value={date}
                      onChange={(e) =>
                        setDate(e.target.value)
                      }
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Hostel + Room */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Hostel
                    </label>

                    <select
                      value={hostelNumber}
                      onChange={(e) =>
                        setHostelNumber(e.target.value)
                      }
                      className={inputClass}
                    >
                      <option value="">
                        Select hostel
                      </option>

                      <option value="1">
                        Hostel 1
                      </option>

                      <option value="2">
                        Hostel 2
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Room Number
                    </label>

                    <input
                      type="number"
                      min="1"
                      value={roomNumber}
                      onChange={(e) =>
                        setRoomNumber(e.target.value)
                      }
                      placeholder="e.g. 204"
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Medicine Search */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Search Medicine
                  </label>

                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                    <input
                      type="text"
                      value={search}
                      onChange={(e) =>
                        setSearch(e.target.value)
                      }
                      placeholder="Search medicine..."
                      className={`${inputClass} pl-10`}
                    />
                  </div>

                  {/* Search Results */}
                  {search.trim() && (
                    <div className="mt-2 max-h-72 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-sm">
                      {filteredMedicines.length === 0 ? (
                        <div className="px-4 py-5 text-center text-sm text-gray-500">
                          No medicines found
                        </div>
                      ) : (
                        filteredMedicines.map(
                          (medicine) => {
                            const outOfStock =
                              Number(medicine.stock) === 0;

                            return (
                              <button
                                key={medicine._id}
                                type="button"
                                disabled={outOfStock}
                                onClick={() =>
                                  handleAddMedicine(
                                    medicine
                                  )
                                }
                                className={`w-full border-b border-gray-100 px-4 py-3 text-left last:border-0 ${
                                  outOfStock
                                    ? "cursor-not-allowed bg-gray-50 opacity-60"
                                    : "cursor-pointer hover:bg-gray-50"
                                }`}
                              >
                                <div className="flex items-center justify-between gap-4">
                                  <div>
                                    <p className="font-medium text-gray-900">
                                      {medicine.name}
                                    </p>

                                    {medicine.genericName && (
                                      <p className="mt-0.5 text-xs text-gray-500">
                                        {
                                          medicine.genericName
                                        }
                                      </p>
                                    )}
                                  </div>

                                  <Plus className="h-4 w-4 shrink-0 text-green-600" />
                                </div>

                                <div className="mt-1 flex flex-wrap gap-x-3 text-xs">
                                  <span className="font-medium text-gray-700">
                                    Purchase: Rs.{" "}
                                    {Number(
                                      medicine.purchasePrice ||
                                        0
                                    ).toLocaleString()}
                                  </span>

                                  <span className="font-medium text-gray-700">
                                    Selling: Rs.{" "}
                                    {Number(
                                      medicine.sellingPrice ||
                                        0
                                    ).toLocaleString()}
                                  </span>

                                  <span
                                    className={
                                      outOfStock
                                        ? "font-medium text-red-600"
                                        : "text-gray-500"
                                    }
                                  >
                                    {outOfStock
                                      ? "Out of stock"
                                      : `${medicine.stock} in stock`}
                                  </span>
                                </div>
                              </button>
                            );
                          }
                        )
                      )}
                    </div>
                  )}
                </div>

                {/* Invoice Items */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-900">
                      Invoice Items
                    </h3>

                    <span className="text-xs text-gray-500">
                      {items.length} medicine
                      {items.length !== 1 ? "s" : ""}
                    </span>
                  </div>

                  {items.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-gray-300 px-4 py-8 text-center">
                      <p className="text-sm text-gray-500">
                        Search and add medicines to the invoice
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {items.map((item) => {
                        const lineTotal =
                          Number(item.sellingPrice || 0) *
                          Number(item.quantity || 0);

                        return (
                          <div
                            key={item.medicineId}
                            className="rounded-lg border border-gray-200 bg-white p-4"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="font-semibold text-gray-900">
                                  {item.medicineName}
                                </p>

                                <p className="mt-1 text-xs text-gray-500">
                                  Available: {item.stock}
                                </p>
                              </div>

                              <button
                                type="button"
                                onClick={() =>
                                  handleRemoveItem(
                                    item.medicineId
                                  )
                                }
                                className="cursor-pointer text-red-500 hover:text-red-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>

                            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                              <div>
                                <p className="text-xs text-gray-500">
                                  Purchase Price
                                </p>

                                <p className="mt-1 text-sm font-medium text-gray-900">
                                  Rs.{" "}
                                  {Number(
                                    item.purchasePrice
                                  ).toLocaleString()}
                                </p>
                              </div>

                              <div>
                                <p className="text-xs text-gray-500">
                                  Selling Price
                                </p>

                                <p className="mt-1 text-sm font-medium text-gray-900">
                                  Rs.{" "}
                                  {Number(
                                    item.sellingPrice
                                  ).toLocaleString()}
                                </p>
                              </div>

                              <div>
                                <p className="text-xs text-gray-500">
                                  Quantity
                                </p>

                                <input
                                  type="number"
                                  min="1"
                                  max={item.stock}
                                  value={item.quantity}
                                  onChange={(e) =>
                                    handleQuantityChange(
                                      item.medicineId,
                                      e.target.value
                                    )
                                  }
                                  className="mt-1 h-9 w-full rounded-md border border-gray-200 px-2 text-sm outline-none focus:border-green-500"
                                />
                              </div>

                              <div>
                                <p className="text-xs text-gray-500">
                                  Total
                                </p>

                                <p className="mt-1 text-sm font-semibold text-gray-900">
                                  Rs.{" "}
                                  {lineTotal.toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT SIDE */}
              <div>
                <div className="sticky top-0 rounded-xl border border-gray-200 bg-gray-50 p-5">
                  <h3 className="text-base font-semibold text-gray-900">
                    Sale
                  </h3>

                  <p className="mt-1 text-xs text-gray-500">
                    Review the invoice before completing the sale.
                  </p>

                  {/* Items Summary */}
                  <div className="mt-5 space-y-3">
                    {items.length === 0 ? (
                      <p className="text-sm text-gray-500">
                        No medicines added yet.
                      </p>
                    ) : (
                      items.map((item) => (
                        <div
                          key={item.medicineId}
                          className="flex items-start justify-between gap-4"
                        >
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {item.medicineName}
                            </p>

                            <p className="mt-0.5 text-xs text-gray-500">
                              {item.quantity} × Rs.{" "}
                              {Number(
                                item.sellingPrice
                              ).toLocaleString()}
                            </p>

                            <p className="mt-0.5 text-xs text-gray-400">
                              Purchase: Rs.{" "}
                              {Number(
                                item.purchasePrice
                              ).toLocaleString()}
                            </p>
                          </div>

                          <p className="text-sm font-semibold text-gray-900">
                            Rs.{" "}
                            {(
                              Number(item.sellingPrice) *
                              Number(item.quantity)
                            ).toLocaleString()}
                          </p>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Summary */}
                  <div className="mt-6 space-y-3 border-t border-gray-200 pt-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">
                        Subtotal
                      </span>

                      <span className="font-medium text-gray-900">
                        Rs. {subtotal.toLocaleString()}
                      </span>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm text-gray-500">
                        Discount
                      </label>

                      <input
                        type="number"
                        min="0"
                        value={discount}
                        onChange={(e) =>
                          setDiscount(e.target.value)
                        }
                        placeholder="0"
                        className={inputClass}
                      />
                    </div>

                    <div className="flex items-center justify-between border-t border-gray-200 pt-3">
                      <span className="font-semibold text-gray-900">
                        Total
                      </span>

                      <span className="text-xl font-bold text-green-600">
                        Rs. {total.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Payment */}
                  <div className="mt-5">
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Payment Method
                    </label>

                    <select
                      value={paymentMethod}
                      onChange={(e) =>
                        setPaymentMethod(e.target.value)
                      }
                      className={inputClass}
                    >
                      <option value="cash">
                        Cash
                      </option>

                      <option value="easypaisa">
                        Easypaisa
                      </option>

                      <option value="jazzcash">
                        JazzCash
                      </option>

                      <option value="banktransfer">
                        Bank Transfer
                      </option>

                      <option value="other">
                        Other
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="cursor-pointer rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading || items.length === 0}
              className="cursor-pointer rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Saving..."
                : "Complete Sale"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSale;