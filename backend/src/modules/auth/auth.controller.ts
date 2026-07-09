import { Request, Response } from "express";
import { RegisterBody } from "../../types/auth.types.js";
import asyncHandler from "../../utils/asyncHandler.js";
import ApiError from "../../utils/ApiError.js";
import User from "../user/user.model.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/tokens.js";
import { cookieOptions } from "../../utils/cookieOptions.js";

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
      .json({ success: true, message: "User registered successfully" });
  },
);

export { registerUser };
