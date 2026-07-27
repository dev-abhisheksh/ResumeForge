import express from "express";
import { addProject, fetchDetailedProject, fetchProjects, removeProject } from "./project.controller.js";
import { verifyToken } from "../../middlewares/auth.middleware.js";
import rateLimiter from "../../middlewares/rateLimiter.middleware.js";

const router = express.Router();
router.use(verifyToken);

// Project Vault Add: 10 projects per 15 minutes (900 seconds)
router.post(
  "/add",
  rateLimiter({ keyPrefix: "project-add", limit: 10, windowSec: 900 }),
  addProject,
);

router.get("/", fetchProjects);
router.get("/:projectId", fetchDetailedProject);
router.delete("/:projectId", removeProject);

export default router;