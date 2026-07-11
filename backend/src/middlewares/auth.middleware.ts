import { Session } from "../modules/session/session.model.js";
import User from "../modules/user/user.model.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const verifyToken = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const token =
      req.cookies?.accessToken ||
      req.headers?.authorization?.replace("Bearer ", "") ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) throw new ApiError(401, "Not authorized");

    let decoded;

    try {
      decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as {
        _id: string;
        email: string;
        session: string;
      };
    } catch (error) {
      throw new ApiError(401, "Invalid or expired token");
    }

    if (!decoded) throw new ApiError(401, "Invalid token");

    const session = await Session.findById(decoded?.session);
    if (!session || session.isRevoked || session.expiresAt < new Date())
      throw new ApiError(401, "Session revoked or expired");

    const user = await User.findById(decoded?._id).select("-password");
    if (!user) throw new ApiError(404, "User not found");

    req.user = user;
    next();
  },
);
