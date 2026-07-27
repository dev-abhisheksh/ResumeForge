import { NextFunction, Request, Response } from "express";
import { RateLimitOptions } from "../types/rateLimiter.types.js";
import { redisConnection } from "../config/redis.js";

const rateLimiter = ({ keyPrefix, limit, windowSec }: RateLimitOptions) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void | Response> => {
    try {
      const rawIp =
        (req.headers["x-forwarded-for"] as string) || req.ip || "127.0.0.1";
      const ip = rawIp.replace("::ffff:", "").split(",")[0]?.trim();

      const userId = req.user?._id;
      const identifier = userId ? `user:${userId}` : `ip:${ip}`;
      const redisKey = `rate:${keyPrefix}:${identifier}`;

      const count = await redisConnection.incr(redisKey);

      if (count === 1) await redisConnection.expire(redisKey, windowSec);

      if (count > limit) {
        return res.status(429).json({
          success: false,
          error: "Too Many Requests",
          message: `Too many requests. Please try again after ${windowSec} seconds.`,
          retryAfterSeconds: windowSec,
        });
      }

      next();
    } catch (error) {
      console.error("Rate limiter Redis error:", error);
      next();
    }
  };
};

export default rateLimiter;