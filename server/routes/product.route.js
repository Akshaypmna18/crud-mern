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
const { clearCacheForWrite } = require("../middleware/cache.js");

const router = express.Router();

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products with pagination
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of products per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for name or image
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [name, price, quantity, createdAt]
 *           default: createdAt
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                       example: 1
 *                     totalPages:
 *                       type: integer
 *                       example: 10
 *                     totalCount:
 *                       type: integer
 *                       example: 100
 *                     hasNextPage:
 *                       type: boolean
 *                       example: true
 *                     hasPrevPage:
 *                       type: boolean
 *                       example: false
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/", getProducts);

/**
 * @swagger
 * /products/kpi:
 *   get:
 *     summary: Get key performance indicators
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: KPIs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalProducts:
 *                       type: integer
 *                       example: 100
 *                     totalValue:
 *                       type: number
 *                       example: 50000.50
 *                     totalUnits:
 *                       type: integer
 *                       example: 1000
 *                     averagePrice:
 *                       type: number
 *                       example: 250.25
 *                     averageQuantity:
 *                       type: number
 *                       example: 10.5
 *                 generatedAt:
 *                   type: string
 *                   format: date-time
 *       500:
 *         description: Internal server error
 */
router.get("/kpi", getKPIs);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get a single product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       400:
 *         description: Invalid product ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:id", validateObjectId, handleValidationErrors, getSingleProduct);

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, quantity, price, image]
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 example: iPhone 15 Pro
 *               quantity:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 10000
 *                 example: 50
 *               price:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 999999.99
 *                 example: 999.99
 *               image:
 *                 type: string
 *                 format: uri
 *                 example: https://example.com/image.jpg
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Product created successfully
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 */
router.post(
  "/",
  validateProduct,
  handleValidationErrors,
  clearCacheForWrite(), // Clear cache after successful creation
  createProduct
);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 example: iPhone 15 Pro Max
 *               quantity:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 10000
 *                 example: 25
 *               price:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 999999.99
 *                 example: 1199.99
 *               image:
 *                 type: string
 *                 format: uri
 *                 example: https://example.com/new-image.jpg
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Product updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
router.put(
  "/:id",
  validateObjectId,
  validateProductUpdate,
  handleValidationErrors,
  clearCacheForWrite(), // Clear cache after successful update
  updateProduct
);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Product deleted successfully
 *       404:
 *         description: Product not found
 *       400:
 *         description: Invalid product ID
 *       500:
 *         description: Internal server error
 */
router.delete(
  "/:id",
  validateObjectId,
  handleValidationErrors,
  clearCacheForWrite(), // Clear cache after successful deletion
  deleteProduct
);

module.exports = router;

/**

 * @swagger

 * /products:

 *   post:

 *     summary: Create a new product

 *     tags: [Products]

 *     requestBody:

 *       required: true

 *       content:

 *         application/json:

 *           schema:

 *             type: object

 *             required: [name, quantity, price, image]

 *             properties:

 *               name:

 *                 type: string

 *                 minLength: 2

 *                 maxLength: 100

 *                 example: iPhone 15 Pro

 *               quantity:

 *                 type: integer

 *                 minimum: 0

 *                 maximum: 10000

 *                 example: 50

 *               price:

 *                 type: number

 *                 minimum: 0

 *                 maximum: 999999.99

 *                 example: 999.99

 *               image:

 *                 type: string

 *                 format: uri

 *                 example: https://example.com/image.jpg

 *     responses:

 *       201:

 *         description: Product created successfully

 *         content:

 *           application/json:

 *             schema:

 *               type: object

 *               properties:

 *                 success:

 *                   type: boolean

 *                   example: true

 *                 message:

 *                   type: string

 *                   example: Product created successfully

 *                 data:

 *                   $ref: '#/components/schemas/Product'

 *       400:

 *         description: Validation error

 *         content:

 *           application/json:

 *             schema:

 *               $ref: '#/components/schemas/Error'

 *       500:

 *         description: Internal server error

 */

router.post(
  "/",

  validateProduct,

  handleValidationErrors,

  clearCacheForWrite(),

  createProduct
);

/**

 * @swagger

 * /products/{id}:

 *   put:

 *     summary: Update a product by ID

 *     tags: [Products]

 *     parameters:

 *       - in: path

 *         name: id

 *         required: true

 *         schema:

 *           type: string

 *           pattern: '^[0-9a-fA-F]{24}$'

 *         description: Product ID

 *     requestBody:

 *       required: true

 *       content:

 *         application/json:

 *           schema:

 *             type: object

 *             properties:

 *               name:

 *                 type: string

 *                 minLength: 2

 *                 maxLength: 100

 *                 example: iPhone 15 Pro Max

 *               quantity:

 *                 type: integer

 *                 minimum: 0

 *                 maximum: 10000

 *                 example: 25

 *               price:

 *                 type: number

 *                 minimum: 0

 *                 maximum: 999999.99

 *                 example: 1199.99

 *               image:

 *                 type: string

 *                 format: uri

 *                 example: https://example.com/new-image.jpg

 *     responses:

 *       200:

 *         description: Product updated successfully

 *         content:

 *           application/json:

 *             schema:

 *               type: object

 *               properties:

 *                 success:

 *                   type: boolean

 *                   example: true

 *                 message:

 *                   type: string

 *                   example: Product updated successfully

 *                 data:

 *                   $ref: '#/components/schemas/Product'

 *       404:

 *         description: Product not found

 *       400:

 *         description: Validation error

 *       500:

 *         description: Internal server error

 */

router.put(
  "/:id",

  validateObjectId,

  validateProductUpdate,

  handleValidationErrors,

  clearCacheForWrite(),

  updateProduct
);

/**

 * @swagger

 * /products/{id}:

 *   delete:

 *     summary: Delete a product by ID

 *     tags: [Products]

 *     parameters:

 *       - in: path

 *         name: id

 *         required: true

 *         schema:

 *           type: string

 *           pattern: '^[0-9a-fA-F]{24}$'

 *         description: Product ID

 *     responses:

 *       200:

 *         description: Product deleted successfully

 *         content:

 *           application/json:

 *             schema:

 *               type: object

 *               properties:

 *                 success:

 *                   type: boolean

 *                   example: true

 *                 message:

 *                   type: string

 *                   example: Product deleted successfully

 *       404:

 *         description: Product not found

 *       400:

 *         description: Invalid product ID

 *       500:

 *         description: Internal server error

 */

router.delete(
  "/:id",

  validateObjectId,

  handleValidationErrors,

  clearCacheForWrite(),

  deleteProduct
);

module.exports = router;
