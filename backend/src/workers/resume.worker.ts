import { Worker } from "bullmq";
import { Resume } from "../modules/resume/resume.model.js";
import { ResumeAnalysis } from "../modules/resume-analysis/resume-analysis.model.js";
import { redisConnection } from "../config/redis.js";
import { parseResume } from "../services/ai/gemini.service.js";
import { calculateATS } from "../services/ats.service.js";

console.log("🚀 Resume Worker Loaded");

const resumeWorker = new Worker(
  "resume-processing",
  async (job) => {
    console.log(`Processing Job: ${job.id}`);

    const { resumeId } = job.data;

    const resume = await Resume.findById(resumeId);

    if (!resume) {
      throw new Error("Resume not found");
    }

    try {
      const structuredResume = await parseResume(resume.extractedText);

      const atsResult = await calculateATS(structuredResume, job.data.jobDescription);

      console.log(`🎯 ATS Score calculated for "${resume.title}":`, atsResult.overallScore);
      console.log("Detailed ATS Breakdown:", {
        keywordScore: atsResult.keywordScore,
        skillsScore: atsResult.skillsScore,
        experienceScore: atsResult.experienceScore,
        educationScore: atsResult.educationScore,
        projectScore: atsResult.projectScore,
        matchedKeywords: atsResult.matchedKeywords,
        missingKeywords: atsResult.missingKeywords,
      });

      // Save the analysis results to the database
      await ResumeAnalysis.create({
        user: resume.user,
        resume: resume._id,
        jobDescription: job.data.jobDescription,
        atsScore: atsResult.overallScore,
        keywordScore: atsResult.keywordScore,
        skillsScore: atsResult.skillsScore,
        experienceScore: atsResult.experienceScore,
        educationScore: atsResult.educationScore,
        projectScore: atsResult.projectScore,
        matchedKeywords: atsResult.matchedKeywords,
        missingKeywords: atsResult.missingKeywords,
        structuredResume: structuredResume,
        status: "completed",
      });

      resume.status = "completed";
      await resume.save();

      return {
        success: true,
        atsScore: atsResult.overallScore,
      };
    } catch (error) {
      console.error(`❌ Failed to process resume job ${job.id}:`, error);
      resume.status = "failed";
      await resume.save();
      throw error;
    }
  },
  {
    connection: redisConnection,
  },
);

resumeWorker.on("completed", (job) => {
  console.log(`✅ Job ${job.id} completed`);
});

resumeWorker.on("failed", (job, err) => {
  console.log(`❌ Job ${job?.id} failed`);
  console.error(err);
});

export default resumeWorker;
