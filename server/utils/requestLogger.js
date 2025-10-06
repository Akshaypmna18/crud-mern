const logger = require("../utils/logger");

const requestLogger = (req, res, next) => {
  const start = Date.now();

  // Skip detailed logging for write operations in production
  const isWriteOperation = ["POST", "PUT", "DELETE"].includes(req.method);
  const isProduction = process.env.NODE_ENV === "production";

  // Log request (simplified for write operations)
  if (!isWriteOperation || !isProduction) {
    logger.info({
      message: "Request received",
      requestId: req.requestId,
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      userAgent: req.get("User-Agent"),
      contentLength: req.get("Content-Length") || 0,
    });
  }

  // Log response when finished
  res.on("finish", () => {
    const duration = Date.now() - start;
    const contentLength = res.get("Content-Length") || 0;

    const logData = {
      message: "Request completed",
      requestId: req.requestId,
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      contentLength: contentLength,
      ip: req.ip,
    };

    // Always log errors, but reduce logging for successful write operations
    if (res.statusCode >= 400) {
      logger.error(logData);
    } else if (!isWriteOperation || !isProduction || res.statusCode >= 300) {
      logger.info(logData);
    }
  });

  next();
};

module.exports = requestLogger;
