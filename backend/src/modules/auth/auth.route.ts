import express from "express";
import {
  getMe,
  loginUser,
  logoutUser,
  refreshTokenRotation,
  registerUser,
} from "./auth.controller.js";
import { verifyToken } from "../../middlewares/auth.middleware.js";
import rateLimiter from "../../middlewares/rateLimiter.middleware.js";

const router = express.Router();

// Strict Rate Limiting: 5 attempts per 15 minutes for Register & Login
router.post(
  "/register",
  rateLimiter({ keyPrefix: "auth-register", limit: 5, windowSec: 900 }),
  registerUser,
);

router.post(
  "/login",
  rateLimiter({ keyPrefix: "auth-login", limit: 5, windowSec: 900 }),
  loginUser,
);

router.get("/me", verifyToken, getMe);

router.get(
  "/refresh-token",
  rateLimiter({ keyPrefix: "auth-refresh", limit: 20, windowSec: 900 }),
  refreshTokenRotation,
);

router.post("/logout", logoutUser);

export default router;
