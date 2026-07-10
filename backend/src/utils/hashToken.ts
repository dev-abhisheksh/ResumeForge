import crypto from "crypto";
import { token } from "morgan";

export const hashToken = (token: string): string => {
  return crypto.createHash("sha256").update(token).digest("hex");
};
