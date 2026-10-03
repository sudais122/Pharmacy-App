import mongoose from "mongoose";

import Sale from "../models/Sale.model.js";
import Medicine from "../models/Medicine.model.js";
import Counter from "../models/counter.model.js";

const generateInvoiceNumber = async (session) => {
  const year = new Date().getFullYear();

  const counter = await Counter.findOneAndUpdate(
    { name: `invoice-${year}` },
    { $inc: { sequence: 1 } },
    {
      new: true,
      upsert: true,
      session,
    },
  );

  return `INV-${year}-${String(counter.sequence).padStart(4, "0")}`;
};

export const createSale = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const {
      name,
      date,
      hostelNumber,
      roomNumber,
      items,
      discount = 0,
      paymentMethod,
    } = req.body;

    // -----------------------------
    // Basic validation
    // -----------------------------

    if (
      !name ||
      !date ||
      hostelNumber === undefined ||
      !roomNumber ||
      !Array.isArray(items) ||
      items.length === 0 ||
      !paymentMethod
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, date, hostel number, room number, items and payment method are required",
      });
    }

    const parsedHostelNumber = Number(hostelNumber);
    const parsedDiscount = Number(discount);

    if (!Number.isInteger(parsedHostelNumber) || parsedHostelNumber < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid hostel number",
      });
    }

    if (!Number.isFinite(parsedDiscount) || parsedDiscount < 0) {
      return res.status(400).json({
        success: false,
        message: "Discount must be a valid non-negative number",
      });
    }

    // -----------------------------
    // Validate items
    // -----------------------------

    const normalizedItems = items.map((item) => ({
      medicineId: String(item.medicineId || "").trim(),
      quantity: Number(item.quantity),
    }));

    for (const item of normalizedItems) {
      if (
        !item.medicineId ||
        !mongoose.Types.ObjectId.isValid(item.medicineId)
      ) {
        return res.status(400).json({
          success: false,
          message: `Invalid medicine ID: ${item.medicineId}`,
        });
      }

      if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
        return res.status(400).json({
          success: false,
          message: "Quantity must be a positive whole number",
        });
      }
    }

    // -----------------------------
    // Prevent duplicate medicines
    // -----------------------------

    const medicineIdStrings = normalizedItems.map((item) => item.medicineId);

    if (new Set(medicineIdStrings).size !== medicineIdStrings.length) {
      return res.status(400).json({
        success: false,
        message: "The same medicine cannot be added multiple times to one sale",
      });
    }

    let createdInvoiceNumber;

    // -----------------------------
    // Transaction
    // -----------------------------

    await session.withTransaction(async () => {
      const medicines = await Medicine.find({
        _id: { $in: medicineIdStrings },
      }).session(session);

      const medicineMap = new Map(
        medicines.map((medicine) => [medicine._id.toString(), medicine]),
      );

      for (const item of normalizedItems) {
        const medicine = medicineMap.get(item.medicineId);

        if (!medicine) {
          throw new Error(`Medicine not found: ${item.medicineId}`);
        }

        if (!medicine.isActive) {
          throw new Error(`Medicine is inactive: ${medicine.name}`);
        }
      }

      // -----------------------------
      // Calculate sale
      // -----------------------------

      const saleItems = [];
      let subtotal = 0;

      for (const item of normalizedItems) {
        const medicine = medicineMap.get(item.medicineId);

        if (medicine.stock < item.quantity) {
          throw new Error(
            `Insufficient stock for ${medicine.name}. Available stock: ${medicine.stock}`,
          );
        }

        const purchasePrice = Number(medicine.purchasePrice);
        const sellingPrice = Number(medicine.sellingPrice);

        const itemTotal = sellingPrice * item.quantity;

        saleItems.push({
          medicineId: medicine._id,
          medicineName: medicine.name,
          quantity: item.quantity,
          purchasePrice,
          sellingPrice,
          total: itemTotal,
        });

        subtotal += itemTotal;
      }

      if (parsedDiscount > subtotal) {
        throw new Error("Discount cannot be greater than the subtotal");
      }

      const total = subtotal - parsedDiscount;

      // -----------------------------
      // Generate invoice number
      // -----------------------------

      createdInvoiceNumber = await generateInvoiceNumber(session);

      // -----------------------------
      // Decrease stock
      // -----------------------------

      for (const item of normalizedItems) {
        const medicine = medicineMap.get(item.medicineId);

        medicine.stock -= item.quantity;

        await medicine.save({
          session,
        });
      }

      // -----------------------------
      // Create sale
      // -----------------------------

      await Sale.create(
        [
          {
            name: name.trim(),
            date: new Date(date),

            invoiceNumber: createdInvoiceNumber,
            hostelNumber: parsedHostelNumber,
            roomNumber: roomNumber.trim(),

            items: saleItems,

            subtotal,
            discount: parsedDiscount,
            total,

            paymentMethod: paymentMethod.trim().toLowerCase(),
          },
        ],
        {
          session,
        },
      );
    });

    // -----------------------------
    // Get created sale
    // -----------------------------

    const sale = await Sale.findOne({
      invoiceNumber: createdInvoiceNumber,
    }).lean();

    return res.status(201).json({
      success: true,
      message: "Sale created successfully",
      sale,
    });
  } catch (error) {
    console.error("Create sale error:", error);

    if (
      error.message.includes("Medicine not found") ||
      error.message.includes("Medicine is inactive") ||
      error.message.includes("Insufficient stock") ||
      error.message === "Discount cannot be greater than the subtotal"
    ) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create sale",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  } finally {
    await session.endSession();
  }
};

