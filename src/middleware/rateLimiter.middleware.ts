import rateLimit from "express-rate-limit";

/**
 * Login rate limiter
 * Limits to 5 requests per minute per IP
 */
export const loginRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // limit each IP to 5 requests per windowMs
  message: "Too many login attempts. Please try again after a minute.",
  standardHeaders: true,
  legacyHeaders: false,
});