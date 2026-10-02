
import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

import { getMedicines } from "../../api/medicines";
import { createSale } from "../../api/sales";

const inputClass =
  "w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100";

const AddSale = ({ onClose, onCreated }) => {
  const [medicines, setMedicines] = useState([]);

  const [name, setName] = useState("");
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [hostelNumber, setHostelNumber] = useState("");
  const [roomNumber, setRoomNumber] = useState("");

  const [medicineId, setMedicineId] = useState("");
  const [quantity, setQuantity] = useState(1);

  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("cash");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // -----------------------------------------
  // Load medicines
  // -----------------------------------------

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

  // -----------------------------------------
  // Selected medicine
  // -----------------------------------------

  const selectedMedicine = medicines.find(
    (medicine) => medicine._id === medicineId
  );

  // -----------------------------------------
  // Calculate totals
  // -----------------------------------------

  const subtotal = selectedMedicine
    ? Number(selectedMedicine.sellingPrice || 0) *
      Number(quantity || 0)
    : 0;

  const discountAmount = Math.max(
    0,
    Number(discount || 0)
  );

  const total = Math.max(
    0,
    subtotal - discountAmount
  );

  // -----------------------------------------
  // Submit
  // -----------------------------------------

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

    if (!selectedMedicine) {
      return setError("Please select a medicine");
    }

    if (Number(quantity) < 1) {
      return setError("Quantity must be at least 1");
    }

    if (Number(quantity) > Number(selectedMedicine.stock)) {
      return setError(
        `Only ${selectedMedicine.stock} units available in stock`
      );
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

        items: [
          {
            medicineId: medicineId,
            quantity: Number(quantity),
          },
        ],

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
      <div className="w-full max-w-2xl rounded-xl bg-white shadow-xl">
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
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-5 px-6 py-6 max-h-[70vh] overflow-y-auto">
            {/* Error */}
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-sm text-red-600">
                  {error}
                </p>
              </div>
            )}

            {/* Customer + Date */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Name */}
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

              {/* Date */}
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
              {/* Hostel */}
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

              {/* Room */}
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

            {/* Medicine */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Medicine
              </label>

              <select
                value={medicineId}
                onChange={(e) =>
                  setMedicineId(e.target.value)
                }
                className={inputClass}
              >
                <option value="">
                  Select medicine
                </option>

                {medicines.map((medicine) => (
                  <option
                    key={medicine._id}
                    value={medicine._id}
                    disabled={medicine.stock === 0}
                  >
                    {medicine.name}{" "}
                    {medicine.stock === 0
                      ? "(Out of stock)"
                      : `(Stock: ${medicine.stock})`}
                  </option>
                ))}
              </select>
            </div>

            {/* Quantity + Price */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Quantity */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Quantity
                </label>

                <input
                  type="number"
                  min="1"
                  max={selectedMedicine?.stock || undefined}
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(e.target.value)
                  }
                  className={inputClass}
                />
              </div>

              {/* Subtotal */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Subtotal
                </label>

                <input
                  type="text"
                  readOnly
                  value={`Rs. ${subtotal.toLocaleString()}`}
                  className={`${inputClass} bg-gray-50`}
                />
              </div>
            </div>

            {/* Discount + Payment */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Discount */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
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

              {/* Payment Method */}
              <div>
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

            {/* Total */}
            <div className="rounded-lg bg-gray-50 border border-gray-200 px-4 py-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  Subtotal
                </span>

                <span className="font-medium text-gray-900">
                  Rs. {subtotal.toLocaleString()}
                </span>
              </div>

              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  Discount
                </span>

                <span className="font-medium text-gray-900">
                  Rs. {discountAmount.toLocaleString()}
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-gray-200 pt-3">
                <span className="font-semibold text-gray-900">
                  Total
                </span>

                <span className="text-lg font-bold text-green-600">
                  Rs. {total.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Saving..." : "Add Sale"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSale;
