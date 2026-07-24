import express from "express"
import { addProject, fetchDetailedProject, fetchProjects, removeProject } from "./project.controller.js";
import { verifyToken } from "../../middlewares/auth.middleware.js";

const router = express.Router();
router.use(verifyToken)

router.post("/add", addProject)
router.get("/", fetchProjects)

router.get("/:projectId", fetchDetailedProject)
router.delete("/:projectId", removeProject)

export default router;