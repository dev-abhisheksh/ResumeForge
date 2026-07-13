import { ParsedResume } from "../types/ai.types.js";

interface ATSResult {
  overallScore: number;
  keywordScore: number;
  skillsScore: number;
  experienceScore: number;
  educationScore: number;
  projectScore: number;
  missingKeywords: string[];
}

export const calculateATS = (
  resume: ParsedResume,
  jobDescription: string,
): ATSResult => {
  return {
    overallScore: 0,
    keywordScore: 0,
    skillsScore: 0,
    experienceScore: 0,
    educationScore: 0,
    projectScore: 0,
    missingKeywords: [],
  };
};
