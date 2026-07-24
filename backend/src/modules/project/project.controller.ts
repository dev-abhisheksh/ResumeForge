import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler.js";
import {
  AddProjectBody,
  DeleteProjectParams,
} from "../../types/project.types.js";
import ApiError from "../../utils/ApiError.js";
import { Project } from "./project.model.js";
import { processProjectWithGroq } from "../../services/project-ai.service.js";
import mongoose from "mongoose";
import { success } from "zod";

const addProject = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { title, techStack, rawData } = req.body as AddProjectBody;

    if (!title.trim() || !rawData.trim())
      throw new ApiError(400, "Title and Project data is required");
    if (!techStack || (Array.isArray(techStack) && techStack.length === 0))
      throw new ApiError(400, "Please enter techs used in this project.");

    const sanitizedTechStack = Array.isArray(techStack)
      ? techStack.map((t) => t.trim()).filter(Boolean)
      : String(techStack)
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);

    const projectCount = await Project.countDocuments({ user: req.user!._id });
    if (projectCount >= 3)
      throw new ApiError(
        400,
        "Max three projects can be maintained on FREE acc",
      );

    const aiResult = await processProjectWithGroq(
      title,
      sanitizedTechStack,
      rawData,
    );

    const project = await Project.create({
      user: req.user!._id,
      title: title.trim(),
      techStack: sanitizedTechStack,
      rawData: rawData.trim(),
      summary: aiResult.summary,
      bulletPoints: aiResult.bulletPoints,
    });

    res.status(201).json({
      success: true,
      message: "Project added successfully.",
      project,
    });
  },
);

const fetchProjects = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const user = req.user!._id;

    const projects = await Project.find({ user })
      .sort({ createdAt: -1 })
      .select("-rawData -__v");

    res.status(200).json({
      success: true,
      message: "Fetched all projects",
      projects,
    });
  },
);

const fetchDetailedProject = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { projectId } = req.params;
    if (!projectId) throw new ApiError(400, "Project ID is required");

    const project = await Project.findOne({
      _id: projectId,
      user: req.user!._id,
    }).select("-__v");

    if (!project) throw new ApiError(404, "Project not found");

    res.status(200).json({
      success: true,
      message: "Fetched project details successfully.",
      project,
    });
  },
);

const removeProject = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { projectId } = req.params;

    if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
      throw new ApiError(400, "Valid Project ID is required");
    }

    const deletedProject = await Project.findOneAndDelete({
      _id: projectId,
      user: req.user!._id,
    });

    if (!deletedProject) {
      throw new ApiError(404, "Project not found or already deleted");
    }

    res.status(200).json({
      success: true,
      message: "Project deleted successfully from vault",
    });
  },
);

export { addProject, fetchProjects, fetchDetailedProject, removeProject };
