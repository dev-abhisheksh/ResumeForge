import fs from "fs/promises";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";
import ApiError from "./ApiError.js";

export const extractText = async (
  filePath: string,
  mimetype: string,
): Promise<string> => {
  if (mimetype === "application/pdf") {
    const buffer = await fs.readFile(filePath);
    const data = await pdfParse(buffer);
    return data.text;
  }

  if (
    mimetype ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const { value } = await mammoth.extractRawText({ path: filePath });
    return value;
  }

  if (mimetype === "text/x-tex" || mimetype === "text/plain") {
    return await fs.readFile(filePath, "utf-8");
  }

  throw new ApiError(400, "Unsupported file type for extraction");
};
