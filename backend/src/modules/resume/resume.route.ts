import express from "express";
import { verifyToken } from "../../middlewares/auth.middleware.js";
import {
  deleteResume,
  detailedResume,
  myResumes,
  uploadResume,
} from "./resume.controller.js";
import { upload } from "../../middlewares/multer.middleware.js";
import rateLimiter from "../../middlewares/rateLimiter.middleware.js";

const router = express.Router();
router.use(verifyToken);

// PDF Upload: 10 uploads per 15 minutes (900 seconds)
router.post(
  "/upload",
  rateLimiter({ keyPrefix: "resume-upload", limit: 10, windowSec: 900 }),
  upload.single("resume"),
  uploadResume,
);

router.get("/", myResumes);
router.get("/my-resumes", myResumes); // Route alias for fetching user's resumes

router.delete("/:resumeId", deleteResume);
router.get("/:resumeId", detailedResume);

export default router;
