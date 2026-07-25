import groq from "../config/groq.js";
import { TAILOR_RESUME_PROMPT } from "../prompts/tailor-resume.prompt.js";
import { TailoredResumePayload } from "./latex.service.js";

/**
 * Runs Groq Llama 3.3 70B AI tailoring engine
 * Matches Master Resume + Target JD + User Project Vault
 */
export async function tailorResumeWithGroq(
  resumeText: string,
  jobDescription: string,
  vaultProjects: any[],
): Promise<TailoredResumePayload> {
  const userContent = JSON.stringify({
    candidateResumeText: resumeText,
    targetJobDescription: jobDescription,
    candidateProjectVault: vaultProjects.map((p) => ({
      id: p._id,
      title: p.title,
      techStack: p.techStack,
      summary: p.summary,
      bulletPoints: p.bulletPoints,
    })),
  });

  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: TAILOR_RESUME_PROMPT,
      },
      {
        role: "user",
        content: userContent,
      },
    ],
    model: "llama-3.3-70b-versatile",
    temperature: 0.2,
    response_format: { type: "json_object" },
  });

  const content = completion.choices[0]?.message?.content || "{}";
  return JSON.parse(content) as TailoredResumePayload;
}
