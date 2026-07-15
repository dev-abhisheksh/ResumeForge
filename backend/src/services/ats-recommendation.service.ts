import groq from "../config/groq.js";
import { ATS_RECOMMENDATION_PROMPT } from "../prompts/ats-recommendation.prompt.js";
import { ParsedResume } from "../types/ai.types.js";
import { ATSResult } from "../types/ats-result.types.js";

export const generateATSRecommendations = async (
  resume: ParsedResume,
  jobDescription: string,
  atsResult: ATSResult,
) => {
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

  return JSON.parse(completion.choices[0].message.content!);
};
