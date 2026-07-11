import { Document, Schema, model, Types } from "mongoose";

export interface IResume extends Document {
  user: Types.ObjectId;
  title: string;
  fileUrl: string;
  fileType: "pdf" | "docx" | "latex" | "text";
  extractedText: string;
  createdAt: Date;
  updatedAt: Date;
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

    fileUrl: {
      type: String,
      required: true,
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
