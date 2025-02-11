import { Request, Response, NextFunction } from 'express';
import redisClient from '../config/redis';

// Cache duration in seconds
const CACHE_DURATION = 3600; // 1 hour in seconds

export const cacheMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const key = `cache:${req.originalUrl}`;
    
    // Try to get cached data
    const cachedData = await redisClient.get(key);
    
    if (cachedData) {
      // If we have cached data, send it
      console.log('Serving from cache');
      return res.json(JSON.parse(cachedData));
    }

    // Store the original res.json function
    const originalJson = res.json;
    
    // Override res.json to cache the response before sending
    res.json = function (data) {
      // Store the data in Redis
      redisClient.setEx(key, CACHE_DURATION, JSON.stringify(data))
        .catch(console.error);
        
      // Call the original json function
      return originalJson.call(this, data);
    };

    next();
  } catch (error) {
    console.error('Cache middleware error:', error);
    next();
  }
};

// Function to clear cache when data is updated
export const clearCache = async (pattern: string) => {
  try {
    const keys = await redisClient.keys(`cache:${pattern}`);
    if (keys.length > 0) {
      await redisClient.del(keys);
      console.log('Cache cleared for pattern:', pattern);
    }
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
}; 