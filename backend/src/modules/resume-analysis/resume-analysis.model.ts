import { Schema, model, Document, Types } from "mongoose";
import { ParsedResume } from "../../types/ai.types.js";

export interface IResumeAnalysis extends Document {
  user: Types.ObjectId;
  resume: Types.ObjectId;
  jobDescription: string;
  company?: string;
  role?: string;
  atsScore?: number;
  keywordScore?: number;
  skillsScore?: number;
  experienceScore?: number;
  educationScore?: number;
  projectScore?: number;
  matchedKeywords?: string[];
  missingKeywords?: string[];
  suggestions?: string[];
  optimizedResume?: string;
  status: "processing" | "completed" | "failed";
  createdAt: Date;
  updatedAt: Date;
  structuredResume: ParsedResume;
}

const resumeAnalysisSchema = new Schema<IResumeAnalysis>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    resume: { type: Schema.Types.ObjectId, ref: "Resume", required: true },
    jobDescription: { type: String, required: true },
    company: { type: String },
    role: { type: String },
    atsScore: { type: Number },
    keywordScore: { type: Number },
    skillsScore: { type: Number },
    experienceScore: { type: Number },
    educationScore: { type: Number },
    projectScore: { type: Number },
    matchedKeywords: [{ type: String }],
    missingKeywords: [{ type: String }],
    suggestions: [{ type: String }],
    optimizedResume: { type: String },
    structuredResume: { type: Schema.Types.Mixed, required: true },
    status: {
      type: String,
      enum: ["processing", "completed", "failed"],
      default: "processing",
    },
  },
  { timestamps: true },
);

resumeAnalysisSchema.index({ user: 1 });
resumeAnalysisSchema.index({ resume: 1, createdAt: -1 });
resumeAnalysisSchema.index({ user: 1, createdAt: -1 });

export const ResumeAnalysis = model<IResumeAnalysis>(
  "ResumeAnalysis",
  resumeAnalysisSchema,
);
