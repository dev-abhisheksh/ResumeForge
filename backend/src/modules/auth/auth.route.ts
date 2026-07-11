import express from "express";
import {
  loginUser,
  logoutUser,
  refreshTokenRotation,
  registerUser,
} from "./auth.controller.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/refresh-token", refreshTokenRotation);
router.post("/logout", logoutUser);

export default router;
