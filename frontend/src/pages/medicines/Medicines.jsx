import React, { useEffect, useMemo, useState } from "react";

import MedicineHeader from "../../components/medicines/Medicinesheader";
import MedicineTable from "../../components/medicines/MedincinesTable";
import EditMedicine from "../../components/medicines/EditMedicine";
import AddMedicine from "../../components/medicines/AddMedicine";

import {
  getMedicines,
  deleteMedicine,
} from "../../api/medicines";

const Medicine = () => {
  const [medicines, setMedicines] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

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

      const response = await getMedicines();

      console.log("Medicines API response:", response);

      /*
        Supports different possible backend responses:

        {
          success: true,
          medicines: [...]
        }

        OR

        {
          success: true,
          data: [...]
        }

        OR

        {
          success: true,
          data: {
            medicines: [...]
          }
        }
      */

      if (Array.isArray(response.medicines)) {
        setMedicines(response.medicines);
      } else if (Array.isArray(response.data)) {
        setMedicines(response.data);
      } else if (Array.isArray(response.data?.medicines)) {
        setMedicines(response.data.medicines);
      } else {
        setMedicines([]);
      }
    } catch (error) {
      console.error("Fetch medicines error:", error);

      setError(
        error.message || "Failed to load medicines"
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch medicines when page loads
  useEffect(() => {
    fetchMedicines();
  }, []);

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
  // SUMMARY
  // --------------------------------------------------

  const totalMedicines = medicines.length;

  const activeMedicines = medicines.filter(
    (medicine) => medicine.isActive === true
  ).length;

  const lowStockMedicines = medicines.filter(
    (medicine) =>
      medicine.stock > 0 &&
      medicine.stock <= medicine.minimumStock
  ).length;

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

      // Remove medicine from UI after successful API request
      setMedicines((previousMedicines) =>
        previousMedicines.filter(
          (item) => item._id !== medicine._id
        )
      );
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
    setMedicines((previousMedicines) => [
      newMedicine,
      ...previousMedicines,
    ]);

    setShowAddMedicine(false);
  };

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

  return (
    <div className="min-h-screen bg-gray-50">
      <div >

        {/* Header */}
        <MedicineHeader
          totalMedicines={totalMedicines}
          activeMedicines={activeMedicines}
          lowStockMedicines={lowStockMedicines}
          searchValue={search}
          onSearchChange={(e) =>
            setSearch(e.target.value)
          }
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
              className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 cursor-pointer"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Medicine Table */}
        {!loading && !error && (
          <MedicineTable
            medicines={filteredMedicines}
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