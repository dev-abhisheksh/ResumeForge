export interface RelevanceResult {
  score: number; // 0-30
  reasoning: string;
}

export const buildPrompt = (
  items: string,
  jobDescription: string,
  type: "experience" | "projects",
): string =>
  `
You are an ATS relevance scorer. Score how relevant the candidate's ${type} is to the job description below, from 0-30.

Job Description:
${jobDescription}

Candidate ${type}:
${items}

Scoring rules:
- 25-30: Directly relevant tech stack + domain, strong match
- 15-24: Partial overlap in skills/domain
- 5-14: Weak/tangential relevance
- 0-4: Not relevant

Respond ONLY with valid JSON, no markdown, no preamble:
{"score": number, "reasoning": "one sentence"}
`.trim();

export const parseAIResponse = (raw: string): RelevanceResult => {
  const cleaned = raw.replace(/```json|```/g, "").trim();

  try {
    const parsed = JSON.parse(cleaned);
    return {
      score: Math.max(0, Math.min(30, Number(parsed.score) || 0)),
      reasoning: typeof parsed.reasoning === "string" ? parsed.reasoning : "",
    };
  } catch {
    return { score: 0, reasoning: "parse_failed" };
  }
};