const getLatestInvoiceForResponse = async () => {
  const sale = await Sale.findOne()
    .sort({ createdAt: -1 })
    .select("invoiceNumber")
    .lean();

  return sale?.invoiceNumber;
};


export const getSales = async (req, res) => {
  try {
    const {
      search,
      hostelNumber,
      roomNumber,
      period,
      startDate,
      endDate,
      page = 1,
      limit = 10,
    } = req.query;

    const filter = {};

    const parsedPage = Math.max(Number(page) || 1, 1);
    const parsedLimit = Math.min(
      Math.max(Number(limit) || 10, 1),
      100
    );

    const skip = (parsedPage - 1) * parsedLimit;

    if (hostelNumber !== undefined && hostelNumber !== "") {
      const parsedHostelNumber = Number(hostelNumber);

      if (
        !Number.isInteger(parsedHostelNumber) ||
        parsedHostelNumber < 1
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid hostel number",
        });
      }

      filter.hostelNumber = parsedHostelNumber;
    }

    if (roomNumber?.trim()) {
      filter.roomNumber = roomNumber.trim();
    }

    if (search?.trim()) {
      filter.name = {
        $regex: search.trim(),
        $options: "i",
      };
    }

    if (period) {
      const start = new Date();
      const end = new Date();

      if (period === "today") {
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
      } else if (period === "7days") {
        start.setDate(start.getDate() - 6);
        start.setHours(0, 0, 0, 0);

        end.setHours(23, 59, 59, 999);
      } else if (period === "28days") {
        start.setDate(start.getDate() - 27);
        start.setHours(0, 0, 0, 0);

        end.setHours(23, 59, 59, 999);
      } else {
        return res.status(400).json({
          success: false,
          message: "Invalid period. Use today, 7days or 28days",
        });
      }

      filter.date = {
        $gte: start,
        $lte: end,
      };
    }

    if (startDate || endDate) {
      const dateFilter = {};

      if (startDate) {
        const start = new Date(`${startDate}T00:00:00`);

        if (Number.isNaN(start.getTime())) {
          return res.status(400).json({
            success: false,
            message: "Invalid startDate",
          });
        }

        dateFilter.$gte = start;
      }

      if (endDate) {
        const end = new Date(`${endDate}T23:59:59.999`);

        if (Number.isNaN(end.getTime())) {
          return res.status(400).json({
            success: false,
            message: "Invalid endDate",
          });
        }

        dateFilter.$lte = end;
      }

      filter.date = dateFilter;
    }

    const [sales, total] = await Promise.all([
      Sale.find(filter)
        .sort({ date: -1 })
        .skip(skip)
        .limit(parsedLimit)
        .lean(),

      Sale.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / parsedLimit);

    return res.status(200).json({
      success: true,
      count: sales.length,
      total,
      page: parsedPage,
      limit: parsedLimit,
      totalPages,
      sales,
    });
  } catch (error) {
    console.error("Get sales error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get sales",
    });
  }
};

export const getSaleById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid sale ID",
      });
    }

    const sale = await Sale.findById(id).lean();

    if (!sale) {
      return res.status(404).json({
        success: false,
        message: "Sale not found",
      });
    }

    const date = new Date(sale.createdAt);

    const invoice = {
      ...sale,
      date: date.toISOString().split("T")[0],
      time: date.toTimeString().slice(0, 5),
    };

    return res.status(200).json({
      success: true,
      sale: invoice,
    });
  } catch (error) {
    console.error("Get sale error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get sale",
    });
  }
};
