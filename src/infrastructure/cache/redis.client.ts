import { createClient } from "redis";
import { ENV } from "../../config/env";

/**
 * Redis is used for:
 * - email existence caching
 * - refresh token storage
 * - rate limiting
 */

export const redisClient = createClient({
  url: ENV.REDIS_URL,
});

redisClient.on("error", (err) => {
  console.error("Redis error", err);
});

export const connectRedis = async () => {
  await redisClient.connect();
  console.log("Redis connected");
};