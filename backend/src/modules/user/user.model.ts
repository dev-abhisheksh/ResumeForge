import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  fullName: string;
  email: string;
  password: string;
  provider: "local" | "google";
  avatar?: string;
  isVerified: boolean;

  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },

    password: {
      type: String,
      select: false,
      required: function (): boolean {
        return this.provider === "local";
      },
    },

    avatar: {
      type: String,
      default: "",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User;
