import express from "express";
import { verifyToken } from "../../middlewares/auth.middleware.js";
import {
  getResumeRecommendationsAndGuide,
  getRecentAnalyses,
  getDashboardStats,
  tailorResume,
} from "./resume-analysis.controller.js";

const router = express.Router();
router.use(verifyToken);

router.get("/dashboard-stats", getDashboardStats);
router.get("/recent", getRecentAnalyses);
router.post("/analyze/:resumeId", getResumeRecommendationsAndGuide);
router.post("/tailor/:resumeId", tailorResume);

export default router;
