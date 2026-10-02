
import Sale from "../models/Sale.model.js";
import Medicine from "../models/Medicine.model.js";

/*
|--------------------------------------------------------------------------
| DATE RANGE HELPER
|--------------------------------------------------------------------------
| Supported:
|
| ?period=today
| ?period=7days
| ?period=28days
| ?period=30days
|
| ?date=2026-09-25
|
| ?startDate=2026-09-01&endDate=2026-09-29
|
| All dates are handled in Pakistan timezone.
|--------------------------------------------------------------------------
*/

const getDateRange = (req) => {
  const {
    period,
    date,
    startDate,
    endDate,
  } = req.query;

  const pakistanDate = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Karachi",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

  let fromDate;
  let toDate;

  // -----------------------------------------
  // Specific date
  // -----------------------------------------

  if (date) {
    fromDate = new Date(
      `${date}T00:00:00+05:00`
    );

    toDate = new Date(
      `${date}T23:59:59.999+05:00`
    );

    return {
      startDate: fromDate,
      endDate: toDate,
    };
  }

  // -----------------------------------------
  // Custom date range
  // -----------------------------------------

  if (startDate || endDate) {
    if (!startDate || !endDate) {
      throw new Error(
        "Both startDate and endDate are required"
      );
    }

    fromDate = new Date(
      `${startDate}T00:00:00+05:00`
    );

    toDate = new Date(
      `${endDate}T23:59:59.999+05:00`
    );

    return {
      startDate: fromDate,
      endDate: toDate,
    };
  }

  // -----------------------------------------
  // Today
  // -----------------------------------------

  if (period === "today") {
    fromDate = new Date(
      `${pakistanDate}T00:00:00+05:00`
    );

    toDate = new Date(
      `${pakistanDate}T23:59:59.999+05:00`
    );

    return {
      startDate: fromDate,
      endDate: toDate,
    };
  }

  // -----------------------------------------
  // Last N days
  // -----------------------------------------

  let numberOfDays = 7;

  if (period === "28days") {
    numberOfDays = 28;
  }

  if (period === "30days") {
    numberOfDays = 30;
  }

  fromDate = new Date(
    `${pakistanDate}T00:00:00+05:00`
  );

  fromDate.setDate(
    fromDate.getDate() - (numberOfDays - 1)
  );

  toDate = new Date(
    `${pakistanDate}T23:59:59.999+05:00`
  );

  return {
    startDate: fromDate,
    endDate: toDate,
  };
};


/*
|--------------------------------------------------------------------------
| GET SALES FOR PERIOD
|--------------------------------------------------------------------------
*/

const getSalesForPeriod = async (req) => {
  const { startDate, endDate } =
    getDateRange(req);

  return await Sale.find({
    createdAt: {
      $gte: startDate,
      $lte: endDate,
    },
  })
    .sort({ createdAt: -1 })
    .lean();
};


/*
|--------------------------------------------------------------------------
| CALCULATE SALE PROFIT
|--------------------------------------------------------------------------
*/

const calculateSaleProfit = (sale) => {
  return (sale.items || []).reduce(
    (sum, item) => {
      const sellingPrice =
        Number(item.sellingPrice) || 0;

      const purchasePrice =
        Number(item.purchasePrice) || 0;

      const quantity =
        Number(item.quantity) || 0;

      return (
        sum +
        (sellingPrice - purchasePrice) * quantity
      );
    },
    0
  );
};


/*
|--------------------------------------------------------------------------
| 1. REPORT SUMMARY
|--------------------------------------------------------------------------
|
| GET /reports/summary
|
|--------------------------------------------------------------------------
*/

