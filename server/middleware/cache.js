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
      console.log(
        "📦 Cached data timestamp:",
        cachedData.cacheTimestamp || "unknown"
      );
      // Force browser to revalidate; rely on server cache for speed
      res.set({
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      });
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
        const dataToCache = {
          ...data,
          cacheTimestamp: new Date().toISOString(),
        };
        cache.set(key, dataToCache, duration);
        console.log("💾 Cached fresh response for:", key);
        console.log("💾 Cache TTL:", duration, "seconds");
        // Force browser to revalidate for fresh responses too
        res.set({
          "Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        });
      }
      return originalJson.call(this, data);
    };

    next();
  };
};

// Clear cache for specific patterns
const clearCache = (pattern) => {
  return (req, res, next) => {
    // Only clear cache for write operations
    if (req.method === "GET") {
      return next();
    }

    // Clear cache asynchronously to not block the response
    setImmediate(() => {
      const keys = cache.keys();
      const regex = new RegExp(pattern || ".*");

      let clearedCount = 0;
      keys.forEach((key) => {
        if (regex.test(key)) {
          cache.del(key);
          clearedCount++;
        }
      });

      if (clearedCount > 0) {
        console.log(`🗑️ Cleared ${clearedCount} cache entries`);
      }
    });

    next();
  };
};

// Optimized cache clearing for write operations (synchronous, avoids race after writes)
const clearCacheForWrite = (pattern = /^\/products(\/.*)?$/) => {
  return (req, res, next) => {
    if (req.method === "GET") return next();

    const keys = cache.keys();
    let clearedCount = 0;

    keys.forEach((key) => {
      if (pattern.test(key)) {
        cache.del(key);
        clearedCount++;
      }
    });

    console.log(
      clearedCount > 0
        ? `🗑️ Synchronously cleared ${clearedCount} cache entries before ${req.method}`
        : `ℹ️ No matching cache entries to clear before ${req.method}`
    );

    next();
  };
};

module.exports = {
  cacheMiddleware,
  clearCache,
  clearCacheForWrite,
  cache,
};
