import express from "express";
import { verifyToken } from "../../middlewares/auth.middleware.js";
import {
  getResumeRecommendationsAndGuide,
  getRecentAnalyses,
  getDashboardStats,
  tailorResume,
} from "./resume-analysis.controller.js";
import rateLimiter from "../../middlewares/rateLimiter.middleware.js";

const router = express.Router();
router.use(verifyToken);

router.get("/dashboard-stats", getDashboardStats);
router.get("/recent", getRecentAnalyses);

// Heavy AI Endpoints: 10 requests per 1 hour (3600 seconds)
router.post(
  "/analyze/:resumeId",
  rateLimiter({ keyPrefix: "ai-analyze", limit: 10, windowSec: 3600 }),
  getResumeRecommendationsAndGuide,
);

router.post(
  "/tailor/:resumeId",
  rateLimiter({ keyPrefix: "ai-tailor", limit: 10, windowSec: 3600 }),
  tailorResume,
);

export default router;
