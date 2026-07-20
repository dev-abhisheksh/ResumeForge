import express from "express";
import { verifyToken } from "../../middlewares/auth.middleware.js";
import {
  getResumeRecommendationsAndGuide,
  getRecentAnalyses,
} from "./resume-analysis.controller.js";

const router = express.Router();
router.use(verifyToken);

router.get("/recent", getRecentAnalyses);
router.post("/analyze/:resumeId", getResumeRecommendationsAndGuide);

export default router;
