/**
 * A simple in-memory cache utility for server-side caching
 */

// In-memory cache store
const cacheStore = new Map();

// Cache configuration with different expiration times by data type
const CACHE_CONFIG = {
  // Static GTFS data (trips, stops, routes, etc.) - cache for a long time
  staticData: {
    ttl: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  },
  // Calendar data - cache until the end of the current day
  calendarData: {
    // Calculate TTL to end of current day
    ttl: () => {
      const now = new Date();
      const endOfDay = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        23,
        59,
        59,
        999,
      );
      return endOfDay.getTime() - now.getTime();
    },
  },
  // Dynamic data (like current service calendar) - shorter cache time
  dynamicData: {
    ttl: 15 * 60 * 1000, // 15 minutes in milliseconds
  },
  // Default cache settings
  default: {
    ttl: 60 * 60 * 1000, // 1 hour in milliseconds
  },
};

/**
 * Set a value in the cache
 * @param {string} key - The cache key
 * @param {any} value - The value to cache
 * @param {string} type - The cache type (staticData, dynamicData, calendarData, default)
 */
export function set(key, value, type = 'default') {
  const config = CACHE_CONFIG[type] || CACHE_CONFIG.default;
  const ttl = typeof config.ttl === 'function' ? config.ttl() : config.ttl;
  const expiresAt = Date.now() + ttl;

  cacheStore.set(key, {
    value,
    expiresAt,
  });
}

/**
 * Get a value from the cache
 * @param {string} key - The cache key
 * @returns {any|null} The cached value or null if not found/expired
 */
export function get(key) {
  const cachedItem = cacheStore.get(key);

  // If item doesn't exist
  if (!cachedItem) {
    return null;
  }

  // If item is expired
  if (Date.now() > cachedItem.expiresAt) {
    cacheStore.delete(key);
    return null;
  }

  return cachedItem.value;
}

/**
 * Clear all cache or a specific item
 * @param {string|null} key - Specific key to clear, or all if null
 */
export function clear(key = null) {
  if (key) {
    cacheStore.delete(key);
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Cache] Cleared: ${key}`);
    }
  } else {
    cacheStore.clear();
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Cache] Cleared all items`);
    }
  }
}

/**
 * Get cache stats (useful for debugging)
 * @returns {object} Cache statistics
 */
export function getStats() {
  const stats = {
    totalItems: cacheStore.size,
    itemsByType: {
      valid: 0,
      expired: 0,
    },
    keys: [],
  };

  const now = Date.now();
  for (const [key, item] of cacheStore.entries()) {
    if (now > item.expiresAt) {
      stats.itemsByType.expired++;
    } else {
      stats.itemsByType.valid++;
    }
    stats.keys.push(key);
  }

  return stats;
}
