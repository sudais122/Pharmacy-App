import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    genericName: {
      type: String,
      required: true,
      trim: true,
    },

    manufacturer: {
      type: String,
      required: true,
      trim: true,
    },

    purchasePrice: {
      type: Number,
      required: true,
      min: 0,
    },

    sellingPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    minimumStock: {
      type: Number,
      required: true,
      min: 0,
      default: 10,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const Medicine =
  mongoose.models.Medicine ||
  mongoose.model("Medicine", medicineSchema);

export default Medicine
