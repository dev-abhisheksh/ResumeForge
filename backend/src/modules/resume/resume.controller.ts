import { UploadResumeBody } from "../../types/resume.types.js";
import ApiError from "../../utils/ApiError.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { Response, Request } from "express";
import { uploadToCloudinary } from "../../utils/cloudinary.js";
import { Resume } from "./resume.model.js";
import { extractText } from "../../utils/fileParser.js";
import { resumeQueue } from "../../queues/resume.queue.js";
import { success } from "zod";

const uploadResume = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { title, text, jobDescription } = req.body as UploadResumeBody;

    if (!jobDescription?.trim())
      throw new ApiError(400, "Job description is required");
    if (!title?.trim()) throw new ApiError(400, "Title is required");
    if (!req.file && !text)
      throw new ApiError(400, "Either a file or text input is required");
    if (req.file && text)
      throw new ApiError(400, "Provide either a file or text, not both");

    const resumeCount = await Resume.countDocuments({ user: req.user!._id });
    if (resumeCount >= 3)
      throw new ApiError(
        400,
        "Maximum 3 resumes allowed. Delete one to upload a new resume.",
      );

    let fileUrl: string | undefined;
    let fileType: "pdf" | "docx" | "latex" | "text" | undefined;
    let extractedText: string;

    if (req.file) {
      const mimeMap: Record<string, "pdf" | "docx" | "latex"> = {
        "application/pdf": "pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
          "docx",
        "text/x-tex": "latex",
      };

      fileType = mimeMap[req.file.mimetype];
      if (!fileType) throw new ApiError(400, "Unsupported file type");

      const result = await uploadToCloudinary(
        req.file.buffer,
        req.file.originalname,
      );
      fileUrl = result.secure_url;

      extractedText = await extractText(req.file.buffer, req.file.mimetype);
    } else {
      fileType = "text";
      extractedText = text!;
      fileUrl = "";
    }

    const resume = await Resume.create({
      user: req.user!._id,
      title,
      fileUrl,
      fileType,
      extractedText,
      jobDescription,
    });

    const job = await resumeQueue.add("process-resume", {
      resumeId: resume._id,
      jobDescription,
    });

    console.log("✅ Job Added:", job.id);

    res.status(201).json({
      success: true,
      message: "Resume uploaded successfully",
      data: resume,
    });
  },
);

const myResumes = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const resumes = await Resume.find({ user: req.user!._id })
      .sort({ createdAt: -1 })
      .select("-extractedText");

    res.status(200).json({
      success: true,
      count: resumes.length,
      data: resumes,
    });
  },
);

const detailedResume = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { resumeId } = req.params;
    if (!resumeId) throw new ApiError(400, "Resume ID is required");

    const resume = await Resume.findOne({
      _id: resumeId,
      user: req.user!._id,
    });

    if (!resume) throw new ApiError(404, "Resume not found");

    res.status(200).json({
      success: true,
      resume,
    });
  },
);

export { uploadResume, myResumes, detailedResume };
