import dotenv from "dotenv"
import { Redis } from "ioredis";

dotenv.config()

export const redisConnection = new Redis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null,
});

redisConnection.on("connect", () => console.log("Redis connected"));
redisConnection.on("error", (error) => console.log("Redis error", error));
