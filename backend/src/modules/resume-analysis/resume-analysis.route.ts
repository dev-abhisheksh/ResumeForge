import express from "express";
import { verifyToken } from "../../middlewares/auth.middleware.js";
import { getResumeRecommendationsAndGuide } from "./resume-analysis.controller.js";

const router = express.Router();
router.use(verifyToken);

router.post("/analyze/:resumeId", getResumeRecommendationsAndGuide);

export default router;
