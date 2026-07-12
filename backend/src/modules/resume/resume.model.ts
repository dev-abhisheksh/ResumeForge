import { Document, Schema, model, Types } from "mongoose";

export interface IResume extends Document {
  user: Types.ObjectId;
  title: string;
  fileUrl?: string;
  fileType: "pdf" | "docx" | "latex" | "text";
  extractedText: string;
  createdAt: Date;
  updatedAt: Date;
  status: "processing" | "completed" | "failed";
}

const resumeSchema = new Schema<IResume>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["processing", "completed", "failed"],
      default: "processing",
    },

    fileUrl: {
      type: String,
      required: false,
    },

    fileType: {
      type: String,
      enum: ["pdf", "docx", "latex", "text"],
      required: true,
    },

    extractedText: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

resumeSchema.index({ user: 1 });

export const Resume = model<IResume>("Resume", resumeSchema);
