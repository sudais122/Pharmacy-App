import React from "react";

import {
  Plus,
  Pill,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

import Button from "../ui/Button";
import PageHeader from "../ui/PageHeaer";
import Card from "../ui/Card";
import Search from "../ui/Search";
import DropDownmenu from "../ui/DropDownmenu";

const MedicineHeader = ({
  totalMedicines = 0,
  activeMedicines = 0,
  lowStockMedicines = 0,
  searchValue = "",
  onSearchChange,
  category = "",
  onCategoryChange,
  stockStatus = "",
  onStockStatusChange,
  onClearFilters,
}) => {
  const categories = [
    { value: "tablet", label: "Tablet" },
    { value: "capsule", label: "Capsule" },
    { value: "syrup", label: "Syrup" },
    { value: "injection", label: "Injection" },
  ];

  const stockStatuses = [
    { value: "in-stock", label: "In Stock" },
    { value: "low-stock", label: "Low Stock" },
    { value: "out-of-stock", label: "Out of Stock" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between">
        <PageHeader
          title="Medicines"
          description="Manage your pharmacy medicines and inventory"
        />

        <Button
          icon={Plus}
          text="Add Medicine"
        />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
        <Card
          title="Total Medicines"
          value={totalMedicines}
          icon={Pill}
        />

        <Card
          title="Active Medicines"
          value={activeMedicines}
          icon={CheckCircle}
        />

        <Card
          title="Low Stock"
          value={lowStockMedicines}
          icon={AlertTriangle}
          iconBg="bg-red-100"
          iconColor="text-red-600"
        />
      </div>

      {/* Search & Filters */}
      <div className="flex items-center justify-between gap-4 mt-6">
        <Search
          placeholder="Search medicines..."
          value={searchValue}
          onChange={onSearchChange}
        />

        <div className="flex items-center gap-3">
          <DropDownmenu
            placeholder="All Categories"
            options={categories}
            value={category}
            onChange={onCategoryChange}
          />

          <DropDownmenu
            placeholder="Stock Status"
            options={stockStatuses}
            value={stockStatus}
            onChange={onStockStatusChange}
          />

<button
  type="button"
  onClick={onClearFilters}
  className="h-11 px-4 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors cursor-pointer"
>
  Clear
</button>
        </div>
      </div>
    </div>
  );
};

export default MedicineHeader;