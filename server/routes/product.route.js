const express = require("express");
const {
  getProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/product.controller.js");
const { getKPIs } = require("../controllers/kpi.controller.js");
const {
  validateProduct,
  validateProductUpdate,
  validateObjectId,
  handleValidationErrors,
} = require("../middleware/validation.js");
const { clearCache } = require("../middleware/cache.js");

const router = express.Router();

// Cache clearing middleware for write operations
const clearCacheMiddleware = (req, res, next) => {
  // Clear cache after successful write operations
  const originalJson = res.json;
  res.json = function (data) {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      clearCache("/products");
    }
    return originalJson.call(this, data);
  };
  next();
};

// Apply validation to routes
router.get("/", getProducts);
router.get("/kpi", getKPIs);
router.get("/:id", validateObjectId, handleValidationErrors, getSingleProduct);
router.post(
  "/",
  validateProduct,
  handleValidationErrors,
  clearCacheMiddleware,
  createProduct
);
router.put(
  "/:id",
  validateObjectId,
  validateProductUpdate,
  handleValidationErrors,
  clearCacheMiddleware,
  updateProduct
);
router.delete(
  "/:id",
  validateObjectId,
  handleValidationErrors,
  clearCacheMiddleware,
  deleteProduct
);

module.exports = router;
