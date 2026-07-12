import { Worker } from "bullmq";
import { Resume } from "../modules/resume/resume.model.js";
import { redisConnection } from "../config/redis.js";
import { parseResume } from "../services/ai/gemini.service.js";

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

    console.log("Resume Title:", resume.title);
    console.log("Extracted Text:");
    const structuredResume = await parseResume(resume.extractedText);

    console.log(structuredResume);

    // TODO:
    // Gemini
    // ATS Engine
    // Groq

    resume.status = "completed";
    await resume.save();

    return {
      success: true,
    };
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
