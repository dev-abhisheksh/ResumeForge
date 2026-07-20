import express from "express";
import { verifyToken } from "../../middlewares/auth.middleware.js";
import {
  deleteResume,
  detailedResume,
  myResumes,
  uploadResume,
} from "./resume.controller.js";
import { upload } from "../../middlewares/multer.middleware.js";

const router = express.Router();
router.use(verifyToken);

router.post("/upload", upload.single("resume"), uploadResume);
router.get("/", myResumes);

router.delete("/:resumeId", deleteResume);
router.get("/:resumeId", detailedResume);

export default router;
