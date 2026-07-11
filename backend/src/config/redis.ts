import { Redis } from "ioredis";

export const redisConnection = new Redis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null,
});

redisConnection.on("connect", () => console.log("Redis connected"));
redisConnection.on("error", (error) => console.log("Redis error", error));
