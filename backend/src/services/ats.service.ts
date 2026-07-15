import { ParsedResume } from "../types/ai.types.js";
import { gemini } from "../config/gemini.js";

interface ATSResult {
  overallScore: number;
  keywordScore: number;
  skillsScore: number;
  experienceScore: number;
  educationScore: number;
  projectScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  experienceReasoning: string;
  projectReasoning: string;
}

/**
 * Evaluates a parsed resume against a job description using Gemini AI.
 * This simplifies scoring by leveraging LLM semantic understanding instead of manual regex.
 */
export const calculateATS = async (
  resume: ParsedResume,
  jobDescription: string,
): Promise<ATSResult> => {
  const prompt = `
You are an expert Applicant Tracking System (ATS) and HR assistant. Evaluate the provided candidate's resume against the Job Description and return a structured JSON scoring assessment.

Job Description:
${jobDescription}

Candidate Resume Data (JSON):
${JSON.stringify(resume, null, 2)}

Scoring Guide (Total possible score of 125, which will be normalized to 100):
1. keywordScore (0-30 points): Matches of key terms and technical skills between resume and job description.
2. skillsScore (0-20 points): Depth, variety, and relevance of skills listed.
3. experienceScore (0-30 points): Professional history relevance, roles, and responsibilities. Also provide a brief experienceReasoning.
4. educationScore (0-15 points): Academic credentials and relevance.
5. projectScore (0-30 points): Quality, tech stack, and scope of projects relative to the role. Also provide a brief projectReasoning.

Also extract:
- matchedKeywords: List of key terms/skills matched.
- missingKeywords: List of key terms/skills from the Job Description that are missing on the resume.

You must respond ONLY with a valid JSON object matching this schema:
{
  "keywordScore": number,
  "skillsScore": number,
  "experienceScore": number,
  "experienceReasoning": "string explanation",
  "educationScore": number,
  "projectScore": number,
  "projectReasoning": "string explanation",
  "matchedKeywords": ["string"],
  "missingKeywords": ["string"]
}
`;

  try {
    const response = await gemini.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty response received from Gemini.");
    }

    const parsed = JSON.parse(text);

    // Bound scores to their respective ranges
    const keywordScore = Math.max(0, Math.min(30, Number(parsed.keywordScore) || 0));
    const skillsScore = Math.max(0, Math.min(20, Number(parsed.skillsScore) || 0));
    const experienceScore = Math.max(0, Math.min(30, Number(parsed.experienceScore) || 0));
    const educationScore = Math.max(0, Math.min(15, Number(parsed.educationScore) || 0));
    const projectScore = Math.max(0, Math.min(30, Number(parsed.projectScore) || 0));

    // Calculate normalized overall score out of 100
    const rawTotal = keywordScore + skillsScore + experienceScore + educationScore + projectScore;
    const overallScore = Math.round((rawTotal / 125) * 100);

    return {
      overallScore,
      keywordScore,
      skillsScore,
      experienceScore,
      educationScore,
      projectScore,
      matchedKeywords: Array.isArray(parsed.matchedKeywords) ? parsed.matchedKeywords : [],
      missingKeywords: Array.isArray(parsed.missingKeywords) ? parsed.missingKeywords : [],
      experienceReasoning: parsed.experienceReasoning || "",
      projectReasoning: parsed.projectReasoning || "",
    };
  } catch (error) {
    console.error("Error calculating ATS score with Gemini:", error);
    // Fallback/Default values in case of failure
    return {
      overallScore: 0,
      keywordScore: 0,
      skillsScore: 0,
      experienceScore: 0,
      educationScore: 0,
      projectScore: 0,
      matchedKeywords: [],
      missingKeywords: [],
      experienceReasoning: "AI evaluation failed.",
      projectReasoning: "AI evaluation failed.",
    };
  }
};

