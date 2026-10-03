import mongoose from "mongoose";
import Medicine from "../models/Medicine.model.js";

const getStockStatus = (stock, minimumStock) => {
  if (stock === 0) {
    return "out-of-stock";
  }

  if (stock <= minimumStock) {
    return "low";
  }

  return "in-stock";
};

export const createMedicine = async (req, res) => {
  try {
    const {
      name,
      genericName,
      manufacturer,
      purchasePrice,
      sellingPrice,
      stock,
      minimumStock,
      category,
    } = req.body;

    if (
      !name ||
      !genericName ||
      !manufacturer ||
      purchasePrice === undefined ||
      sellingPrice === undefined ||
      stock === undefined ||
      minimumStock === undefined ||
      !category
    ) {
      return res.status(400).json({
        success: false,
        message: "All medicine fields are required",
      });
    }

    const normalizedName = name.trim();

    if (!normalizedName) {
      return res.status(400).json({
        success: false,
        message: "Medicine name is required",
      });
    }

    if (
      Number(purchasePrice) < 0 ||
      Number(sellingPrice) < 0 ||
      Number(stock) < 0 ||
      Number(minimumStock) < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Price and stock values cannot be negative",
      });
    }

    const existingMedicine = await Medicine.findOne({
      name: {
        $regex: `^${normalizedName}$`,
        $options: "i",
      },
    });

    if (existingMedicine) {
      return res.status(409).json({
        success: false,
        message: "A medicine with this name already exists",
      });
    }

    const medicine = await Medicine.create({
      name: normalizedName,
      genericName: genericName.trim(),
      manufacturer: manufacturer.trim(),
      purchasePrice: Number(purchasePrice),
      sellingPrice: Number(sellingPrice),
      stock: Number(stock),
      minimumStock: Number(minimumStock),
      category: category.trim(),
      isActive: true,
    });

    const result = medicine.toObject();

    result.status = getStockStatus(
      result.stock,
      result.minimumStock
    );

    return res.status(201).json({
      success: true,
      message: "Medicine added successfully",
      medicine: result,
    });
  } catch (error) {
    console.error("Create medicine error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add medicine",
    });
  }
};

export const getMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find().sort({ createdAt: -1 });

    const totalMedicines = medicines.length;

    // Stock is greater than 0 but at or below minimum stock
    const totalLowStockMedicines = medicines.filter(
      (medicine) => {
        const stock = Number(medicine.stock || 0);
        const minimumStock = Number(medicine.minimumStock || 0);

        return stock > 0 && stock <= minimumStock;
      }
    ).length;

    // Stock is exactly 0
    const totalOutOfStockMedicines = medicines.filter(
      (medicine) => Number(medicine.stock || 0) === 0
    ).length;

    const totalActiveMedicines = medicines.filter(
      (medicine) => medicine.isActive === true
    ).length;

    return res.status(200).json({
      success: true,
      medicines,
      totalMedicines,
      totalLowStockMedicines,
      totalOutOfStockMedicines,
      totalActiveMedicines,
    });
  } catch (error) {
    console.error("Get medicines error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch medicines",
      error: error.message,
    });
  }
};

export const getMedicineById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid medicine ID",
      });
    }

    const medicine = await Medicine.findOne({
      _id: id,
      isActive: true,
    }).lean();

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found",
      });
    }

    medicine.status = getStockStatus(medicine.stock, medicine.minimumStock);

    return res.status(200).json({
      success: true,
      medicine,
    });
  } catch (error) {
    console.error("Get medicine error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get medicine",
    });
  }
};

export const updateMedicine = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid medicine ID",
      });
    }

    const {
      name,
      genericName,
      manufacturer,
      purchasePrice,
      sellingPrice,
      stock,
      minimumStock,
      category,
    } = req.body;

    // Check if at least one field is provided
    const updateFields = [
      name,
      genericName,
      manufacturer,
      purchasePrice,
      sellingPrice,
      stock,
      minimumStock,
      category,
    ];

    const hasAtLeastOneField = updateFields.some(
      (field) => field !== undefined && field !== null && field !== "",
    );

    if (!hasAtLeastOneField) {
      return res.status(400).json({
        success: false,
        message: "At least one field is required to update",
      });
    }

    // Validate numeric values if they are provided
    if (
      (purchasePrice !== undefined && purchasePrice < 0) ||
      (sellingPrice !== undefined && sellingPrice < 0) ||
      (stock !== undefined && stock < 0) ||
      (minimumStock !== undefined && minimumStock < 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "Price and stock values cannot be negative",
      });
    }

    const medicine = await Medicine.findOne({
      _id: id,
      isActive: true,
    });

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found",
      });
    }

    // Update only provided fields
    if (name !== undefined) medicine.name = name.trim();
    if (genericName !== undefined) medicine.genericName = genericName.trim();
    if (manufacturer !== undefined) medicine.manufacturer = manufacturer.trim();
    if (purchasePrice !== undefined)
      medicine.purchasePrice = Number(purchasePrice);
    if (sellingPrice !== undefined)
      medicine.sellingPrice = Number(sellingPrice);
    if (stock !== undefined) medicine.stock = Number(stock);
    if (minimumStock !== undefined)
      medicine.minimumStock = Number(minimumStock);
    if (category !== undefined) medicine.category = category.trim();

    await medicine.save();

    const result = medicine.toObject();

    result.status = getStockStatus(result.stock, result.minimumStock);

    return res.status(200).json({
      success: true,
      message: "Medicine updated successfully",
      medicine: result,
    });
  } catch (error) {
    console.error("Update medicine error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update medicine",
    });
  }
};

export const updateMedicineStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid medicine ID",
      });
    }

    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isActive must be a boolean",
      });
    }

    const medicine = await Medicine.findById(id);

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found",
      });
    }

    medicine.isActive = isActive;

    await medicine.save();

    return res.status(200).json({
      success: true,
      message: isActive
        ? "Medicine activated successfully"
        : "Medicine deactivated successfully",
      medicine,
    });
  } catch (error) {
    console.error("Update medicine status error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update medicine status",
    });
  }
};

export const updateMedicineStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid medicine ID",
      });
    }

    if (
      stock === undefined ||
      typeof stock !== "number" ||
      !Number.isFinite(stock) ||
      stock < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Stock must be a valid non-negative number",
      });
    }

    const medicine = await Medicine.findOne({
      _id: id,
      isActive: true,
    });

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found",
      });
    }

    medicine.stock = stock;

    await medicine.save();

    const result = medicine.toObject();

    result.status = getStockStatus(result.stock, result.minimumStock);

    return res.status(200).json({
      success: true,
      message: "Stock updated successfully",
      medicine: result,
    });
  } catch (error) {
    console.error("Update medicine stock error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update medicine stock",
    });
  }
};

// Delete medicine
export const deleteMedicine = async (req, res) => {
  try {
    const { id } = req.params;

    const medicine = await Medicine.findById(id);

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found",
      });
    }

    await Medicine.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Medicine deleted successfully",
    });
  } catch (error) {
    console.error("Delete medicine error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete medicine",
      error: error.message,
    });
  }
};