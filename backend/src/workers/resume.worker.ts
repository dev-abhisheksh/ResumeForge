import { Worker } from "bullmq";
import { Resume } from "../modules/resume/resume.model.js";
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

    const structuredResume = await parseResume(resume.extractedText);

    const atsResult = calculateATS(structuredResume, job.data.jobDescription);

    console.log(atsResult);
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
