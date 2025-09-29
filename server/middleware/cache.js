const NodeCache = require("node-cache");

// Create cache instance with 5-minute TTL
const cache = new NodeCache({
  stdTTL: 300, // 5 minutes
  checkperiod: 60, // Check for expired keys every minute
  useClones: false, // Don't clone objects for better performance
});

// Cache middleware for GET requests
const cacheMiddleware = (duration = 300) => {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== "GET") {
      return next();
    }

    const key = req.originalUrl;
    const cachedData = cache.get(key);

    if (cachedData) {
      console.log("📦 Cache hit for:", key);
      return res.json({
        ...cachedData,
        cached: true,
        cacheTimestamp: new Date().toISOString(),
      });
    }

    // Store original res.json
    const originalJson = res.json;

    // Override res.json to cache the response
    res.json = function (data) {
      // Cache successful responses only
      if (res.statusCode === 200) {
        cache.set(key, data, duration);
        console.log("💾 Cached response for:", key);
      }
      return originalJson.call(this, data);
    };

    next();
  };
};

// Clear cache for specific patterns
const clearCache = (pattern) => {
  const keys = cache.keys();
  const regex = new RegExp(pattern);

  keys.forEach((key) => {
    if (regex.test(key)) {
      cache.del(key);
      console.log("🗑️ Cleared cache for:", key);
    }
  });
};

module.exports = {
  cacheMiddleware,
  clearCache,
  cache,
};
