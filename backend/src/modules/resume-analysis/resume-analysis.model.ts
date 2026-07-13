import { Schema, model, Document, Types } from "mongoose";

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
  tailoredContent?: string;
  status: "processing" | "completed" | "failed";
  createdAt: Date;
  updatedAt: Date;
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
    tailoredContent: { type: String },
    status: {
      type: String,
      enum: ["processing", "completed", "failed"],
      default: "processing",
    },
  },
  { timestamps: true },
);

resumeAnalysisSchema.index({ user: 1 });
resumeAnalysisSchema.index({ resume: 1 });
resumeAnalysisSchema.index({ user: 1, createdAt: -1 });

export const ResumeAnalysis = model<IResumeAnalysis>(
  "ResumeAnalysis",
  resumeAnalysisSchema,
);