export const getReportSummary = async (
  req,
  res
) => {
  try {
    const sales = await getSalesForPeriod(req);

    let totalSales = 0;
    let totalProfit = 0;
    let medicinesSold = 0;

    const paymentBreakdown = {
      cash: 0,
      easypaisa: 0,
      jazzcash: 0,
      bankTransfer: 0,
      other: 0,
    };

    sales.forEach((sale) => {
      totalSales += Number(sale.total) || 0;

      totalProfit += calculateSaleProfit(sale);

      // Total quantity of medicines sold
      (sale.items || []).forEach((item) => {
        medicinesSold +=
          Number(item.quantity) || 0;
      });

      // Payment breakdown
      const paymentMethod =
        String(
          sale.paymentMethod || "other"
        ).toLowerCase();

      const amount =
        Number(sale.total) || 0;

      if (paymentMethod === "cash") {
        paymentBreakdown.cash += amount;
      } else if (
        paymentMethod === "easypaisa"
      ) {
        paymentBreakdown.easypaisa += amount;
      } else if (
        paymentMethod === "jazzcash"
      ) {
        paymentBreakdown.jazzcash += amount;
      } else if (
        paymentMethod === "banktransfer" ||
        paymentMethod === "bank_transfer"
      ) {
        paymentBreakdown.bankTransfer += amount;
      } else {
        paymentBreakdown.other += amount;
      }
    });

    return res.status(200).json({
      success: true,

      data: {
        totalSales,
        totalOrders: sales.length,
        totalProfit,
        medicinesSold,
        paymentBreakdown,
      },
    });
  } catch (error) {
    console.error(
      "Report summary error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to load report summary",
    });
  }
};


/*
|--------------------------------------------------------------------------
| 2. SALES TREND
|--------------------------------------------------------------------------
|
| GET /reports/sales-trend
|
|--------------------------------------------------------------------------
*/

export const getSalesTrend = async (req, res) => {
  try {
    const sales = await getSalesForPeriod(req);

    const dailySales = {};

    sales.forEach((sale) => {
      // Make sure the sale has a valid date
      if (!sale.date) {
        return;
      }

      const saleDate = new Date(sale.date);

      // Skip invalid dates
      if (Number.isNaN(saleDate.getTime())) {
        console.warn(
          "Skipping sale with invalid date:",
          sale._id
        );
        return;
      }

      const date = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Karachi",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(saleDate);

      if (!dailySales[date]) {
        dailySales[date] = 0;
      }

      dailySales[date] += Number(sale.total) || 0;
    });

    const result = Object.entries(dailySales)
      .sort(([dateA], [dateB]) =>
        dateA.localeCompare(dateB)
      )
      .map(([date, sales]) => ({
        date,
        sales,
      }));

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Sales trend error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load sales trend",
    });
  }
};



/*
|--------------------------------------------------------------------------
| 3. TOP SELLING MEDICINES
|--------------------------------------------------------------------------
|
| GET /reports/top-medicines
|
|--------------------------------------------------------------------------
*/

export const getTopMedicines = async (req, res) => {
  try {
    const sales = await getSalesForPeriod(req);

    const medicineMap = {};

    sales.forEach((sale) => {
      (sale.items || []).forEach((item) => {
        const medicineName =
          item.medicineName ||
          item.name ||
          "Unknown";

        const quantity =
          Number(item.quantity) || 0;

        if (!medicineMap[medicineName]) {
          medicineMap[medicineName] = 0;
        }

        medicineMap[medicineName] += quantity;
      });
    });

    const result = Object.entries(medicineMap)
      .map(([medicineName, quantitySold]) => ({
        medicineName,
        quantitySold,
      }))
      .sort(
        (a, b) =>
          b.quantitySold - a.quantitySold
      );

    // ---------------------------------------
    // No medicines sold in selected period
    // ---------------------------------------

    if (result.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No medicines were sold in the selected period.",
        data: [],
      });
    }

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error(
      "Top medicines error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to load top selling medicines",
    });
  }
};


/*
|--------------------------------------------------------------------------
| 4. SALES REPORT
|--------------------------------------------------------------------------
|
| GET /reports/sales
|
| Returns detailed sales records.
|--------------------------------------------------------------------------
*/

export const getSalesReport = async (
  req,
  res
) => {
  try {
    const sales = await getSalesForPeriod(req);

    const result = sales.map((sale) => ({
      id: sale._id,
      invoiceNumber: sale.invoiceNumber,
      studentName: sale.studentName,

      date: sale.date,
      createdAt: sale.createdAt,

      subtotal:
        Number(sale.subtotal) || 0,

      discount:
        Number(sale.discount) || 0,

      total:
        Number(sale.total) || 0,

      profit:
        calculateSaleProfit(sale),

      paymentMethod:
        sale.paymentMethod || "other",

      hostelNumber:
        sale.hostelNumber || null,

      items: sale.items || [],
    }));

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error(
      "Sales report error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to load sales report",
    });
  }
};


/*
|--------------------------------------------------------------------------
| 5. MEDICINE SALES REPORT
|--------------------------------------------------------------------------
|
| GET /reports/medicine-sales
|--------------------------------------------------------------------------
*/

