import { Schema, model, Types, Document } from "mongoose";

export interface IProject extends Document {
  user: Types.ObjectId;
  title: string;
  rawData: string;
  summary?: string;
  techStack: string[];
  bulletPoints: string[];
}

const projectSchema = new Schema<IProject>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    rawData: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2500,
      minlength: 20,
    },

    summary: {
      type: String,
      trim: true,
      default: "",
    },

    techStack: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],

    bulletPoints: [
      {
        type: String,
        trim: true,
        maxlength: 400,
      },
    ],
  },
  { timestamps: true },
);

projectSchema.index({ user: 1 });
projectSchema.index({ techStack: 1 });

export const Project = model<IProject>("Project", projectSchema);
