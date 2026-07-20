import ApiError from "../../utils/ApiError.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { Request, Response } from "express";
import { ResumeAnalysis } from "./resume-analysis.model.js";
import { generateATSRecommendations } from "../../services/ats-recommendation.service.js";
import { ATSResult } from "../../types/ats-result.types.js";

const getResumeRecommendationsAndGuide = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { resumeId } = req.params;
    if (!resumeId) throw new ApiError(400, "Resume ID is required");

    const resumeAnalysis = await ResumeAnalysis.findOne({ resume: resumeId });
    if (!resumeAnalysis) throw new ApiError(404, "Resume Analysis not found");

    const atsResult: ATSResult = {
      overallScore: resumeAnalysis.atsScore ?? 0,
      atsScore: resumeAnalysis.atsScore ?? 0,
      keywordScore: resumeAnalysis.keywordScore ?? 0,
      skillsScore: resumeAnalysis.skillsScore ?? 0,
      experienceScore: resumeAnalysis.experienceScore ?? 0,
      educationScore: resumeAnalysis.educationScore ?? 0,
      projectScore: resumeAnalysis.projectScore ?? 0,

      matchedKeywords: resumeAnalysis.matchedKeywords ?? [],
      missingKeywords: resumeAnalysis.missingKeywords ?? [],

      experienceReasoning: resumeAnalysis.experienceReasoning ?? "",
      projectReasoning: resumeAnalysis.projectReasoning ?? "",
    };

    const result = await generateATSRecommendations(
      resumeAnalysis?.structuredResume,
      resumeAnalysis?.jobDescription,
      atsResult,
    );

    res.status(200).json({ result });
  },
);

const getRecentAnalyses = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const recentAnalyses = await ResumeAnalysis.find({ user: req.user!._id })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("resume", "title fileType fileUrl");

    res.status(200).json({
      success: true,
      count: recentAnalyses.length,
      analyses: recentAnalyses,
    });
  },
);

export { getResumeRecommendationsAndGuide, getRecentAnalyses };
