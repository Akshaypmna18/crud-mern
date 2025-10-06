const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const compression = require("compression");
require("dotenv").config();

const ProductRoutes = require("./routes/product.route.js");
const { cacheMiddleware } = require("./middleware/cache.js");
const { errorHandler } = require("./utils/errorHandler");
const requestLogger = require("./utils/requestLogger");
const logger = require("./utils/logger");
const { swaggerUi, specs } = require("./docs/swagger.js");

const app = express();

app.use(helmet());

// Compression middleware (should be early in the stack)
app.use(compression());

app.use(logger.addRequestId);
app.use(requestLogger);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [
  "http://localhost:3000",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Swagger documentation
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, {
    explorer: true,
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "CRUD MERN API Documentation",
  })
);

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.log("⚠️  MONGO_URI not found in environment variables");
      console.log(
        "📝 Please create a .env file with your MongoDB connection string"
      );
      console.log("📝 Example: MONGO_URI=mongodb://localhost:27017/crud-mern");
      console.log(
        "📝 The server will continue without database connection for testing"
      );
      return;
    }

    await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 2000, // Reduced from 5s to 2s for faster failures
      socketTimeoutMS: 30000, // Reduced from 45s to 30s
      bufferCommands: true, // Enable buffering for better performance
      connectTimeoutMS: 10000, // 10 second connection timeout
    });
    console.log("✅ Connected to MongoDB!");
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    console.log("📝 Please check your MongoDB connection string in .env file");
    console.log(
      "📝 The server will continue without database connection for testing"
    );
  }
};

connectDB();

// Routes with caching
app.use("/products", cacheMiddleware(300), ProductRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.version,
    requestId: req.requestId,
  });
});

// Cache status endpoint (for debugging)
app.get("/cache-status", (req, res) => {
  const { cache } = require("./middleware/cache.js");
  const keys = cache.keys();
  const cacheData = {};

  keys.forEach((key) => {
    const data = cache.get(key);
    cacheData[key] = {
      exists: !!data,
      timestamp: data?.cacheTimestamp || "unknown",
      ttl: cache.getTtl(key) || "unknown",
    };
  });

  res.status(200).json({
    cacheKeys: keys,
    cacheData,
    totalKeys: keys.length,
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    requestId: req.requestId,
  });
});

// Global error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
  logger.info(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
});
