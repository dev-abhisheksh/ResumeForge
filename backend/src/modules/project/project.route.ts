import express from "express"
import { addProject, fetchDetailedProject, fetchProjects } from "./project.controller.js";
import { verifyToken } from "../../middlewares/auth.middleware.js";

const router = express.Router();
router.use(verifyToken)

router.post("/add", addProject)
router.get("/", fetchProjects)

router.get("/:projectId", fetchDetailedProject)


export default router;