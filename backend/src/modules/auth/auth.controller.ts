import { Request, Response } from "express";
import { LoginBody, RegisterBody } from "../../types/auth.types.js";
import asyncHandler from "../../utils/asyncHandler.js";
import ApiError from "../../utils/ApiError.js";
import User from "../user/user.model.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/tokens.js";
import { cookieOptions } from "../../utils/cookieOptions.js";
import { hashToken } from "../../utils/hashToken.js";
import { Session } from "../session/session.model.js";
import jwt from "jsonwebtoken";

const registerUser = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { fullName, email, password } = req.body as RegisterBody;

    if (!fullName?.trim() || !email?.trim() || !password?.trim()) {
      throw new ApiError(400, "All fields are required");
    }

    const userExists = await User.findOne({ email });
    if (userExists) throw new ApiError(409, "User already exist. Please login");

    const user = await User.create({
      fullName,
      email,
      password,
    });

    if (!user) throw new ApiError(500, "Failed to register user");

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    const refreshTokenHash = hashToken(refreshToken);

    const session = await Session.create({
      user: user._id,
      refreshTokenHash,
      ip: req.ip ?? "Unknown",
      userAgent: req.headers["user-agent"] ?? "Unknown",
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    if (!session) throw new ApiError(500, "Failed to establish session");

    res
      .cookie("accessToken", accessToken, {
        ...cookieOptions,
        maxAge: 15 * 60 * 1000,
      })
      .cookie("refreshToken", refreshToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(201)
      .json({
        success: true,
        message: "User registered successfully",
        data: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
        },
      });
  },
);

const loginUser = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body as LoginBody;

    if (!email?.trim() || !password?.trim())
      throw new ApiError(400, "All fields are required");

    const userExists = await User.findOne({ email }).select("+password");
    if (!userExists) throw new ApiError(404, "User not found. Plese Register");

    const isMatch = await userExists.comparePassword(password);
    if (!isMatch) throw new ApiError(400, "Invalid Credentials");

    const accessToken = generateAccessToken(userExists);
    const refreshToken = generateRefreshToken(userExists);

    res
      .cookie("accessToken", accessToken, {
        ...cookieOptions,
        maxAge: 15 * 60 * 1000,
      })
      .cookie("refreshToken", refreshToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({ success: true, message: "User logged in successfully" });
  },
);

const refreshTokenRotation = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) throw new ApiError(400, "RefreshToken not found");

    let decoded;

    try {
      decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as {
        _id: string;
      };
    } catch (error) {
      throw new ApiError(401, "Invalid or expired refresh token");
    }

    if (!decoded) throw new ApiError(400, "Invalid refreshToken");

    const user = await User.findById(decoded._id);
    if (!user) throw new ApiError(404, "user not found");

    const refreshTokenHash = hashToken(refreshToken);

    const session = await Session.findOne({
      user: decoded._id,
      refreshTokenHash,
      isRevoked: false,
    });

    if (!session) {
      await Session.updateMany(
        { user: user._id },
        { isRevoked: true, expiresAt: new Date() },
      );
      throw new ApiError(401, "Invalid refreshToken");
    }

    if (session.expiresAt < new Date())
      throw new ApiError(401, "Session expired");

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);
    const newRefreshTokenHash = hashToken(newRefreshToken);

    session.refreshTokenHash = newRefreshTokenHash;
    session.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await session.save();

    res
      .cookie("accessToken", newAccessToken, {
        ...cookieOptions,
        maxAge: 15 * 60 * 1000,
      })
      .cookie("refreshToken", newRefreshToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        success: true,
        message: "Token refreshed successfully",
      });
  },
);

const logoutUser = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {},
);

export { registerUser, loginUser };
