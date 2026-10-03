import React, { useEffect, useMemo, useState } from "react";

import MedicineHeader from "../../components/medicines/Medicinesheader";
import MedicineTable from "../../components/medicines/MedincinesTable";
import EditMedicine from "../../components/medicines/EditMedicine";
import AddMedicine from "../../components/medicines/AddMedicine";

import { getMedicines, deleteMedicine } from "../../api/medicines";

const Medicine = () => {
  const [medicines, setMedicines] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [pagination, setPagination] = useState(null);

  // Summary values from API
  const [totalMedicines, setTotalMedicines] = useState(0);
  const [totalLowStockMedicines, setTotalLowStockMedicines] =
    useState(0);
  const [totalOutOfStockMedicines, setTotalOutOfStockMedicines] =
    useState(0);

  // Medicine currently being edited
  const [editingMedicine, setEditingMedicine] = useState(null);

  // Add medicine modal
  const [showAddMedicine, setShowAddMedicine] = useState(false);

  // --------------------------------------------------
  // GET MEDICINES FROM API
  // --------------------------------------------------

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getMedicines(page, limit);

      console.log("Medicines API response:", response);

      // Medicines
      if (Array.isArray(response.medicines)) {
        setMedicines(response.medicines);
      } else if (Array.isArray(response.data)) {
        setMedicines(response.data);
      } else if (Array.isArray(response.data?.medicines)) {
        setMedicines(response.data.medicines);
      } else {
        setMedicines([]);
      }

      // Pagination
      if (response.pagination) {
        setPagination(response.pagination);
      } else {
        setPagination(null);
      }

      // Summary values
      setTotalMedicines(
        Number(response.totalMedicines || 0)
      );

      setTotalLowStockMedicines(
        Number(response.totalLowStockMedicines || 0)
      );

      setTotalOutOfStockMedicines(
        Number(response.totalOutOfStockMedicines || 0)
      );
    } catch (error) {
      console.error("Fetch medicines error:", error);

      setError(
        error.message || "Failed to load medicines"
      );

      setMedicines([]);
      setPagination(null);

      setTotalMedicines(0);
      setTotalLowStockMedicines(0);
      setTotalOutOfStockMedicines(0);
    } finally {
      setLoading(false);
    }
  };

  // Fetch whenever page changes
  useEffect(() => {
    fetchMedicines();
  }, [page]);

  // --------------------------------------------------
  // SEARCH
  // --------------------------------------------------

  const filteredMedicines = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    if (!searchText) {
      return medicines;
    }

    return medicines.filter((medicine) => {
      return (
        medicine.name
          ?.toLowerCase()
          .includes(searchText) ||
        medicine.genericName
          ?.toLowerCase()
          .includes(searchText) ||
        medicine.manufacturer
          ?.toLowerCase()
          .includes(searchText) ||
        medicine.category
          ?.toLowerCase()
          .includes(searchText)
      );
    });
  }, [medicines, search]);

  // --------------------------------------------------
  // SEARCH CHANGE
  // --------------------------------------------------

  const handleSearchChange = (e) => {
    setSearch(e.target.value);

    // Go back to page 1 when searching
    setPage(1);
  };

  // --------------------------------------------------
  // PAGE CHANGE
  // --------------------------------------------------

  const handlePageChange = (newPage) => {
    if (newPage < 1) {
      return;
    }

    if (
      pagination &&
      newPage > pagination.totalPages
    ) {
      return;
    }

    setPage(newPage);
  };

  // --------------------------------------------------
  // EDIT MEDICINE
  // --------------------------------------------------

  const handleEdit = (medicine) => {
    setEditingMedicine(medicine);
  };

  // --------------------------------------------------
  // AFTER MEDICINE IS UPDATED
  // --------------------------------------------------

  const handleMedicineUpdated = (updatedMedicine) => {
    setMedicines((previousMedicines) =>
      previousMedicines.map((medicine) =>
        medicine._id === updatedMedicine._id
          ? updatedMedicine
          : medicine
      )
    );

    setEditingMedicine(null);

    // Refresh current page + summary
    fetchMedicines();
  };

  // --------------------------------------------------
  // DELETE MEDICINE
  // --------------------------------------------------

  const handleDelete = async (medicine) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${medicine.name}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteMedicine(medicine._id);

      // Remove from current UI
      setMedicines((previousMedicines) =>
        previousMedicines.filter(
          (item) => item._id !== medicine._id
        )
      );

      // Refresh current page + totals
      fetchMedicines();
    } catch (error) {
      console.error("Delete medicine error:", error);

      alert(
        error.message || "Failed to delete medicine"
      );
    }
  };

  // --------------------------------------------------
  // AFTER NEW MEDICINE IS CREATED
  // --------------------------------------------------

  const handleMedicineCreated = (newMedicine) => {
    setShowAddMedicine(false);

    // Refresh API instead of manually adding it to the
    // current paginated page
    fetchMedicines();
  };

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

  return (
    <div className="min-h-screen bg-gray-50">
      <div>
        {/* Header */}
        <MedicineHeader
          totalMedicines={totalMedicines}
          lowStockMedicines={totalLowStockMedicines}
          outOfStockMedicines={
            totalOutOfStockMedicines
          }
          searchValue={search}
          onSearchChange={handleSearchChange}
          onAddMedicine={() =>
            setShowAddMedicine(true)
          }
        />

        {/* Loading */}
        {loading && (
          <div className="mt-6 rounded-xl border border-gray-200 bg-white p-10 text-center">
            <p className="text-sm text-gray-500">
              Loading medicines...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-5">
            <p className="text-sm text-red-600">
              {error}
            </p>

            <button
              type="button"
              onClick={fetchMedicines}
              className="mt-3 cursor-pointer rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Medicine Table */}
        {!loading && !error && (
          <MedicineTable
            medicines={filteredMedicines}
            pagination={pagination}
            onPageChange={handlePageChange}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

        {/* Add Medicine Modal */}
        {showAddMedicine && (
          <AddMedicine
            onClose={() =>
              setShowAddMedicine(false)
            }
            onCreated={handleMedicineCreated}
          />
        )}

        {/* Edit Medicine Modal */}
        {editingMedicine && (
          <EditMedicine
            medicine={editingMedicine}
            onClose={() =>
              setEditingMedicine(null)
            }
            onUpdated={handleMedicineUpdated}
          />
        )}
      </div>
    </div>
  );
};

export default Medicine;