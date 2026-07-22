import { IUser } from "../modules/user/user.model.js";
import jwt from "jsonwebtoken";

export const generateAccessToken = (user: IUser, sessionId: string): string => {
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
      fullName: user.fullName,
      session: sessionId,
    },
    process.env.ACCESS_TOKEN_SECRET!,
    {
      expiresIn: "15m",
    },
  );
};

export const generateRefreshToken = (user: IUser): string => {
  return jwt.sign(
    {
      _id: user._id,
    },
    process.env.REFRESH_TOKEN_SECRET!,
    {
      expiresIn: "7d",
    },
  );
};
