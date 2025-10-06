const { body, param, validationResult } = require("express-validator");

// Validation rules for product creation
const validateProduct = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Product name must be between 2 and 100 characters")
    .escape()
    .withMessage("Invalid characters in product name"),

  body("quantity")
    .isInt({ min: 0, max: 10000 })
    .withMessage("Quantity must be a positive integer between 0 and 10000"),

  body("price")
    .isFloat({ min: 0, max: 999999.99 })
    .withMessage("Price must be a positive number between 0 and 999999.99"),

  body("image").isURL().withMessage("Image must be a valid URL").trim(),
];

// Validation rules for product updates
const validateProductUpdate = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Product name must be between 2 and 100 characters")
    .escape(),

  body("quantity")
    .optional()
    .isInt({ min: 0, max: 10000 })
    .withMessage("Quantity must be a positive integer between 0 and 10000"),

  body("price")
    .optional()
    .isFloat({ min: 0, max: 999999.99 })
    .withMessage("Price must be a positive number between 0 and 999999.99"),

  body("image")
    .optional()
    .isURL()
    .withMessage("Image must be a valid URL")
    .trim(),
];

// Validation for MongoDB ObjectId
const validateObjectId = [
  param("id").isMongoId().withMessage("Invalid product ID format"),
];

// Middleware to handle validation results
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
        value: err.value,
      })),
    });
  }
  next();
};

module.exports = {
  validateProduct,
  validateProductUpdate,
  validateObjectId,
  handleValidationErrors,
};
