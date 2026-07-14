import { ParsedResume } from "../types/ai.types.js";
import {
  buildPrompt,
  parseAIResponse,
  RelevanceResult,
} from "../utils/relevance.utils.js";
import { callGemini } from "./ai/ai.client.js";

export const caculateExperienceRelevance = async (
  experience: ParsedResume["experience"],
  jobDescription: string,
): Promise<RelevanceResult> => {
  if (experience.length === 0) return { score: 0, reasoning: "no_experience" };

  const items = experience
    .map((e) => `- ${e.title} at ${e.company}: ${e.description ?? ""}`)
    .join("\n");

  const prompt = buildPrompt(items, jobDescription, "experience");

  try {
    const raw = await callGemini(prompt);
    return parseAIResponse(raw);
  } catch (error) {
    return { score: 0, reasoning: "ai_call_failed" };
  }
};
