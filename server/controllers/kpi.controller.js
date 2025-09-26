const Product = require("../models/product.model.js");

const getKPIs = async (req, res) => {
  try {
    const products = await Product.find({});

    const totalProducts = products.length;

    const totalValue = products.reduce((sum, product) => {
      return sum + product.price * product.quantity;
    }, 0);

    const totalUnits = products.reduce((sum, product) => {
      return sum + product.quantity;
    }, 0);

    const kpiData = {
      totalProducts,
      totalValue,
      totalUnits,
    };

    res.status(200).json(kpiData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getKPIs,
};
