import { ParsedResume } from "../types/ai.types.js";
import { buildPrompt, parseAIResponse, RelevanceResult } from "../utils/relevance.utils.js";
import { callGemini } from "./ai/ai.client.js";

export const calculateProjectRelevance = async (
  projects: ParsedResume["projects"],
  jobDescription: string,
): Promise<RelevanceResult> => {
  if (projects.length === 0) {
    return { score: 0, reasoning: "no_projects" };
  }

  const items = projects
    .map(
      (p) =>
        `- ${p.name}: ${p.description ?? ""} (Tech: ${(p.techStack ?? []).join(", ")})`,
    )
    .join("\n");

  const prompt = buildPrompt(items, jobDescription, "projects");

  try {
    const raw = await callGemini(prompt);
    return parseAIResponse(raw);
  } catch {
    return { score: 0, reasoning: "ai_call_failed" };
  }
};
