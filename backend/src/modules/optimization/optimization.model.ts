import { Schema, model, Document, Types } from "mongoose";

interface IOptimizationVersion {
  tailoredContent: string;
  atsScore: number;
  suggestions: string[];
  atsBreakdown?: {
    keywordScore?: number;
    skillScore?: number;
    formattingScore?: number;
    sectionScore?: number;
  };
  createdAt: Date;
}

export interface IOptimization extends Document {
  user: Types.ObjectId;
  resume: Types.ObjectId;
  jobDescription: {
    text: string;
    company: string;
    role: string;
    experienceLevel: string;
  };
  status: "processing" | "completed" | "failed";
  versions: IOptimizationVersion[];
  createdAt: Date;
  updatedAt: Date;
}

const optimizationSchema = new Schema<IOptimization>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    resume: { type: Schema.Types.ObjectId, ref: "Resume", required: true },
    jobDescription: {
      text: { type: String, required: true },
      company: String,
      role: String,
      experienceLevel: String,
    },
    status: {
      type: String,
      enum: ["processing", "completed", "failed"],
      default: "processing",
    },
    versions: [
      {
        tailoredContent: String,
        atsScore: Number,
        suggestions: [String],
        atsBreakdown: {
          keywordScore: Number,
          skillScore: Number,
          formattingScore: Number,
          sectionScore: Number,
        },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true },
);

optimizationSchema.index({ user: 1 });
optimizationSchema.index({ resume: 1 });
optimizationSchema.index({ user: 1, createdAt: -1 });

export const Optimization = model<IOptimization>(
  "Optimization",
  optimizationSchema,
);
