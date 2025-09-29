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

const router = express.Router();

// Apply validation to routes
router.get("/", getProducts);
router.get("/kpi", getKPIs);
router.get("/:id", validateObjectId, handleValidationErrors, getSingleProduct);
router.post("/", validateProduct, handleValidationErrors, createProduct);
router.put(
  "/:id",
  validateObjectId,
  validateProductUpdate,
  handleValidationErrors,
  updateProduct
);
router.delete("/:id", validateObjectId, handleValidationErrors, deleteProduct);

module.exports = router;
