import express from "express"
import { addProject, fetchProjects } from "./project.controller.js";
import { verifyToken } from "../../middlewares/auth.middleware.js";

const router = express.Router();
router.use(verifyToken)

router.post("/add", addProject)
router.get("/", fetchProjects)

export default router;