export interface ATSResult {
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
  atsScore: number;
}
