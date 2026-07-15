import groq from "../config/groq.js";
import { ATS_RECOMMENDATION_PROMPT } from "../prompts/ats-recommendation.prompt.js";
import { ParsedResume } from "../types/ai.types.js";
import { ATSRecommendation } from "../types/ats-recommendation.types.js";
import { ATSResult } from "../types/ats-result.types.js";

export const generateATSRecommendations = async (
  resume: ParsedResume,
  jobDescription: string,
  atsResult: ATSResult,
): Promise<ATSRecommendation> => {
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    temperature: 0.3,
    response_format: {
      type: "json_object",
    },
    messages: [
      {
        role: "system",
        content: ATS_RECOMMENDATION_PROMPT,
      },
      {
        role: "user",
        content: `
Job Description:

${jobDescription}

Parsed Resume:

${JSON.stringify(resume, null, 2)}

ATS Analysis:

${JSON.stringify(atsResult, null, 2)}
`,
      },
    ],
  });

  const content = completion.choices[0]?.message.content;

  if (!content) {
    throw new Error("Groq returned an empty response.");
  }

  try {
    return JSON.parse(content) as ATSRecommendation;
  } catch (error) {
    console.error("Failed to parse Groq response:", error);
    throw new Error("Invalid JSON response received from Groq.");
  }
};
