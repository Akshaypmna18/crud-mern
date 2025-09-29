const Product = require("../models/product.model.js");

const getKPIs = async (req, res) => {
  try {
    // Use MongoDB aggregation pipeline for better performance
    const kpiData = await Product.aggregate([
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          totalValue: {
            $sum: {
              $multiply: ["$price", "$quantity"],
            },
          },
          totalUnits: { $sum: "$quantity" },
          averagePrice: { $avg: "$price" },
          averageQuantity: { $avg: "$quantity" },
        },
      },
      {
        $project: {
          _id: 0,
          totalProducts: 1,
          totalValue: { $round: ["$totalValue", 2] },
          totalUnits: 1,
          averagePrice: { $round: ["$averagePrice", 2] },
          averageQuantity: { $round: ["$averageQuantity", 2] },
        },
      },
    ]);

    // If no products exist, return default values
    const result =
      kpiData.length > 0
        ? kpiData[0]
        : {
            totalProducts: 0,
            totalValue: 0,
            totalUnits: 0,
            averagePrice: 0,
            averageQuantity: 0,
          };

    res.status(200).json({
      success: true,
      data: result,
      generatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Error fetching KPIs:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  getKPIs,
};
