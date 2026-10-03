import React from "react";

import {
  Plus,
  Pill,
  AlertTriangle,
  Search,
  PackageX,
} from "lucide-react";

import Button from "../ui/Button";

import PageHeader from "../ui/PageHeaer";

import Card from "../ui/Card";

const MedicineHeader = ({
  totalMedicines = 0,
  outOfStockMedicines = 0,
  lowStockMedicines = 0,
  searchValue = "",
  onSearchChange,
  onAddMedicine,
}) => {
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
          onClick={onAddMedicine}
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
          title="Low Stock"
          value={lowStockMedicines}
          icon={AlertTriangle}
          iconBg="bg-red-100"
          iconColor="text-red-600"
        />

        <Card
          title="Out of Stock"
          value={outOfStockMedicines}
          icon={PackageX}
          iconBg="bg-orange-100"
          iconColor="text-orange-600"
        />
      </div>

      {/* Search Bar */}
      <div className="relative w-full max-w-md mt-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

        <input
          type="text"
          value={searchValue}
          onChange={onSearchChange}
          placeholder="Search medicines..."
          className="w-full h-11 pl-10 pr-4 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
        />
      </div>
    </div>
  );
};

export default MedicineHeader;