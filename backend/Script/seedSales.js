
import "../loadEnv.js";
import connectDB from "../db/config.js";
import mongoose from "mongoose";

import Medicine from "../models/medicine.Model.js";
import Sale from "../models/sale.Model.js";

const customers = [
  { name: "Ali Khan", hostelNumber: 1, roomNumber: "101" },
  { name: "Ahmed Raza", hostelNumber: 1, roomNumber: "102" },
  { name: "Usman Ali", hostelNumber: 1, roomNumber: "103" },
  { name: "Hamza Shah", hostelNumber: 1, roomNumber: "104" },
  { name: "Bilal Ahmed", hostelNumber: 2, roomNumber: "201" },
  { name: "Hassan Raza", hostelNumber: 2, roomNumber: "202" },
  { name: "Owais Khan", hostelNumber: 2, roomNumber: "203" },
  { name: "Saad Ahmed", hostelNumber: 2, roomNumber: "204" },
];

const paymentMethods = [
  "cash",
  "easypaisa",
  "jazzcash",
  "banktransfer",
  "other",
];

const randomItem = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

const randomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const randomQuantity = () => {
  return randomNumber(1, 3);
};

const randomDiscount = (subtotal) => {
  if (Math.random() < 0.25) {
    return Math.round(subtotal * 0.05);
  }

  return 0;
};

const randomDate = () => {
  const now = new Date();

  const date = new Date(now);

  date.setDate(date.getDate() - randomNumber(0, 27));
  date.setHours(randomNumber(8, 21));
  date.setMinutes(randomNumber(0, 59));
  date.setSeconds(randomNumber(0, 59));
  date.setMilliseconds(0);

  return date;
};

const generateInvoiceNumber = (index) => {
  return `INV-${Date.now()}-${String(index + 1).padStart(3, "0")}`;
};

const getUniqueMedicines = (medicines, count) => {
  const shuffled = [...medicines];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, count);
};

const seedSales = async () => {
  try {
    await connectDB();

    console.log("Fetching medicines...");

    const medicines = await Medicine.find({ isActive: true }).lean();

    if (!medicines.length) {
      throw new Error("No active medicines found");
    }

    console.log(`Found ${medicines.length} medicines`);

    const sales = [];

    const numberOfSales = 40;

    for (let i = 0; i < numberOfSales; i++) {
      const customer = randomItem(customers);

      const medicineCount = randomNumber(1, 3);

      const selectedMedicines = getUniqueMedicines(
        medicines,
        Math.min(medicineCount, medicines.length)
      );

      const items = selectedMedicines.map((medicine) => {
        const quantity = randomQuantity();

        return {
          medicineId: medicine._id,
          medicineName: medicine.name,
          purchasePrice: medicine.purchasePrice,
          sellingPrice: medicine.sellingPrice,
          quantity,
          total: medicine.sellingPrice * quantity,
        };
      });

      const subtotal = items.reduce(
        (sum, item) => sum + item.total,
        0
      );

      const discount = randomDiscount(subtotal);

      const total = subtotal - discount;

      sales.push({
        invoiceNumber: generateInvoiceNumber(i),

        name: customer.name,

        hostelNumber: customer.hostelNumber,

        roomNumber: customer.roomNumber,

        items,

        subtotal,

        discount,

        total,

        paymentMethod: randomItem(paymentMethods),

        date: randomDate(),
      });
    }

    console.log(`Generated ${sales.length} sales`);

    await Sale.insertMany(sales);

    console.log(`Successfully seeded ${sales.length} sales`);

    await mongoose.connection.close();

    console.log("MongoDB connection closed");

    process.exit(0);
  } catch (error) {
    console.error("Failed to seed sales:", error.message);

    if (error.errors) {
      Object.keys(error.errors).forEach((field) => {
        console.error(`${field}: ${error.errors[field].message}`);
      });
    }

    await mongoose.connection.close();

    process.exit(1);
  }
};

seedSales();
