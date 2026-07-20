import ApiError from "../../utils/ApiError.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { Request, Response } from "express";
import { ResumeAnalysis } from "./resume-analysis.model.js";
import { Resume } from "../resume/resume.model.js";
import { parseResume } from "../../services/ai/gemini.service.js";
import { calculateATS } from "../../services/ats.service.js";
import { generateATSRecommendations } from "../../services/ats-recommendation.service.js";
import { ATSResult } from "../../types/ats-result.types.js";

const getResumeRecommendationsAndGuide = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { resumeId } = req.params;
    const { jobDescription, company, role } = req.body;

    if (!resumeId) throw new ApiError(400, "Resume ID is required");
    if (!jobDescription || typeof jobDescription !== "string" || !jobDescription.trim()) {
      throw new ApiError(400, "Job description is required for analysis");
    }

    const resume = await Resume.findById(resumeId);
    if (!resume) throw new ApiError(404, "Resume not found");

    // 1. Extract and Parse Structured Resume Data
    const textToParse = resume.extractedText || resume.title || "General Resume";
    const structuredResume = await parseResume(textToParse);

    // 2. Dynamically calculate ATS scores against the specific target Job Description
    const atsResult: ATSResult = await calculateATS(structuredResume, jobDescription);

    // 3. Generate AI recommendations & improvement guide
    const aiRecommendations = await generateATSRecommendations(
      structuredResume,
      jobDescription,
      atsResult,
    );

    // Extract suggestions array safely
    const suggestionsList =
      (aiRecommendations as any)?.recommendations ||
      (aiRecommendations as any)?.suggestions ||
      [];

    // 4. Save a new ResumeAnalysis document in MongoDB for this scan
    const newAnalysis = await ResumeAnalysis.create({
      user: req.user!._id,
      resume: resume._id,
      jobDescription: jobDescription.trim(),
      company: company ? String(company).trim() : "",
      role: role ? String(role).trim() : "",
      atsScore: atsResult.overallScore,
      keywordScore: atsResult.keywordScore,
      skillsScore: atsResult.skillsScore,
      experienceScore: atsResult.experienceScore,
      educationScore: atsResult.educationScore,
      projectScore: atsResult.projectScore,
      matchedKeywords: atsResult.matchedKeywords,
      missingKeywords: atsResult.missingKeywords,
      suggestions: suggestionsList,
      experienceReasoning: atsResult.experienceReasoning,
      projectReasoning: atsResult.projectReasoning,
      structuredResume,
      status: "completed",
    });

    res.status(200).json({
      success: true,
      analysis: newAnalysis,
      result: {
        _id: newAnalysis._id,
        atsScore: newAnalysis.atsScore,
        overallScore: newAnalysis.atsScore,
        keywordScore: newAnalysis.keywordScore,
        skillsScore: newAnalysis.skillsScore,
        experienceScore: newAnalysis.experienceScore,
        educationScore: newAnalysis.educationScore,
        projectScore: newAnalysis.projectScore,
        matchedKeywords: newAnalysis.matchedKeywords,
        missingKeywords: newAnalysis.missingKeywords,
        suggestions: newAnalysis.suggestions,
        recommendations: newAnalysis.suggestions,
        experienceReasoning: newAnalysis.experienceReasoning,
        projectReasoning: newAnalysis.projectReasoning,
        jobDescription: newAnalysis.jobDescription,
        company: newAnalysis.company,
        role: newAnalysis.role,
        createdAt: newAnalysis.createdAt,
      },
    });
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
