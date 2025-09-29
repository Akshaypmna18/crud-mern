const Product = require("../models/product.model.js");
const { NotFoundError, DatabaseError } = require("../utils/AppError");
const { catchAsync } = require("../middleware/errorHandler");
const logger = require("../utils/logger");

const getProducts = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sortBy = req.query.sortBy || "createdAt";
  const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
  const search = req.query.search || "";

  const skip = (page - 1) * limit;
  const query = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { image: { $regex: search, $options: "i" } },
    ];
  }

  const sort = {};
  sort[sortBy] = sortOrder;

  const [products, totalCount] = await Promise.all([
    Product.find(query).sort(sort).skip(skip).limit(limit).lean(),
    Product.countDocuments(query),
  ]);

  const totalPages = Math.ceil(totalCount / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  res.status(200).json({
    success: true,
    data: products,
    pagination: {
      currentPage: page,
      totalPages,
      totalCount,
      limit,
      hasNextPage,
      hasPrevPage,
      nextPage: hasNextPage ? page + 1 : null,
      prevPage: hasPrevPage ? page - 1 : null,
    },
    filters: {
      search,
      sortBy,
      sortOrder,
    },
  });
});

const getSingleProduct = catchAsync(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id).lean();

  if (!product) {
    throw new NotFoundError("Product not found");
  }

  res.status(200).json({
    success: true,
    data: product,
  });
});

const createProduct = catchAsync(async (req, res) => {
  const product = await Product.create(req.body);

  logger.info({
    message: "Product created",
    requestId: req.requestId,
    productId: product._id,
    productName: product.name,
  });

  res.status(201).json({
    success: true,
    message: "Product created successfully",
    data: product,
  });
});

const updateProduct = catchAsync(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    throw new NotFoundError("Product not found");
  }

  logger.info({
    message: "Product updated",
    requestId: req.requestId,
    productId: product._id,
    productName: product.name,
  });

  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    data: product,
  });
});

const deleteProduct = catchAsync(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findByIdAndDelete(id);

  if (!product) {
    throw new NotFoundError("Product not found");
  }

  logger.info({
    message: "Product deleted",
    requestId: req.requestId,
    productId: id,
    productName: product.name,
  });

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});

module.exports = {
  getProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
