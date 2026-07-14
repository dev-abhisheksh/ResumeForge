import { gemini } from "../../config/gemini.js";

export const callGemini = async (prompt: string): Promise<string> => {
  const response = await gemini.models.generateContent({
    model: "gemini-3.1-flash-lite",
    contents: prompt,
  });
  
  const text = response.text;

  if (!text) {
    throw new Error("Gemini returned an empty response.");
  }

  return text;
};
