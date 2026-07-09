import mongoose, { Document, Model, Schema } from "mongoose";

interface ISession extends Document {
  user: mongoose.Types.ObjectId;
  refreshTokenHash: string;
  ip: string;
  userAgent: string;
  isRevoked: boolean;
  expiresAt: Date;
}

const sessionSchema = new Schema<ISession>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    refreshTokenHash: {
      type: String,
      required: true,
    },

    ip: {
      type: String,
      required: true,
    },

    userAgent: {
      type: String,
      required: true,
    },

    isRevoked: {
      type: Boolean,
      default: false,
    },

    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true },
);

sessionSchema.index({ user: 1, isRevoked: 1 });

export const Session: Model<ISession> = mongoose.model(
  "Session",
  sessionSchema,
);
