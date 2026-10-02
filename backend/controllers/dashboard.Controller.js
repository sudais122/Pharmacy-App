
import Sale from "../models/Sale.model.js";
import Medicine from "../models/Medicine.model.js";

// Dashboard

export const getDashboard = async (req, res) => {
  try {
    // Get today's date in Pakistan timezone

    const pakistanDate = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Karachi",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());

    const startOfToday = new Date(
      `${pakistanDate}T00:00:00+05:00`
    );

    const endOfToday = new Date(
      `${pakistanDate}T23:59:59.999+05:00`
    );

    // TODAY'S SALES

    const todaySales = await Sale.find({
      createdAt: {
        $gte: startOfToday,
        $lte: endOfToday,
      },
    })
      .sort({ createdAt: -1 })
      .lean();

    // CALCULATE TODAY'S REVENUE & PROFIT

    let totalRevenue = 0;
    let totalProfit = 0;

    todaySales.forEach((sale) => {
      const invoiceTotal = Number(sale.total) || 0;

      totalRevenue += invoiceTotal;

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

      totalProfit += saleProfit;
    });

    // RECENT 5 SALES

    const recentSales = todaySales
      .slice(0, 5)
      .map((sale) => {
        const profit = (sale.items || []).reduce(
          (sum, item) => {
            const sellingPrice =
              Number(item.sellingPrice) || 0;

            const purchasePrice =
              Number(item.purchasePrice) || 0;

            const quantity =
              Number(item.quantity) || 0;

            return (
              sum +
              (sellingPrice - purchasePrice) *
                quantity
            );
          },
          0
        );

        const time = new Intl.DateTimeFormat("en-GB", {
          timeZone: "Asia/Karachi",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).format(new Date(sale.createdAt));

        return {
          invoiceNumber: sale.invoiceNumber,
          studentName: sale.studentName,
          time,
          total: Number(sale.total) || 0,
          profit,
        };
      });

    // RECENT 5 MEDICINES

    const recentMedicines = await Medicine.find({
      isActive: true,
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .select(
        "name category stock minimumStock createdAt"
      )
      .lean();

    // LOW STOCK MEDICINES


    const lowStockMedicines = await Medicine.find({
      isActive: true,
      $expr: {
        $lte: ["$stock", "$minimumStock"],
      },
    })
      .select("name stock minimumStock")
      .sort({ stock: 1 })
    // TOTAL LOW STOCK MEDICINES
    const totalLowStockMedicines =
      lowStockMedicines.length;

    // FINAL RESPONSE

    return res.status(200).json({
      success: true,

      data: {
        date: pakistanDate,

        // Today's statistics
        today: {
          totalSales: todaySales.length,
          totalRevenue,
          totalProfit,
        },

        // Low stock count
        totalLowStockMedicines,

        // Latest 5 sales
        recentSales,

        // Latest 5 medicines
        recentMedicines,

        // Low stock + out of stock medicines
        lowStockMedicines,
      },
    });
  } catch (error) {
    console.error("Dashboard error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load dashboard",
    });
  }
};
