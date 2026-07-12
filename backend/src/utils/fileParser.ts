import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");
import mammoth from "mammoth";
import ApiError from "./ApiError.js";

export const extractText = async (
  buffer: Buffer,
  mimetype: string,
): Promise<string> => {
  if (mimetype === "application/pdf") {
    const data = await pdfParse(buffer);
    return data.text;
  }

  if (
    mimetype ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const { value } = await mammoth.extractRawText({ buffer });
    return value;
  }

  if (mimetype === "text/x-tex" || mimetype === "text/plain") {
    return buffer.toString("utf-8");
  }

  throw new ApiError(400, "Unsupported file type for extraction");
};
