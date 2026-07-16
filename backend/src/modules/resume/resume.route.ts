import express from "express";
import { verifyToken } from "../../middlewares/auth.middleware.js";
import { myResumes, uploadResume } from "./resume.controller.js";
import { upload } from "../../middlewares/multer.middleware.js";

const router = express.Router();
router.use(verifyToken);

router.post("/upload", upload.single("resume"), uploadResume);
router.get("/my-resumes", myResumes);

export default router;