export const getMedicineSalesReport = async (
  req,
  res
) => {
  try {
    const sales = await getSalesForPeriod(req);

    const medicineMap = {};

    sales.forEach((sale) => {
      (sale.items || []).forEach((item) => {
        const medicineName =
          item.medicineName ||
          item.name ||
          "Unknown";

        const quantity =
          Number(item.quantity) || 0;

        const sellingPrice =
          Number(item.sellingPrice) || 0;

        const purchasePrice =
          Number(item.purchasePrice) || 0;

        if (!medicineMap[medicineName]) {
          medicineMap[medicineName] = {
            medicineName,
            quantitySold: 0,
            totalSales: 0,
            totalProfit: 0,
          };
        }

        medicineMap[medicineName]
          .quantitySold += quantity;

        medicineMap[medicineName]
          .totalSales +=
          sellingPrice * quantity;

        medicineMap[medicineName]
          .totalProfit +=
          (sellingPrice - purchasePrice) *
          quantity;
      });
    });

    const result = Object.values(
      medicineMap
    ).sort(
      (a, b) =>
        b.quantitySold - a.quantitySold
    );

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error(
      "Medicine sales report error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to load medicine sales report",
    });
  }
};


/*
|--------------------------------------------------------------------------
| 6. STOCK REPORT
|--------------------------------------------------------------------------
|
| GET /reports/stock
|--------------------------------------------------------------------------
*/

export const getStockReport = async (
  req,
  res
) => {
  try {
    const medicines = await Medicine.find({
      isActive: true,
    })
      .select(
        "name stock minimumStock"
      )
      .sort({ stock: 1 })
      .lean();

    const result = medicines.map(
      (medicine) => {
        let stockStatus = "In Stock";

        if (medicine.stock <= 0) {
          stockStatus = "Out of Stock";
        } else if (
          medicine.stock <=
          medicine.minimumStock
        ) {
          stockStatus = "Low Stock";
        }

        return {
          medicine: medicine.name,
          currentStock:
            Number(medicine.stock) || 0,
          minimumStock:
            Number(medicine.minimumStock) || 0,
          stockStatus,
        };
      }
    );

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error(
      "Stock report error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to load stock report",
    });
  }
};


/*
|--------------------------------------------------------------------------
| 7. HOSTEL SALES REPORT
|--------------------------------------------------------------------------
|
| GET /reports/hostel-sales
|--------------------------------------------------------------------------
*/

export const getHostelSalesReport = async (
  req,
  res
) => {
  try {
    const sales = await getSalesForPeriod(req);

    const hostelMap = {};

    sales.forEach((sale) => {
      const hostel =
        sale.hostelNumber ||
        "Unknown";

      const total =
        Number(sale.total) || 0;

      if (!hostelMap[hostel]) {
        hostelMap[hostel] = {
          hostelNumber: hostel,
          totalSales: 0,
          totalOrders: 0,
        };
      }

      hostelMap[hostel].totalSales += total;
      hostelMap[hostel].totalOrders += 1;
    });

    const result = Object.values(
      hostelMap
    ).sort(
      (a, b) =>
        b.totalSales - a.totalSales
    );

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error(
      "Hostel sales report error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to load hostel sales report",
    });
  }
};


/*
|--------------------------------------------------------------------------
| 8. PAYMENT REPORT
|--------------------------------------------------------------------------
|
| GET /reports/payment
|--------------------------------------------------------------------------
*/

export const getPaymentReport = async (
  req,
  res
) => {
  try {
    const sales = await getSalesForPeriod(req);

    const payment = {
      cash: 0,
      easypaisa: 0,
      jazzcash: 0,
      bank_transfer: 0,
      other: 0,
    };

    sales.forEach((sale) => {
      const method = String(
        sale.paymentMethod || "other"
      ).toLowerCase();

      const amount =
        Number(sale.total) || 0;

      if (method === "cash") {
        payment.cash += amount;
      } else if (
        method === "easypaisa"
      ) {
        payment.easypaisa += amount;
      } else if (
        method === "jazzcash"
      ) {
        payment.jazzcash += amount;
      } else if (
        method === "banktransfer" ||
        method === "bank_transfer"
      ) {
        payment.bank_transfer += amount;
      } else {
        payment.other += amount;
      }
    });

    return res.status(200).json({
      success: true,
      data: payment,
    });
  } catch (error) {
    console.error(
      "Payment report error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to load payment report",
    });
  }
};
