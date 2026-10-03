import Sale from "../models/Sale.model.js";
import Medicine from "../models/Medicine.model.js";

const getDashboard = async (req, res) => {
  try {
    const now = new Date();

    const pakistanDate = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Karachi",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(now);

    const startOfDay = new Date(
      `${pakistanDate}T00:00:00+05:00`
    );

    const endOfDay = new Date(
      `${pakistanDate}T23:59:59.999+05:00`
    );

    const todaySales = await Sale.find({
      createdAt: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    })
      .sort({ createdAt: -1 })
      .lean();

    const allSales = await Sale.find({})
      .select("total items")
      .lean();

    let totalRevenue = 0;
    let totalProfit = 0;

    allSales.forEach((sale) => {
      totalRevenue += Number(sale.total) || 0;

      const saleProfit = (sale.items || []).reduce(
        (sum, item) => {
          const sellingPrice = Number(item.sellingPrice) || 0;
          const purchasePrice = Number(item.purchasePrice) || 0;
          const quantity = Number(item.quantity) || 0;

          return (
            sum +
            (sellingPrice - purchasePrice) * quantity
          );
        },
        0
      );

      totalProfit += saleProfit;
    });

    const recentSales = todaySales.slice(0, 5).map((sale) => {
      const itemCount = (sale.items || []).reduce(
        (sum, item) =>
          sum + (Number(item.quantity) || 0),
        0
      );

      const saleProfit = (sale.items || []).reduce(
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

      const time = new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Karachi",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }).format(new Date(sale.createdAt));

      return {
        invoiceNumber: sale.invoiceNumber,
        name: sale.name,
        date: sale.date,
        time,
        items: itemCount,
        total: Number(sale.total) || 0,
        profit: saleProfit,
      };
    });

    const recentMedicines = await Medicine.find({
      isActive: true,
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name category stock minimumStock createdAt")
      .lean();

    const lowStockMedicines = await Medicine.find({
      isActive: true,
      stock: { $gt: 0 },
      $expr: {
        $lte: ["$stock", "$minimumStock"],
      },
    })
      .sort({ stock: 1 })
      .select("name stock minimumStock")
      .lean();

    const outOfStockMedicines = await Medicine.find({
      isActive: true,
      stock: 0,
    })
      .sort({ name: 1 })
      .select("name stock minimumStock")
      .lean();

    return res.status(200).json({
      success: true,
      data: {
        date: pakistanDate,

        overall: {
          totalRevenue,
          totalProfit,
          totalLowStockMedicines:
            lowStockMedicines.length,
          totalOutOfStockMedicines:
            outOfStockMedicines.length,
        },

        today: {
          totalSales: todaySales.length,
        },

        recentSales,
        recentMedicines,
        lowStockMedicines,
        outOfStockMedicines,
      },
    });
  } catch (error) {
    console.error("Dashboard error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load dashboard",
      error: error.message,
    });
  }
};

export { getDashboard };