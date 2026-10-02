import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

import { updateMedicine } from "../../api/medicines";

const EditMedicine = ({ medicine, onClose, onUpdated }) => {
  const [formData, setFormData] = useState({
    name: "",
    genericName: "",
    manufacturer: "",
    purchasePrice: "",
    sellingPrice: "",
    stock: "",
    minimumStock: "",
    category: "",
    isActive: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (medicine) {
      setFormData({
        name: medicine.name || "",
        genericName: medicine.genericName || "",
        manufacturer: medicine.manufacturer || "",
        purchasePrice: medicine.purchasePrice ?? "",
        sellingPrice: medicine.sellingPrice ?? "",
        stock: medicine.stock ?? "",
        minimumStock: medicine.minimumStock ?? "",
        category: medicine.category || "",
        isActive: medicine.isActive ?? true,
      });
    }
  }, [medicine]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const updatedData = {
        name: formData.name.trim(),
        genericName: formData.genericName.trim(),
        manufacturer: formData.manufacturer.trim(),
        purchasePrice: Number(formData.purchasePrice),
        sellingPrice: Number(formData.sellingPrice),
        stock: Number(formData.stock),
        minimumStock: Number(formData.minimumStock),
        category: formData.category.trim(),
        isActive: formData.isActive,
      };

      const response = await updateMedicine(
        medicine._id,
        updatedData
      );

      console.log("Update medicine response:", response);

      const updatedMedicine =
        response.medicine ||
        response.data?.medicine ||
        response.data ||
        updatedData;

      onUpdated({
        ...medicine,
        ...updatedMedicine,
      });

      onClose();
    } catch (error) {
      console.error("Update medicine error:", error);

      setError(
        error.message || "Failed to update medicine"
      );
    } finally {
      setLoading(false);
    }
  };
console.log("EditMedicine rendered:", medicine); 
  if (!medicine) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded-xl bg-white shadow-xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Edit Medicine
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Update medicine information
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>

          <div className="max-h-[70vh] overflow-y-auto px-6 py-6">

            {error && (
              <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-sm text-red-600">
                  {error}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

              {/* Medicine Name */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Medicine Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />
              </div>

              {/* Generic Name */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Generic Name
                </label>

                <input
                  type="text"
                  name="genericName"
                  value={formData.genericName}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />
              </div>

              {/* Manufacturer */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Manufacturer
                </label>

                <input
                  type="text"
                  name="manufacturer"
                  value={formData.manufacturer}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />
              </div>

              {/* Category */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Category
                </label>

                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />
              </div>

              {/* Purchase Price */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Purchase Price
                </label>

                <input
                  type="number"
                  name="purchasePrice"
                  value={formData.purchasePrice}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  required
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />
              </div>

              {/* Selling Price */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Selling Price
                </label>

                <input
                  type="number"
                  name="sellingPrice"
                  value={formData.sellingPrice}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  required
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />
              </div>

              {/* Stock */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Stock
                </label>

                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  min="0"
                  required
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />
              </div>

              {/* Minimum Stock */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Minimum Stock
                </label>

                <input
                  type="number"
                  name="minimumStock"
                  value={formData.minimumStock}
                  onChange={handleChange}
                  min="0"
                  required
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />
              </div>

              {/* Active Status */}
              <div className="md:col-span-2">
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="h-4 w-4 cursor-pointer accent-green-600"
                  />

                  <span className="text-sm font-medium text-gray-700">
                    Medicine is active
                  </span>
                </label>
              </div>

            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-6 py-4">

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-700 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>

          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMedicine;