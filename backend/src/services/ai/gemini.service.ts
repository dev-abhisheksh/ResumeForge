import { gemini } from "../../config/gemini.js";
import { RESUME_PARSE_PROMPT } from "../../prompts/resume.prompt.js";

export const parseResume = async (resumeText: string) => {
  const response = await gemini.models.generateContent({
    model: "gemini-3.1-flash-lite",
    contents: `
${RESUME_PARSE_PROMPT}

Resume:

${resumeText}
`,
  });

  const text = response.text;

  if (!text) {
    throw new Error("Gemini returned an empty response.");
  }

  return JSON.parse(text);
};
