import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import ApiError from "./ApiError.js";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export const uploadToCloudinary = (
  buffer: Buffer,
  filename: string,
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "raw",
        folder: "resumeForge/resumes",
        public_id: filename,
      },
      (error, result) => {
        if (error) return reject(new ApiError(500, "Failed to upload file"));
        resolve(result!);
      },
    );
    stream.end(buffer);
  });
};
