import express from "express";
import {
  getMe,
  loginUser,
  logoutUser,
  refreshTokenRotation,
  registerUser,
} from "./auth.controller.js";
import { verifyToken } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me",verifyToken, getMe)
router.get("/refresh-token", refreshTokenRotation);
router.post("/logout", logoutUser);

export default router;
