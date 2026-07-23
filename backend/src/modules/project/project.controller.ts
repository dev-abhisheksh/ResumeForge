import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler.js";
import { AddProjectBody } from "../../types/project.types.js";
import ApiError from "../../utils/ApiError.js";
import { Project } from "./project.model.js";
import { processProjectWithGroq } from "../../services/project-ai.service.js";

const addProject = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { title, techStack, rawData } = req.body as AddProjectBody;

    if (!title.trim() || !rawData.trim())
      throw new ApiError(400, "Title and Project data is required");
    if (!techStack || (Array.isArray(techStack) && techStack.length === 0))
      throw new ApiError(400, "Please enter techs used in this project.");

    const sanitizedTechStack = Array.isArray(techStack)
    ? techStack.map((t)=> t.trim()).filter(Boolean)
    : String(techStack).split(",").map((t)=> t.trim()).filter(Boolean)

    const aiResult = await processProjectWithGroq(title, sanitizedTechStack, rawData);

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

export {addProject}