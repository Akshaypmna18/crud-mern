const logger = require("../utils/logger");

const requestLogger = (req, res, next) => {
  const start = Date.now();

  // Log request
  logger.info({
    message: "Request received",
    requestId: req.requestId,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
    contentLength: req.get("Content-Length") || 0,
  });

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

    // Log based on status code
    if (res.statusCode >= 400) {
      logger.error(logData);
    } else {
      logger.info(logData);
    }
  });

  next();
};

module.exports = requestLogger;
